/*
 * Copyright (c) 2018 by Filestack.
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

import { StoreBaseParams } from './../../filelink';
import { UploadTags } from './file';
import { SanitizeOptions } from './../../utils/index';

export interface UploadOptions {
  /**
   * Maximum size for file slices. Is overridden when intelligent=true. Default is `6 * 1024 * 1024` (6MB).
   */
  partSize?: number;
  /**
   * Maximum amount of part jobs to run concurrently. Default is 3.
   */
  concurrency?: number;
  /**
   * Callback for progress events.
   */
  onProgress?: (evt: FSProgressEvent) => void;
  /**
   * How often to report progress. Default is 1000 (in milliseconds).
   */
  progressInterval?: number;
  /**
   * Callback for retry events.
   */
  onRetry?: () => void;
  /**
   * Retry limit. Default is 10.
   */
  retry?: number; // Retry limit
  /**
   * Factor for exponential backoff on server errors. Default is 2.
   */
  retryFactor?: number;
  /**
   * Upper bound for exponential backoff. Default is 15000.
   */
  retryMaxTime?: number;
  /**
   * Timeout for network requests. Default is 120000.
   */
  timeout?: number;
  /**
   * Enable/disable intelligent ingestion.
   * If truthy then intelligent ingestion must be enabled in your Filestack application.
   * Passing true/false toggles the global intelligent flow (all parts are chunked and committed).
   * Passing `'fallback'` will only use FII when network conditions may require it (only failing parts will be chunked).
   */
  intelligent?: boolean | 'fallback';
  /**
   * Set the default intiial chunk size for Intelligent Ingestion. Defaults to 8MB on desktop and 1MB on mobile.
   */
  intelligentChunkSize?: number;

  /**
   * Disable checking integrity of uploaded files.
   * On slower devices it can boost upload performance (disable counting md5 from file parts)
   */
  disableIntegrityCheck?: boolean;

  /**
   * Define upload tags to be passed to webhook
   *
   * @type {Tags}
   * @memberof UploadOptions
   */
  tags?: UploadTags;
}

export type StoreUploadOptions = StoreBaseParams & {
  /**
   * Filename or function that returns custom filename for stored file
   */
  filename?: ((file: File) => string) | string;

  /**
   * Workflows ids to run after upload
   */
  workflows?: (string | WorkflowConfig)[];

  /**
   * Fielname sanitizer for cleanup  before upload
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html
   * @default {
   *   exclude: ['\\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']
   *   replacement: '-'
   * }
   * @type {((boolean | {
   *     exclude: string[],
   *     replacement: string,
   *   }))}
   */
  sanitizer?: SanitizeOptions
};

export interface WorkflowConfig {
  id: string;
}

export interface FSProgressEvent {
  totalPercent: number;
  totalBytes: number;
}
