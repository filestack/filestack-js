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
import Debug from 'debug';
import * as EventEmitter from 'eventemitter3';

import { File, UploadTags } from './../file';
import { StoreUploadOptions } from './../types';
import { Security } from './../../../client';
import { FsRetryConfig } from './../../../request';
import { isMobile } from './../../../utils';
import { FilestackError } from './../../../../filestack_error';

// regular part size
export const DEFAULT_PART_SIZE = 6 * 1024 * 1024;

// Minimum part size for upload by multipart
export const MIN_PART_SIZE = 5 * 1024 * 1024;

// when mode is set to fallback or intelligent, this part size is required
export const INTELLIGENT_CHUNK_SIZE = 8 * 1024 * 1024;

// Mobile Chunk size for ii
export const INTELLIGENT_MOBILE_CHUNK_SIZE = 1024 * 1024;

// minimum intelligent chunk size
export const MIN_CHUNK_SIZE = 32 * 1024;

export const DEFAULT_STORE_LOCATION = 's3';

const debug = Debug('fs:upload:abstract');

export const enum UploadMode {
  DEFAULT = 'default',
  INTELLIGENT = 'intelligent',
  FALLBACK = 'fallback',
}

export abstract class UploaderAbstract extends EventEmitter {
  // Parts size options
  protected partSize: number = DEFAULT_PART_SIZE;

  // chunk size for ii uploads
  protected intelligentChunkSize: number = isMobile() ? INTELLIGENT_MOBILE_CHUNK_SIZE : INTELLIGENT_CHUNK_SIZE;

  // upload options
  protected url: string;
  protected timeout: number = 30 * 1000;
  protected uploadMode: UploadMode = UploadMode.DEFAULT;

  // application settings
  protected apikey: string;
  protected security: Security;

  protected isModeLocked: boolean = false; // if account does not support ii in fallback mode we should abort
  protected retryConfig: FsRetryConfig;
  protected integrityCheck: boolean = true;

  protected uploadTags: UploadTags = null;

  constructor(protected readonly storeOptions: StoreUploadOptions, protected readonly concurrency: number = 3) {
    super();
  }

  public setSecurity(security: Security): void {
    debug('Set security %O', security);
    this.security = security;
  }

  public setApikey(apikey: string): void {
    debug(`Set apikey to ${apikey}`);
    this.apikey = apikey;
  }

  public setTimeout(timeout: number): void {
    debug(`Set request timeout to ${timeout}`);
    this.timeout = timeout;
  }

  public setRetryConfig(cfg: FsRetryConfig) {
    debug(`Set retry config to ${cfg}`);
    this.retryConfig = cfg;
  }

  public setUrl(url: string): void {
    debug(`Set upload url to ${url}`);
    this.url = url;
  }

  public setUploadTags(tags: UploadTags) {
    debug(`Set tags to %O`, tags);
    this.uploadTags = tags;
  }

  /**
   * Set state of checking file integrity
   * @param state
   */
  public setIntegrityCheck(state) {
    this.integrityCheck = state;
  }

  /**
   * Sets upload mode
   *
   * @param {UploadMode} mode
   * @param {boolean} [lock=false]
   * @returns
   * @memberof MultipartUploader
   */
  public setUploadMode(mode: UploadMode, lock: boolean = false): void {
    // this shouldnt happend but for safety reasons if will stay
    /* istanbul ignore next */
    if (this.isModeLocked === true) {
      debug(`Cannot switch mode to ${mode}. Locked! Probably mode is not supported at this apikey`);
      return;
    }

    this.isModeLocked = lock;

    debug(`Set upload mode to ${mode}`);

    this.uploadMode = mode;
  }

  /**
   * Set upload part size
   * if part size is smaller than minimum 5mb it will throw error
   *
   * @param {number} size
   * @returns {void}
   * @memberof S3Uploader
   */
  public setPartSize(size: number): void {
    if (this.uploadMode !== UploadMode.DEFAULT) {
      debug('Cannot set part size because upload mode is other than default. ');
      return;
    }

    debug(`Set part size to ${size}`);

    if (size < MIN_PART_SIZE) {
      throw new FilestackError('Minimum part size is 5MB');
    }

    this.partSize = size;
  }

  /**
   * Returns current part size
   */
  public getPartSize() {
    return this.partSize;
  }

  /**
   * Set start part size for ii
   *
   * @param {number} size
   * @memberof S3Uploader
   */
  public setIntelligentChunkSize(size: number): void {
    debug(`Set inteligent chunk size to ${size}`);
    if (size < MIN_CHUNK_SIZE) {
      throw new FilestackError(`Minimum intelligent chunk size is ${MIN_CHUNK_SIZE}`);
    }
    this.intelligentChunkSize = size;
  }

  /**
   * Returns intelligent chunk size
   */
  public getIntelligentChunkSize(): number {
    return this.intelligentChunkSize;
  }

  /**
   * Returns filestack upload url
   *
   * @private
   * @returns
   * @memberof MultipartUploader
   */
  public getUrl(): string {
    if (!this.url) {
      throw new FilestackError('Upload url not set');
    }

    return this.url;
  }

  /**
   * Pause upload queue
   *
   * @memberof MultipartUploader
   */
  public abstract pause(): void;
  /**
   * resume upload queue if its paused
   *
   * @memberof MultipartUploader
   */
  public abstract resume(): void;

  /**
   * Aborts queue (all pending requests with will be aborted)
   *
   * @memberof MultipartUploader
   */
  public abstract abort(msg?: string): void;

  public abstract addFile(file: File): string;

  public abstract async execute(): Promise<any>;
}
