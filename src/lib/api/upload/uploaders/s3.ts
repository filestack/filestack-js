/*
 * Copyright (c) 2019 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PQueue from 'p-queue';
import Debug from 'debug';

import { File, FilePart, FilePartMetadata, FileState } from './../file';
import { StoreUploadOptions } from './../types';
import { FsRequest, FsResponse, FsRequestError, FsCancelToken } from './../../../request';
import { uniqueTime, uniqueId, filterObject } from './../../../utils';
import { UploaderAbstract, UploadMode, INTELLIGENT_CHUNK_SIZE, MIN_CHUNK_SIZE, DEFAULT_STORE_LOCATION } from './abstract';
import { FilestackError, FilestackErrorType } from './../../../../filestack_error';
import { shouldRetry } from './../../../request/helpers';

const debug = Debug('fs:upload:s3');

const COMPLETE_TIMEOUT = 1000 * 1;

export interface UploadPart extends FilePartMetadata {
  etag?: string;
  offset?: number;
  progress?: number;
}

export interface UploadPayload {
  file: File;
  parts: UploadPart[];
  handle?: string;
  uri?: string;
  region?: string;
  upload_id?: number;
  location_url?: string;
  location_region?: string;
}

export class S3Uploader extends UploaderAbstract {
  private partsQueue;
  private cancelToken: FsCancelToken; // global cancel token for all requests

  private payloads: { [key: string]: UploadPayload } = {};

  constructor(storeOptions: StoreUploadOptions, concurrency?) {
    super(storeOptions, concurrency);

    this.partsQueue = new PQueue({
      autoStart: false,
      concurrency: this.concurrency,
    });

    this.cancelToken = new FsCancelToken();
  }

  /**
   * Pause upload queue
   *
   * @memberof S3Uploader
   */
  public pause(): void {
    this.partsQueue.pause();
  }

  /**
   * resume upload queue if its paused
   *
   * @memberof S3Uploader
   */
  public resume(): void {
    /* istanbul ignore next */
    if (this.partsQueue.isPaused) {
      this.partsQueue.start();
    }
  }

  /**
   * Aborts queue (all pending requests with will be aborted)
   *
   * @memberof S3Uploader
   */
  public abort(msg?: string): void {
    this.cancelToken.cancel(msg || 'Aborted by user');
    this.partsQueue.clear();
  }

  /**
   * Execute all queued files
   *
   * @returns {Promise<any>}
   * @memberof S3Uploader
   */
  public async execute(): Promise<any> {
    const tasks = Object.keys(this.payloads).map(
      id =>
        new Promise(async resolve => {
          try {
            await this.startRequest(id);
            await this.prepareParts(id);
            await this.startPartsQueue(id);
            await this.completeRequest(id);
          } catch (e) {
            /* istanbul ignore next */
            this.emit('error', e);
            debug(`[${id}] File upload failed. %O, \nDetails: %O `, e.message, e.details);
          }

          const file = this.getPayloadById(id).file;

          // release file buffer
          file.release();

          // cleanup payloads
          delete this.payloads[id];

          resolve(file);
        })
    );

    return Promise.all(tasks);
  }

  /**
   * Add file to upload queue
   *
   * @param {File} file
   * @returns
   * @memberof S3Uploader
   */
  public addFile(file: File): string {
    debug('Add file to queue: \n %o', file);

    const id = `${uniqueId(15)}_${uniqueTime()}`;

    file.status = FileState.INIT;

    // split file into parts and set it as waiting
    this.payloads[id] = {
      file,
      parts: [],
    };

    return id;
  }

  /**
   * Returns host for upload (region based)
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private getUploadUrl(id: string): string {
    const { location_url } = this.getDefaultFields(id, ['location_url']);
    return location_url.indexOf('http') === 0 ? location_url : `https://${location_url}`;
  }

  /**
   * Returns formatted store options
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private getStoreOptions(id: string): StoreUploadOptions {
    let options = {
      location: DEFAULT_STORE_LOCATION, // this parameter is required, if not set use default one
      ...this.storeOptions,
    };

    if (this.storeOptions.disableStorageKey) {
      const payload = this.getPayloadById(id);

      if (options.path && options.path.substr(-1) !== '/') {
        options.path = `${options.path}/`;
      }

      options.path = `${options.path ? options.path : '/'}${payload.file.name}`;

      delete options.disableStorageKey;
    }

    return options;
  }

  /**
   * Returns all default fields for filestack requests
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private getDefaultFields(id: string, requiredFields: string[], fiiFallback: boolean = false) {
    const payload = this.getPayloadById(id);

    let fields = {
      ...this.security,
      apikey: this.apikey,
      uri: payload.uri,
      location_url: payload.location_url,
      upload_id: payload.upload_id,
      region: payload.region,
    };

    if (this.uploadMode === UploadMode.INTELLIGENT || (this.uploadMode === UploadMode.FALLBACK && fiiFallback)) {
      fields['fii'] = true;
    }

    return {
      ...filterObject(fields, requiredFields),
      store: this.getStoreOptions(id),
    };
  }

  /**
   * Returns default headers needed for filestack request
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private getDefaultHeaders(id: string) {
    let headers = {};
    const file = this.getPayloadById(id);

    if (file.location_region) {
      headers['Filestack-Upload-Region'] = file.location_region;
    }

    return headers;
  }

  private getPayloadById(id: string): UploadPayload {
    return this.payloads[id];
  }

  /**
   * Split file onto parts for uploading with multipart mechanism and setup start
   *
   * @private
   * @memberof S3Uploader
   */
  private prepareParts(id: string): Promise<void> {
    const file = this.getPayloadById(id).file;

    // for intelligent or fallback mode we cant overwrite part size - requires 8MB
    if ([UploadMode.INTELLIGENT, UploadMode.FALLBACK].indexOf(this.uploadMode) > -1) {
      this.partSize = INTELLIGENT_CHUNK_SIZE;
    }

    const partsCount = file.getPartsCount(this.partSize);

    const parts = [];

    for (let i = 0; i < partsCount; i++) {
      parts[i] = {
        ...file.getPartMetadata(i, this.partSize),
        offset: 0,
      };
    }

    // split file into parts and set it as waiting
    this.payloads[id].parts = parts;

    return Promise.resolve();
  }

  /**
   * Make start request for getting needed upload fields
   *
   * @private
   * @returns {Promise<any>}
   * @memberof S3Uploader
   */
  private startRequest(id: string): Promise<any> {
    const payload = this.getPayloadById(id);

    if (payload.file.size === 0) {
      this.setPayloadStatus(id, FileState.FAILED);
      return Promise.reject(new FilestackError(`Invalid file "${payload.file.name}" size - 0`, {}, FilestackErrorType.VALIDATION));
    }

    debug(`[${id}] Make start request`);
    return FsRequest.post(
      `${this.getUrl()}/multipart/start`,
      {
        filename: payload.file.name,
        mimetype: payload.file.type,
        size: payload.file.size,
        ...this.getDefaultFields(id, ['apikey', 'policy', 'signature', 'fii'], true),
      },
      {
        timeout: this.timeout,
        cancelToken: this.cancelToken,
        headers: this.getDefaultHeaders(id),
        retry: this.retryConfig,
      }
    )
      .then(({ data }) => {
        if (!data || !data.location_url || !data.region || !data.upload_id || !data.uri) {
          debug(`[${id}] Incorrect start response: \n%O\n`, data);
          this.setPayloadStatus(id, FileState.FAILED);
          return Promise.reject(new FilestackError('Incorrect start response', data, FilestackErrorType.REQUEST));
        }

        debug(`[${id}] Assign payload data: \n%O\n`, data);

        this.updatePayload(id, data);

        // ii is not enabled in backend switch back to default upload mode
        if ([UploadMode.INTELLIGENT, UploadMode.FALLBACK].indexOf(this.uploadMode) > -1 && (!data.upload_type || data.upload_type !== 'intelligent_ingestion')) {
          debug(`[${id}] Intelligent Ingestion is not enabled on account, switch back to regular upload and lock mode change`);
          this.setUploadMode(UploadMode.DEFAULT, true);
        }

        return data;
      })
      .catch(err => {
        debug(`[${id}] Start request error %O`, err);
        this.setPayloadStatus(id, FileState.FAILED);

        return Promise.reject(new FilestackError('Cannot upload file. Start request failed', this.getErrorDetails(err), FilestackErrorType.REQUEST));
      });
  }

  /**
   * Enqueue file parts to upload
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private async startPartsQueue(id: string): Promise<any> {
    const payload = this.getPayloadById(id);
    const parts = payload.parts;
    const waitingLength = parts.length;

    debug(`[${id}] Create uploading queue from file. parts count - %d`, waitingLength);

    return new Promise(async (resolve, reject) => {
      parts.forEach(part =>
        this.partsQueue
          .add(() => this.startPart(id, part.partNumber))
          .catch(e => {
            this.setPayloadStatus(id, FileState.FAILED);
            debug(`[${id}] Failed to upload part %s`, e.message);

            this.partsQueue.pause();
            this.partsQueue.clear();
            return reject(e);
          })
      );

      debug(`[${id}] All tasks for %s enqueued. Start processing main upload queue`, id);
      this.partsQueue.start();

      resolve(await this.partsQueue.onIdle());
    });
  }

  /**
   * Decide if upload should be made using ii or regular upload
   * It allows change upload mode during upload queue
   *
   * @private
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof S3Uploader
   */
  private startPart(id: string, partNumber: number): Promise<any> {
    debug(`[${id}] Start processing part ${partNumber} with mode ${this.uploadMode}`);

    let payload = this.getPayloadById(id);

    payload.file.status = FileState.PROGRESS;
    return (this.uploadMode !== UploadMode.INTELLIGENT ? this.uploadRegular : this.uploadIntelligent).apply(this, [id, partNumber]);
  }

  /**
   * Returns part data needed for upload
   *
   * @private
   * @param {string} id - id of a currently uploading file
   * @param {FilePart} part
   * @returns
   * @memberof S3Uploader
   */
  private getS3PartMetadata(id: string, part: FilePart, offset?: number): Promise<any> {
    const url = this.getUploadUrl(id);

    debug(`[${id}] Get data for part ${part.partNumber}, url ${url}, Md5: ${part.md5}, Size: ${part.size}`);

    const data = {
      ...this.getDefaultFields(id, ['apikey', 'uri', 'region', 'signature', 'policy', 'upload_id', 'fii']),
      // method specific keys
      part: part.partNumber + 1,
      size: part.size,
      offset,
    };

    if (this.integrityCheck && part.md5) {
      data.md5 = part.md5;
    }

    return FsRequest.post(`${url}/multipart/upload`, data, {
      headers: this.getDefaultHeaders(id),
      cancelToken: this.cancelToken,
      timeout: this.timeout,
      retry: this.retryConfig,
    }).catch(err => {
      this.setPayloadStatus(id, FileState.FAILED);

      return Promise.reject(new FilestackError('Cannot get part metadata', this.getErrorDetails(err), FilestackErrorType.REQUEST));
    });
  }

  /**
   * Regular multipart request to amazon
   *
   * @private
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof S3Uploader
   */
  private async uploadRegular(id: string, partNumber: number): Promise<any> {
    let payload = this.getPayloadById(id);
    const partMetadata = payload.parts[partNumber];
    let part = await payload.file.getPartByMetadata(partMetadata, this.integrityCheck);

    const { data, headers } = await this.getS3PartMetadata(id, part);
    debug(`[${id}] Received part ${partNumber} info body: \n%O\n headers: \n%O\n`, data, headers);
    return FsRequest.put(data.url, part.buffer, {
      cancelToken: this.cancelToken,
      timeout: this.timeout,
      headers: data.headers,
      filestackHeaders: false,
      // for now we cant test progress callback from upload
      /* istanbul ignore next */
      onProgress: (pr: ProgressEvent) => this.onProgressUpdate(id, partNumber, pr.loaded),
      retry: this.retryConfig && this.uploadMode !== UploadMode.FALLBACK ? this.retryConfig : undefined,
    })
    .then(res => {
      if (res.headers.etag) {
        this.setPartETag(id, partNumber, res.headers.etag);
      } else {
        // release memory
        part = null;
        throw new FilestackError('Cannot upload file, check S3 bucket settings', 'Etag header is not exposed in CORS settings', FilestackErrorType.REQUEST);
      }

      debug(`[${id}] S3 Upload response headers for ${partNumber}: \n%O\n`, res.headers);

      this.onProgressUpdate(id, partNumber, part.size);

      // release memory
      part = null;

      return res;
    })
    .catch(err => {
      const resp = err && err.response ? err.response : null;

      /* istanbul ignore next */
      if (resp && resp.status === 403) {
        if (resp.data && resp.data.Error && resp.data.Error.code) {
          let code = resp.data.Error.code;

          if (Array.isArray(code)) {
            code = code.pop();
          }

          switch (code) {
            case 'RequestTimeTooSkewed':
              return this.startPart(id, partNumber);
            default:
              return Promise.reject(new FilestackError('Cannot upload file', resp.data.Error, FilestackErrorType.REQUEST));
          }
        }
      }

      // release memory
      part = null;

      if (err instanceof FilestackError) {
        return Promise.reject(err);
      }
      // reset upload progress on failed part
      this.onProgressUpdate(id, partNumber, 0);

      // if fallback, set upload mode to intelligent and restart current part
      if ((this.uploadMode === UploadMode.FALLBACK && !this.isModeLocked) || this.uploadMode === UploadMode.INTELLIGENT) {
        debug(`[${id}] Regular upload failed. Switching to intelligent ingestion mode`);
        this.setUploadMode(UploadMode.INTELLIGENT);
        // restart part
        return this.startPart(id, partNumber);
      }

      return Promise.reject(new FilestackError('Cannot upload file part', this.getErrorDetails(err), FilestackErrorType.REQUEST));
    });
  }

  /**
   * Upload file using intelligent mechanism
   *
   * @private
   * @param {string} id
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof S3Uploader
   */
  private async uploadIntelligent(id: string, partNumber: number): Promise<any> {
    return this.uploadNextChunk(id, partNumber).then(() => this.commitPart(id, partNumber));
  }

  /**
   * Recursively upload file in chunk mode (intelligent ingession)
   *
   * @private
   * @param {string} id
   * @param {number} partNumber
   * @param {number} chunkSize
   * @returns
   * @memberof S3Uploader
   */
  private async uploadNextChunk(id: string, partNumber: number, chunkSize: number = this.intelligentChunkSize) {
    const payload = this.getPayloadById(id);
    let part = payload.parts[partNumber];
    chunkSize = Math.min(chunkSize, part.size - part.offset);

    let chunk = await payload.file.getChunkByMetadata(part, part.offset, chunkSize, this.integrityCheck);

    debug(
      `[${id}] PartNum: ${partNumber}, PartSize: ${part.size}, StartByte: ${part.startByte}, Offset: ${part.offset}, ChunkSize: ${chunk.size},
       Left: ${part.size - part.offset - chunk.size}`
    );

    // catch error for debug purposes
    const { data } = await this.getS3PartMetadata(id, chunk, part.offset).catch(err => {
      debug(`[${id}] Getting chunk data for ii failed %O, Chunk size: ${chunkSize}, offset ${part.offset}, part ${partNumber}`, err);
      return Promise.reject(err);
    });

    return FsRequest.put(data.url, chunk.buffer, {
      cancelToken: this.cancelToken,
      timeout: this.timeout,
      headers: data.headers,
      filestackHeaders: false,
      // for now we cant test progress callback from upload
      /* istanbul ignore next */
      onProgress: (pr: ProgressEvent) => this.onProgressUpdate(id, partNumber, part.offset + pr.loaded),
    })
      .then(res => {
        this.onProgressUpdate(id, partNumber, part.offset + chunk.size);
        const newOffset = Math.min(part.offset + chunkSize, part.size);

        debug(`[${id}] S3 Chunk uploaded! offset: ${part.offset}, part ${partNumber}! response headers for ${partNumber}: \n%O\n`, res.headers);
        this.setPartData(id, partNumber, 'offset', newOffset);

        // if all chunks was uploaded then return resolve
        if (newOffset === part.size) {
          return Promise.resolve(res);
        }

        // release memory
        part = null;
        chunk = null;
        return this.uploadNextChunk(id, partNumber, chunkSize);
      })
      .catch(err => {
        const resp = err && err.response ? err.response : null;
        /* istanbul ignore next */
        if (resp && resp.status === 403) {
          if (resp.data && resp.data.Error && resp.data.Error.code) {
            let code = resp.data.Error.code;

            if (Array.isArray(code)) {
              code = code.pop();
            }

            switch (code) {
              case 'RequestTimeTooSkewed':
                return this.startPart(id, partNumber);
              default:
                return Promise.reject(new FilestackError('Cannot upload file', resp.data.Error, FilestackErrorType.REQUEST));
            }
          }
        }

        // reset progress on failed upload
        this.onProgressUpdate(id, partNumber, part.offset);
        const nextChunkSize = chunkSize / 2;

        if (nextChunkSize < MIN_CHUNK_SIZE) {
          debug(`[${id}] Minimal chunk size limit. Upload file failed!`);
          return Promise.reject(new FilestackError('Min chunk size reached', err.data, FilestackErrorType.REQUEST));
        }

        if (shouldRetry(err)) {
          debug(`[${id}] Request network error. Retry with new chunk size: ${nextChunkSize}`);
          return this.uploadNextChunk(id, partNumber, nextChunkSize);
        }

        // release memory
        part = null;
        chunk = null;

        return Promise.reject(new FilestackError('Cannot upload file part (FII)', this.getErrorDetails(err), FilestackErrorType.REQUEST));
      });
  }

  /**
   * Commit after upload all chunks of the part in ii mode
   *
   * @private
   * @param {string} id
   * @param {FilePart} part
   * @returns
   * @memberof S3Uploader
   */
  private commitPart(id: string, partNumber: number) {
    const payload = this.getPayloadById(id);
    const part = payload.parts[partNumber];

    return FsRequest.post(
      `${this.getUploadUrl(id)}/multipart/commit`,
      {
        ...this.getDefaultFields(id, ['apikey', 'region', 'upload_id', 'policy', 'signature', 'uri']),
        size: payload.file.size,
        part: part.partNumber + 1,
      },
      {
        cancelToken: this.cancelToken,
        timeout: this.timeout,
        headers: this.getDefaultHeaders(id),
        retry: this.retryConfig,
      }
    )
      .then((res: FsResponse) => {
        debug(`[${id}] Commit Part number ${part.partNumber}. Response: %O`, res.data);

        return res;
      })
      .catch(err => {
        return Promise.reject(new FilestackError('Cannot commit file part metadata', this.getErrorDetails(err), FilestackErrorType.REQUEST));
      });
  }

  /**
   * Complete request to merge all parts and get file handle etc
   *
   * @private
   * @returns
   * @memberof S3Uploader
   */
  private completeRequest(id: string): Promise<any> {
    const payload = this.getPayloadById(id);
    let parts = [];

    debug(`[${id}] Run complete request`);

    const partsHandle = payload.parts;
    const partLen = partsHandle.length;

    for (let i = 0; i < partLen; i++) {
      if (partsHandle[i].etag) {
        parts.push({ part_number: i + 1, etag: partsHandle[i].etag });
      }
    }

    debug(`[${id}] Etags %O`, parts);

    return FsRequest.post(
      `${this.getUploadUrl(id)}/multipart/complete`,
      {
        ...this.getDefaultFields(id, ['apikey', 'policy', 'signature', 'uri', 'region', 'upload_id', 'fii'], true),
        // method specific keys
        filename: payload.file.name,
        mimetype: payload.file.type,
        size: payload.file.size,
        upload_tags: this.uploadTags && Object.keys(this.uploadTags).length ? this.uploadTags : undefined,
        parts: parts.length ? parts : undefined,
      },
      {
        timeout: this.timeout,
        cancelToken: this.cancelToken,
        headers: this.getDefaultHeaders(id),
        retry: this.retryConfig,
      }
    )
      .then(res => {
        // if parts hasnt been merged, retry complete request again
        if (res.status === 202) {
          return new Promise((resolve, reject) => {
            setTimeout(
              () =>
                this.completeRequest(id)
                  .then(resolve)
                  .catch(reject),
              COMPLETE_TIMEOUT
            );
          });
        }

        // update file object
        let file = this.getPayloadById(id).file;

        file.handle = res.data.handle;
        file.url = res.data.url;
        file.container = res.data.container;
        file.key = res.data.key;
        file.uploadTags = res.data.upload_tags;
        file.workflows = res.data.workflows;
        file.status = res.data.status;

        return file;
      })
      .catch(err => {
        this.setPayloadStatus(id, FileState.FAILED);

        return Promise.reject(new FilestackError('Cannot complete file', this.getErrorDetails(err), FilestackErrorType.REQUEST));
      });
  }

  /**
   * UUpgrade upload progress and run progress event
   *
   * @private
   * @param {string} id
   * @param {number} partNumber
   * @param {number} loaded
   * @memberof S3Uploader
   */
  private onProgressUpdate(id: string, partNumber: number, loaded: number) {
    this.setPartData(id, partNumber, 'progress', loaded);
    this.emitProgress();
  }

  /**
   * Emits normalized progress event
   *
   * @private
   * @memberof S3Uploader
   */
  private emitProgress() {
    let totalSize = 0;
    let totalBytes = 0;

    let filesProgress = {};
    for (let i in this.payloads) {
      const payload = this.payloads[i];
      // omit all failed files in progress event
      // this shouldn't happend because of promises rejection in execute. Left to be sure
      /* istanbul ignore next */
      if (payload.file.status === FileState.FAILED) {
        continue;
      }

      const totalParts = payload.parts.map(p => p.progress || 0).reduce((a, b) => a + b, 0);

      totalBytes = totalBytes + totalParts;

      filesProgress[i] = {
        totalBytes: totalParts,
        totalPercent: Math.round((totalParts * 100) / payload.file.size) || 0,
      };

      totalSize = totalSize + payload.file.size;
    }

    const res = {
      totalBytes: totalBytes || 0,
      totalPercent: Math.round((totalBytes * 100) / totalSize) || 0,
      files: filesProgress,
    };

    debug(`Upload progress %O`, res);
    this.emit('progress', res);
  }

  /**
   * Apply provided data to given payload
   *
   * @private
   * @param {string} id
   * @param {*} data
   * @memberof S3Uploader
   */
  private updatePayload(id: string, data: any) {
    this.payloads[id] = {
      ...this.payloads[id],
      ...data,
    };
  }

  /**
   * Sets etag for part
   *
   * @private
   * @param {number} partNumber
   * @param {string} etag
   * @memberof S3Uploader
   */
  private setPartETag(id: string, partNumber: number, etag: string) {
    debug(`[${id}] Set ${etag} etag for part ${partNumber}`);
    this.getPayloadById(id).parts[partNumber].etag = etag;
  }

  /**
   * Sets part value for a key
   *
   * @private
   * @param {number} partNumber
   * @param {string} etag
   * @memberof S3Uploader
   */
  private setPartData(id: string, partNumber: number, key: string, value: any) {
    debug(`[${id}] Set ${key} = ${value} for part ${partNumber}`);

    const payload = this.getPayloadById(id);

    /* istanbul ignore next */
    if (!payload) {
      debug(`[${id}] Cannot set ${key} = ${value} for part ${partNumber}`);
      return;
    }

    payload.parts[partNumber][key] = value;
  }

  /**
   * Set payload file state
   *
   * @param id
   * @param status
   */
  private setPayloadStatus(id: string, status: FileState) {
    debug(`[${id}] Set payload status to ${status}`);
    /* istanbul ignore next: additional check in case if file will be deleted before setting status */
    if (!this.payloads[id]) {
      return;
    }

    this.payloads[id].file.status = status;
  }

  /**
   * Returns error details if response exists
   *
   * @param err
   */
  private getErrorDetails(err: FsRequestError) {
    if (!err.response) {
      return {};
    }

    return {
      code: err.response.status,
      data: err.response.data,
      headers: err.response.headers,
    };
  }
}
