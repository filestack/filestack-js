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

import { Session, Security } from '../../client';
import { S3Uploader, UploadMode } from './uploaders/s3';
import { UploadOptions, StoreUploadOptions } from '../upload/types';
import { getFile, InputFile } from './file_tools';
import { FileState } from './file';

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
 * Overlay to connect new uploader with old one without changing options
 *
 * @todo accept function as filename -> dynamic filename generation
 * @export
 * @class Upload
 */
export class Upload {
  private uploader: S3Uploader;

  private overwriteFileName;

  private lastProgress: ProgressEvent = {
    totalBytes: 0,
    totalPercent: 0,
  };

  private progressIntervalHandler;

  constructor(private readonly options: UploadOptions = {}, private readonly storeOptions: StoreUploadOptions = {}) {
    this.uploader = new S3Uploader(storeOptions, options.concurrency);

    if (storeOptions.filename) {
      this.overwriteFileName = storeOptions.filename;
      delete storeOptions.filename;
    }

    this.uploader.setRetryConfig({
      retry: options.retry || 10,
      onRetry: options.onRetry,
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

    if (options.intelligent) {
      this.uploader.setUploadMode(options.intelligent === 'fallback' ? UploadMode.FALLBACK : UploadMode.INTELLIGENT);
    }

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

    this.uploader.setHost(session.urls.uploadApiUrl);
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
   * Upload single file
   *
   * @param {(string | Buffer | Blob)} file
   * @param {string} [name] - overwrite file name?
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async upload(input: InputFile): Promise<any> {

    const f = await getFile(input);
    f.customName = this.overwriteFileName;
    this.uploader.addFile(f);

    this.startProgressInterval();
    const res = (await this.uploader.execute()).shift();
    this.stopProgressInterval();

    if (res.status === FileState.FAILED) {
      return Promise.reject(res);
    }

    return Promise.resolve(res);
  }

  /**
   * Upload multiple files at once
   *
   * @param {(string[] | Buffer[] | Blob[])} input
   * @returns {Promise<any>}
   * @memberof Upload
   */
  async multiupload(input: InputFile[]): Promise<any> {
    for (let i in input) {
      /* istanbul ignore next */
      if (!input.hasOwnProperty(i)) {
        continue;
      }

      const f = await getFile(input[i]);
      f.customName = this.overwriteFileName;
      this.uploader.addFile(f);
    }

    this.startProgressInterval();
    const res = await this.uploader.execute();
    this.stopProgressInterval();

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
