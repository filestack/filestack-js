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

/**
 * @private
 */
export interface FileObj { //extends File {
  buffer: Buffer;
  name: string;
  size: number;
  type: string;
}

/**
 * @private
 */
export interface PartObj {
  buffer: any;
  chunks: any[];
  chunkSize: number;
  intelligentOverride: boolean;
  loaded: number;
  number: number;
  request: any;
  size: number;
  md5?: string;
  offset?: number;
}

export interface UploadOptions {
  host?: string;
  /**
   * Node only. Treat the file argument as a path string.
   */
  path?: boolean;
  /**
   * Set the MIME type of the uploaded file.
   */
  mimetype?: string;
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
  onRetry?: (evt: FSRetryEvent) => void;
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
  intelligent?: boolean | string;
  /**
   * Set the default intiial chunk size for Intelligent Ingestion. Defaults to 8MB on desktop and 1MB on mobile.
   */
  intelligentChunkSize?: number;
}

export interface FSProgressEvent {
  totalPercent: number;
  totalBytes: number;
}

export interface FSRetryEvent {
  location: string;
  parts: PartsMap;
  filename: string;
  attempt: number | undefined;
  chunkSize?: number;
}

/**
 * @private
 */
export interface UploadConfig extends UploadOptions {
  apikey: string;
  store: any;
  concurrency: number;
  partSize: number;
  retryFactor: number;
  retryMaxTime: number;
  progressInterval: number;
  policy?: string;
  signature?: string;
  customName?: string;
  mimetype?: string;
}

/**
 * @private
 */
export const enum Status {
  INIT = 'init',
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
  PAUSED = 'paused',
}

/**
 * @private
 */
export interface PartsMap {
  [part: string]: PartObj;
}

/**
 * @private
 */
export interface State {
  progressTick: any;
  previousPayload: any;
  status: Status;
  retries: any;
  parts: PartsMap;
}

/**
 * @private
 */
export interface Context {
  config: UploadConfig;
  state: State;
  file: FileObj;
  params?: any;
}
