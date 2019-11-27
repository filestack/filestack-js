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
export enum HttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  PURGE = 'PURGE',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATH',
}

export interface RetryConfig {
  retry: number;
  onRetry?: (requestConfig: any) => void;
  retryMaxTime: number;
  retryFactor: number;
}

export interface AuthConfig {
  username: string;
  password: string;
}

export interface RequestHeaders {
  [name: string]: string;
}

export interface RequestParams {
  [name: string]: string | number;
}

/**
 * Request runtime data like retryCount etc
 */
export interface RequestRuntime {
  retryCount?: number;
  [name: string]: any;
}

export interface RequestOptions {
  url?: string;
  data?: any;
  json?: any;
  method?: HttpMethod;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  params?: RequestParams;
  filesstackHeaders?: boolean;
  headers?: RequestHeaders;
  timeout?: number;
  cancelToken?: any;
  retry?: RetryConfig;
  onProgress?: (pr: any) => any; // @todo callback type
  auth?: AuthConfig;
  runtime?: RequestRuntime;
}

export interface Response {
  status: number;
  statusText: string;
  headers: any;
  data: any;
  config: RequestOptions;
}

export interface FilestackStatic {
  request(url: string, config?: RequestOptions): Promise<Response>;
  get(url: string, config?: RequestOptions): Promise<Response>;
  purge(url: string, config?: RequestOptions): Promise<Response>;
  delete(url: string, config?: RequestOptions): Promise<Response>;
  head(url: string, config?: RequestOptions): Promise<Response>;
  options(url: string, config?: RequestOptions): Promise<Response>;
  post(url: string, data?: any, config?: RequestOptions): Promise<Response>;
  put(url: string, data?: any, config?: RequestOptions): Promise<Response>;
  patch(url: string, data?: any, config?: RequestOptions): Promise<Response>;
}
