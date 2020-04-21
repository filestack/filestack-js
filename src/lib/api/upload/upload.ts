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

import { EventEmitter } from 'eventemitter3';
import { Session, Security } from '../../client';
import { S3Uploader } from './uploaders/s3';
import { FilestackError, FilestackErrorType } from './../../../filestack_error';
import { SanitizeOptions } from './../../utils';

import { UploadOptions, StoreUploadOptions } from '../upload/types';
import { getFile, InputFile } from './file_tools';
import { FileState, UploadTags } from './file';
import { UploadMode } from './uploaders/abstract';
import { getValidator, UploadParamsSchema, StoreParamsSchema } from './../../../schema';

export interface ProgressEvent {
  totalPercent: number;
  totalBytes: number;
  files?: { (key: string): ProgressEvent };
}

const DEFAULT_PROGRESS_INTERVAL = 1000;

const normalizeProgress = (current, last) => {
  current.totalBytes = Math.max(current.totalBytes, last.totalBytes);
  current.totalPercent = Math.max(current.totalPercent, last.totalPercent);

  return current;
};

/**
 * Uploader main class for now its supporting only s3 upload type
 *
 * @export
 * @class Upload
 */
export class Upload extends EventEmitter {

  /**
   * Uploader instance
   *
   * @private
   * @type {S3Uploader}
   * @memberof Upload
   */
  private uploader: S3Uploader;

  /**
   * Should we overwrite file name
   *
   * @private
   * @memberof Upload
   */
  private overrideFileName;

  private lastProgress: ProgressEvent = {
    totalBytes: 0,
    totalPercent: 0,
  };

  private progressIntervalHandler;
  private sanitizerOptions: SanitizeOptions;

  constructor(private readonly options: UploadOptions = {}, private storeOptions: StoreUploadOptions = {}) {
    super();

    // do not delete filename from original options reference - copy it first
    this.storeOptions = Object.assign({}, storeOptions);

    const validateRes = getValidator(UploadParamsSchema)(options);

    if (validateRes.errors.length) {
      throw new FilestackError(`Invalid upload params`, validateRes.errors, FilestackErrorType.VALIDATION);
    }

    const storeValidateRes = getValidator(StoreParamsSchema)(storeOptions);
    if (storeValidateRes.errors.length) {
      throw new FilestackError(`Invalid store upload params`, storeValidateRes.errors, FilestackErrorType.VALIDATION);
    }

    if (storeOptions.filename) {
      this.overrideFileName = storeOptions.filename;
      delete this.storeOptions.filename;
    }

    if (this.storeOptions.sanitizer) {
      this.sanitizerOptions = this.storeOptions.sanitizer;
      delete this.storeOptions.sanitizer;
    }

    this.uploader = new S3Uploader(this.storeOptions, options.concurrency);

    this.uploader.setRetryConfig({
      retry: options.retry || 10,
      onRetry: options.onRetry, // @todo bind file to retry in s3 uploader
      retryFactor: options.retryFactor || 2,
      retryMaxTime: options.retryMaxTime || 15000,
    });

    this.uploader.setTimeout(options.timeout || 120000);

    if (options.partSize) {
      this.uploader.setPartSize(options.partSize);
    }

    if (options.intelligentChunkSize) {
      this.uploader.setIntelligentChunkSize(options.intelligentChunkSize);
    }

    if (options.disableIntegrityCheck) {
      this.uploader.setIntegrityCheck(false);
    }

    if (options.intelligent) {
      this.uploader.setUploadMode(options.intelligent === 'fallback' ? UploadMode.FALLBACK : UploadMode.INTELLIGENT);
    }

    this.uploader.setUploadTags(options.tags);

    this.uploader.on('error', (e) => this.emit('error', e));
    this.uploader.on('progress', this.handleProgress.bind(this));
  }

  /**
   * Set session object to uploader
   *
   * @deprecated
   * @param {Session} session
   * @memberof Upload
   */
  setSession(session: Session) {
    this.uploader.setApikey(session.apikey);

    if (session.policy && session.signature) {
      this.uploader.setSecurity({
        policy: session.policy,
        signature: session.signature,
      });
    }

    this.uploader.setUrl(session.urls.uploadApiUrl);
  }

  /**
   * Set cancel token to controll upload flow
   *
   * @param {*} token
   * @returns
   * @memberof Upload
   */
  public setToken(token: any) {
    if (!token || token !== Object(token)) {
      throw new Error('Incorrect upload token. Must be instance of object');
    }

    token.pause = () => this.uploader.pause();
    token.resume = () => this.uploader.resume();
    token.cancel = () => this.uploader.abort();

    return token;
  }

  /**
   * Sets security to uploader instance
   *
   * @param {Security} security
   * @memberof Upload
   */
  public setSecurity(security: Security) {
    this.uploader.setSecurity(security);
  }

  /**
   * Set upload tags
   *
   * @param {Tags} tags
   * @memberof Upload
   */
  public setUploadTags(tags: UploadTags) {
    this.uploader.setUploadTags(tags);
  }

  /**
   * Upload single file
   *
   * @param {(InputFile)} file
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async upload(input: InputFile): Promise<any> {

    const f = await getFile(input, this.sanitizerOptions);
    f.customName = this.overrideFileName;
    this.uploader.addFile(f);

    this.startProgressInterval();
    const res = (await this.uploader.execute()).shift();
    this.stopProgressInterval();

    this.uploader.removeAllListeners();

    if (res.status === FileState.FAILED) {
      return Promise.reject(res);
    }

    return Promise.resolve(res);
  }

  /**
   * Upload multiple files at once
   *
   * @param {(InputFile[])} input
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async multiupload(input: InputFile[]): Promise<any> {
    for (let i in input) {
      /* istanbul ignore next */
      if (!input.hasOwnProperty(i)) {
        continue;
      }

      const f = await getFile(input[i], this.sanitizerOptions);
      f.customName = this.overrideFileName;
      this.uploader.addFile(f);
    }

    this.startProgressInterval();
    const res = await this.uploader.execute();
    this.stopProgressInterval();

    this.uploader.removeAllListeners();

    return Promise.resolve(res);
  }

  /**
   * RUn progress with userdefined interval
   *
   * @private
   * @returns
   * @memberof Upload
   */
  private startProgressInterval() {
    if (typeof this.options.onProgress !== 'function') {
      return;
    }

    this.progressIntervalHandler = setInterval(() => {
      this.options.onProgress(this.lastProgress);
    }, this.options.progressInterval || DEFAULT_PROGRESS_INTERVAL);

    this.options.onProgress(this.lastProgress);
  }

  /**
   * Stop progress interval after upload
   *
   * @private
   * @memberof Upload
   */
  private stopProgressInterval() {
    clearInterval(this.progressIntervalHandler);
  }

  /**
   * Handle upload interval and normalize values
   *
   * @private
   * @param {ProgressEvent} progress
   * @memberof Upload
   */
  private handleProgress(progress: ProgressEvent) {
    // get max progress data to avoid progress jumps on any part error
    progress = normalizeProgress(progress, this.lastProgress);

    if (this.lastProgress.files) {
      for (let i in progress.files) {
        if (this.lastProgress.files[i]) {
          progress.files[i] = normalizeProgress(progress.files[i], this.lastProgress.files[i]);
        }
      }
    }

    this.lastProgress = progress;
  }
}
