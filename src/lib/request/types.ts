/*
 * Copyright (c) 2018 by Filestack
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
export enum FsHttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  PURGE = 'PURGE',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATH = 'PATH',
}

export interface FsRetryConfig {
  retry: number;
  onRetry?: (requestConfig: any) => void;
  retryMaxTime?: number;
  retryFactor?: number;
}

export interface FsTokenInterface {
  cancel: (reason?: string | Error) => void;
  getSource: () => Promise<any>;
}

export interface FsAuthConfig {
  username: string;
  password: string;
}

export interface FsRequestHeaders {
  [name: string]: string;
}

export interface FsRequestParams {
  [name: string]: string | number;
}

/**
 * Request runtime data like retryCount etc
 */
export interface FsRequestRuntime {
  retryCount?: number;
  [name: string]: any;
}

export interface FsRequestOptions {
  url?: string;
  data?: any;
  method?: FsHttpMethod;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  params?: FsRequestParams;
  filestackHeaders?: boolean;
  headers?: FsRequestHeaders;
  timeout?: number;
  cancelToken?: FsTokenInterface;
  retry?: FsRetryConfig;
  onProgress?: (pr: ProgressEvent) => any;
  auth?: FsAuthConfig;
  runtime?: FsRequestRuntime;
}

export interface FsResponse {
  status: number;
  statusText: string;
  headers: any;
  data: any;
  config: FsRequestOptions;
}
