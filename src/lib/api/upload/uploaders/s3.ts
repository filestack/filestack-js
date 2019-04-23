
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
import { CancelTokenSource, AxiosResponse } from 'axios';

import { File, FilePart, FilePartMetadata, FileState } from './../file';
import { StoreUploadOptions } from './../types';
import { multipart, request, useRetryPolicy, shouldRetry } from './../../request';
import { uniqueTime, uniqueId } from './../../../utils';
import { UploaderAbstract, UploadMode, INTELLIGENT_CHUNK_SIZE, MIN_CHUNK_SIZE, DEFAULT_STORE_LOCATION } from './abstract';

const debug = Debug('fs:upload:multipart');

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
  private cancelToken: CancelTokenSource; // global cancel token for all requests

  private payloads: { [key: string]: UploadPayload } = {};

  constructor(storeOptions: StoreUploadOptions, concurrency: number = 3) {
    super(storeOptions, concurrency);

    this.partsQueue = new PQueue({
      autoStart: false,
      concurrency: this.concurrency,
    });

    // setup cancel token
    const CancelToken = request.CancelToken;
    this.cancelToken = CancelToken.source();
  }

  /**
   * Pause upload queue
   *
   * @memberof MultipartUploader
   */
  public pause(): void {
    this.partsQueue.pause();
  }

  /**
   * resume upload queue if its paused
   *
   * @memberof MultipartUploader
   */
  public resume(): void {
    if (this.partsQueue.isPaused) {
      this.partsQueue.start();
    }
  }

  /**
   * Aborts queue (all pending requests with will be aborted)
   *
   * @memberof MultipartUploader
   */
  public abort(msg?: string): void {
    this.cancelToken.cancel(msg || 'Aborted by user');
    this.partsQueue.clear();
  }

  /**
   * Execute all queued files
   *
   * @todo break on error
   * @returns {Promise<any>}
   * @memberof MultipartUploader
   */
  public async execute(): Promise<any> {
    const tasks = Object.keys(this.payloads).map(
      id =>
        new Promise(async (resolve) => {
          try {
            await this.prepareParts(id);
            await this.startRequest(id);
            await this.startPartsQueue(id);
            await this.completeRequest(id);
          } catch (e) {
            debug(`[${id}] File upload failed. %0`, e.message);
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
   * @memberof MultipartUploader
   */
  public addFile(file: File): string {
    debug('Add file to queue: \n %o', file);

    const id = this.getFileUniqueId(file);

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
   * @memberof MultupartUploader
   */
  private getUploadHost(id: string): string {
    const { location_url } = this.getDefaultFields(id, ['location_url']);
    return location_url.indexOf('http') === 0 ? location_url : `https://${location_url}`;
  }

  /**
   * Returns formatted store options
   *
   * @private
   * @returns
   * @memberof MultipartUploader
   */
  private getStoreOptions() {
    const opts = this.storeOptions || {};

    return {
      store_location: DEFAULT_STORE_LOCATION, // this parameter is required, if not set use default one
      ...Object.keys(opts).map(k => ({ [`store_${k}`]: opts[k] })),
    };
  }

  /**
   * Returns all default fields for filestack requests
   *
   * @private
   * @returns
   * @memberof MultipartUploader
   */
  private getDefaultFields(id: string, requiredFields: string[] = [], multipartFallback: boolean = false) {
    const payload = this.getPayloadById(id);

    let fields = {
      ...this.security,
      ...this.getStoreOptions(),
      apikey: this.apikey,
      uri: payload.uri,
      location_url: payload.location_url,
      upload_id: payload.upload_id,
      region: payload.region,
    };

    if (this.uploadMode === UploadMode.INTELLIGENT || (this.uploadMode === UploadMode.FALLBACK && multipartFallback)) {
      fields['multipart'] = 'true';
    }

    if (requiredFields.length > 0) {
      Object.keys(fields).filter(f => requiredFields.indexOf(f)).reduce((obj, key) => ({ ...obj, [key]: fields[key] }), {});
    }

    return fields;
  }

  /**
   * Returns default headers needed for filestack request
   *
   * @private
   * @returns
   * @memberof MultipartUploader
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
    if (this.payloads[id]) {
      return this.payloads[id];
    }

    throw new Error(`[${id}] Cannot find file by id`);
  }

  /**
   * Split file onto parts for uploading with multipart mechanism and setup start
   *
   * @private
   * @memberof MultipartUploader
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
   * @memberof MultipartUploader
   * @todo pare response check if can intelligent can be used response->upload_type (regular-> go back to normal upload)
   */
  private startRequest(id: string): Promise<any> {
    // @todo add interface to return value
    const payload = this.getPayloadById(id);

    debug(`[${id}] Make start request`);

    return multipart(
      `${this.getHost()}/multipart/start`,
      {
        filename: payload.file.name,
        mimetype: payload.file.type,
        size: payload.file.size,
        ...this.getDefaultFields(id, ['apikey', 'policy', 'signature', 'multipart'], true),
      },
      {
        timeout: this.timeout,
        cancelToken: this.cancelToken.token,
        headers: this.getDefaultHeaders(id),
      },
      this.retryConfig
    )
      .then(({ data }) => {
        if (!data || !data.upload_id) {
          throw new Error('Incorrect start response');
        }
        debug(`[${id}] Assign payload data: \n%O\n`, data);

        this.updatePayload(id, data);

        // ii is not enabled in backend switch back to default upload mode
        if (
          [UploadMode.INTELLIGENT, UploadMode.FALLBACK].indexOf(this.uploadMode) > -1 &&
          (!data.upload_type || data.upload_type !== 'intelligent_ingestion')
        ) {
          debug(`[${id}] Intelligent Ingestion is not enabled on account, switch back to regular upload and lock mode change`);
          this.setUploadMode(UploadMode.DEFAULT, true);
        }

        return data;
      })
      .catch(err => {
        payload.file.status = FileState.FAILED;
        throw err;
      });
  }

  /**
   * Enqueue file parts to upload
   *
   * @private
   * @returns
   * @memberof MultipartUploader
   * @todo filter waiting parts only
   */
  private async startPartsQueue(id: string): Promise<any> {
    const payload = this.getPayloadById(id);
    const parts = payload.parts;
    const waitingLength = parts.length;

    debug(`[${id}] Create uploading queue from file. parts count - %d`, waitingLength);
    parts.forEach(part => this.partsQueue.add(() => this.startPart(id, part.partNumber)));

    debug(`[${id}] All tasks for %s enqueued. Start processing main upload queue`, id);
    this.partsQueue.start();

    return this.partsQueue.onIdle();
  }

  /**
   * Decide if upload should be made using ii or regular upload
   * It allows change upload mode during upload queue
   *
   * @private
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof MultipartUploader
   */
  private startPart(id: string, partNumber: number): Promise<any> {
    debug(`[${id}] Start processing part ${partNumber} with mode ${this.uploadMode}`);

    let payload = this.getPayloadById(id);
    // omit all done and all failed parts of files
    if ([FileState.INIT, FileState.PROGRESS].indexOf(payload.file.status) === -1) {
      return Promise.resolve();
    }

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
   * @memberof MultipartUploader
   */
  private getPartS3Metadata(id: string, part: FilePart, offset?: number): Promise<any> {
    const url = this.getUploadHost(id);

    debug(`[${id}] Get data for part ${part.partNumber}, url ${url}, Md5: ${part.md5}, Size: ${part.size}`);

    return multipart(
      `${url}/multipart/upload`,
      {
        ...this.getDefaultFields(id, ['apikey', 'uri', 'region', 'signature', 'policy', 'upload_id']),
        // method specific keys
        part: part.partNumber + 1,
        md5: part.md5,
        size: part.size,
        offset,
      },
      {
        headers: this.getDefaultHeaders(id),
        cancelToken: this.cancelToken.token,
        timeout: this.timeout,
      },
      this.retryConfig
    ).catch(err => {
      this.getPayloadById(id).file.status = FileState.FAILED;
      throw err;
    });
  }

  /**
   * Regular multipart request to amazon
   *
   * @private
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof MultipartUploader
   *  @todo handle progress, s3 errors, fallback mode
   */
  private async uploadRegular(id: string, partNumber: number): Promise<any> {
    let payload = this.getPayloadById(id);
    const partMetadata = payload.parts[partNumber];
    let part = payload.file.getPartByMetadata(partMetadata);

    const { data, headers } = await this.getPartS3Metadata(id, part);
    debug(`[${id}] Received part ${partNumber} info body: \n%O\n headers: \n%O\n`, data, headers);

    // retry only in regular upload mode
    if (this.retryConfig && this.uploadMode !== UploadMode.FALLBACK) {
      useRetryPolicy(request, this.retryConfig);
    }

    return request
      .put(data.url, part.buffer, {
        cancelToken: this.cancelToken.token,
        timeout: this.timeout,
        headers: data.headers,
        onUploadProgress: (pr: ProgressEvent) => this.onProgressUpdate(id, partNumber, pr.loaded),
      })
      .then(res => {
        if (res.headers.etag) {
          this.setPartETag(id, partNumber, res.headers.etag);
        }

        debug(`[${id}] S3 Upload response headers for ${partNumber}: \n%O\n`, res.headers);

        this.onProgressUpdate(id, partNumber, part.size);

        return res;
      })
      .catch(err => {
        // reset upload progress on failed part
        this.onProgressUpdate(id, partNumber, 0);

        // if fallback, set upload mode to intelligent and restart current part
        if ((this.uploadMode === UploadMode.FALLBACK && !this.isModeLocked) || this.uploadMode === UploadMode.INTELLIGENT) {
          this.setUploadMode(UploadMode.INTELLIGENT);
          // restart part
          return this.startPart(id, partNumber);
        }

        payload.file.status = FileState.FAILED;
        throw err;
      }).finally(() => {
        part = null;
      });
  }

  /**
   * Upload file using intelligent mechanism
   *
   * @private
   * @param {string} id
   * @param {number} partNumber
   * @returns {Promise<any>}
   * @memberof MultipartUploader
   */
  private async uploadIntelligent(id: string, partNumber: number): Promise<any> {
    const part = this.payloads[id].parts[partNumber];

    return this.uploadNextChunk(id, partNumber, this.intelligentChunkSize).then(() => this.commitPart(id, part));
  }

  /**
   * Recursively upload file in chunk mode (intelligent ingession)
   * @todo add part state, add progress
   *
   * @private
   * @param {string} id
   * @param {number} partNumber
   * @param {number} chunkSize
   * @returns
   * @memberof MultipartUploader
   */
  private async uploadNextChunk(id: string, partNumber: number, chunkSize: number) {
    const payload = this.getPayloadById(id);
    let part = payload.parts[partNumber];
    const size = Math.min(chunkSize, part.size - part.offset);

    let chunk = payload.file.getChunkByMetadata(part, part.offset, size);

    debug(
      `[${id}] PartNum: ${partNumber}, PartSize: ${part.size}, StartByte: ${part.startByte}, Offset: ${part.offset}, ChunkSize: ${
        chunk.size
      }, Left: ${part.size - part.offset - chunk.size}`
    );

    // catch error for debug purposes
    const { data } = await this.getPartS3Metadata(id, chunk, part.offset).catch(err => {
      debug(`[${id}] Getting chunk data for ii failed %O, Chunk size: ${chunkSize}, offset ${part.offset}, part ${partNumber}`, err);
      throw err;
    });

    return request
      .put(data.url, chunk.buffer, {
        cancelToken: this.cancelToken.token,
        timeout: this.timeout,
        headers: data.headers,
        onUploadProgress: (pr: ProgressEvent) => this.onProgressUpdate(id, partNumber, part.offset + pr.loaded),
      })
      .then(res => {
        this.onProgressUpdate(id, partNumber, part.offset + chunk.size);
        const newOffset = Math.min(part.offset + chunkSize, part.size);

        // debug(`[${id}] S3 Chunk uploaded! offset: ${part.offset}, part ${partNumber}! response headers for ${partNumber}: \n%O\n`, res.headers);

        this.setPartData(id, partNumber, 'offset', newOffset);

        // if all chunks was uploaded then return resolve
        if (newOffset === part.size) {
          return Promise.resolve(res);
        }

        return this.uploadNextChunk(id, partNumber, chunkSize);
      })
      .catch(err => {
        // reset progress on failed upload
        this.onProgressUpdate(id, partNumber, part.offset);
        const nextChunkSize = chunkSize / 2;

        if (nextChunkSize < MIN_CHUNK_SIZE) {
          debug(`[${id}] Minimal chunk size limit. Upload file failed!`);
          throw err;
        }

        if (shouldRetry(err)) {
          debug(`[${id}] Request network error. Retry with new chunk size: ${nextChunkSize}`);
          return this.uploadNextChunk(id, partNumber, nextChunkSize);
        }

        payload.file.status = FileState.FAILED;
        throw err;
      }).finally(() => {
        part = null;
        chunk = null;
      });
  }

  /**
   * Commit after upload all chunks of the part in ii mode
   *
   * @private
   * @param {string} id
   * @param {FilePart} part
   * @returns
   * @memberof MultipartUploader
   */
  private commitPart(id: string, part: FilePartMetadata) {
    const payload = this.payloads[id];

    return multipart(
      `${this.getUploadHost(id)}/multipart/commit`,
      {
        ...this.getDefaultFields(id, ['apikey', 'region', 'upload_id', 'policy', 'signature']),
        size: payload.file.size,
        part: part.partNumber + 1,
      },
      {
        cancelToken: this.cancelToken.token,
        timeout: this.timeout,
        headers: this.getDefaultHeaders(id),
      },
      this.retryConfig
    ).then((res: AxiosResponse) => {
      debug(`[${id}] Commit Part number ${part.partNumber}. Response: %O`, res.data);

      return res;
    });
  }

  /**
   * Complete request to merge all parts and get file handle etc
   *
   * @private
   * @returns
   * @memberof MultipartUploader
   */
  private completeRequest(id: string): Promise<any> {
    const payload = this.getPayloadById(id);
    let parts = [];

    if (payload.file.status === FileState.FAILED) {
      return Promise.resolve();
    }

    debug(`[${id}] Run complete request`);

    const partsHandle = payload.parts;
    const partLen = partsHandle.length;

    for (let i = 0; i < partLen; i++) {
      if (partsHandle[i].etag) {
        parts.push(`${i + 1}:${partsHandle[i].etag}`);
      }
    }

    debug(`[${id}] Etags %O`, parts);

    return multipart(
      `${this.getHost()}/multipart/complete`,
      {
        ...this.getDefaultFields(id, ['apikey', 'policy', 'signature', 'uri', 'region', 'upload_id'], true),
        // method specific keys
        filename: payload.file.name,
        mimetype: payload.file.type,
        size: payload.file.size,
        parts: parts.length ? parts.join(';') : undefined,
      },
      {
        timeout: this.timeout,
        cancelToken: this.cancelToken.token,
        headers: this.getDefaultHeaders(id),
      },
      this.retryConfig
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
        let file = this.payloads[id].file;
        file.handle = res.data.handle;
        file.url = res.data.url;
        file.status = res.data.status || FileState.STORED;

        return file;
      })
      .catch(err => {
        payload.file.status = FileState.FAILED;
        throw err;
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
      if (payload.file.status === FileState.FAILED) {
        continue;
      }

      const partsProgress = payload.parts.map(p => p.progress || 0);
      const totalParts = partsProgress.reduce((a, b) => a + b);

      totalBytes = totalBytes + totalParts;

      filesProgress[i] = {
        totalBytes: totalParts || 0,
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
      uri: data.uri,
      region: data.region,
      upload_id: data.upload_id,
      location_url: data.location_url,
      location_region: data.location_region, // cname
    };
  }

  /**
   * Sets etag for part
   *
   * @private
   * @param {number} partNumber
   * @param {string} etag
   * @memberof MultipartUploader
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
   * @memberof MultipartUploader
   */
  private setPartData(id: string, partNumber: number, key: string, value: any) {
    debug(`[${id}] Set ${key} = ${value} for part ${partNumber}`);
    this.getPayloadById(id).parts[partNumber][key] = value;
  }

  /**
   * Returns unique file id combined from md5 + unique time
   *
   * @private
   * @param {File} file
   * @returns
   * @memberof S3Uploader
   */
  private getFileUniqueId(file: File) {
    return `${uniqueId(15)}_${uniqueTime()}`;
  }
}