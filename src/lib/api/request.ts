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
import Debug from 'debug';
import ky from 'ky-universal';
import { Options as KyOptions, AfterResponseHook, DownloadProgress } from 'ky';
import { uniqueId, getVersion, isNode } from '../utils';

const debug = Debug('fs:request');

const RESPONSE_DEBUG_PREFIX = 'x-filestack-';// @todo on response if debug is enabled print all headers

export interface RetryConfig {
  retry: number;
  onRetry?: (requestConfig: any) => void;
  retryMaxTime: number;
  retryFactor: number;
}

export interface RequestOptions {
  method?: string;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  filesstackHeaders?: boolean;
  headers?: any;
  timeout?: number;
  cancelToken?: any;
  retryConfig?: RetryConfig;
  onProgress?: (pr: any) => any; // @todo callback type
}

export interface FilestackResponse {
  status: number;
  statusText: string;
  url: string;
  headers: any;
  data: any;
  raw: Response;
}

/**
 * @todo apply retry policy
 * @todo handle errors
 * @todo handle response by type
 * @todo handle debug
 *
 * @param url
 * @param data
 * @param options
 * @param retryConfig
 */
export const fetchRequest = async (url: string, data: any, options: RequestOptions = {}): Promise<FilestackResponse> => {
  const isJson = data.constructor === Object;

  const payload: KyOptions = {
    method: options.method || 'GET',
    mode: options.mode || 'cors',
    cache: options.cache || 'no-cache',
    headers: options.headers,
    redirect: options.redirect || 'follow',
    credentials: 'include',
    referrer: 'origin',
    timeout: options.timeout,
    hooks: {
      afterResponse: [afterResponseDebug],
    },
    onDownloadProgress: onDownloadProgress(options),
  };

  if (options.retryConfig) {
    payload.retry =  {
      limit: options.retryConfig.retry,
    };
  }

  if (isJson) {
    payload.json = data;
  } else {
    payload.body = data;
  }

  if (options.filesstackHeaders) {
    payload.headers = {
      ...payload.headers,
      'filestack-source': getVersion(),
      'filestack-trace-id': `${Math.floor(Date.now() / 1000)}-${uniqueId()}`,
      'filestack-trace-span': `jssdk-${uniqueId()}`,
    };
  }

  debug('Filestack Request Payload for url %s: %O', url, payload);

  return new Promise(async (resolve) => {
    let response;

    try {
      response = await ky(url, payload);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('errror aborted');
      } else {
        console.log('fetch error', error);
      }
    }
    console.log(response);
    let headers = {};

    if (response.ok) {
      const data = await response.body();

      response.headers.forEach((value, name) => {
        headers[name] = value;
      });

      return resolve({
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        headers,
        data,
        raw: response,
      });
    }

    // apply retry policy
    // console.log('Request error @todo', response, response.error());
  });
};

const afterResponseDebug: AfterResponseHook = (request, options, res)  => {

  // debugger
  res.headers.forEach((value, name) => {
    if (name.indexOf(RESPONSE_DEBUG_PREFIX) === -1) {
      return;
    }

    debug(`Filestack Response Debug Header - ${name}: ${value}`);
  });
};

const onDownloadProgress = (options) => (res): DownloadProgress => {
  if (!options.onProgress) {
    return;
  }

  options.onProgress({
    total: res.totalBytes,
    percent: res.percent,
    loaded: res.transferredBytes,
  });
};

// @todo ?
export const shouldRetry = (errCode: number, errText: string) => {
  // we always should retry on network failure
  switch (errText.toUpperCase()) {
    case 'ECONNRESET':
    case 'ETIMEDOUT':
    case 'EADDRINUSE':
    case 'ESOCKETTIMEDOUT':
    case 'EPIPE':
      return true;
  }

  // we should retry on all server errors (5xx)
  if (500 <= errCode && errCode <= 599) {
    return true;
  }

  // we should not retry on other errors (4xx) ie: BadRequest etc
  return false;
};

/**
 * Global filestack request wrapper
 */
export const FilestackRequest = {
  post: (url: string, data: any, options: RequestOptions = {}) => {
    options.method = 'POST';
    return fetchRequest(url, data, options);
  },
  get: (url: string, options: RequestOptions = {}) => {
    options.method = 'GET';
    return fetchRequest(url, null, options);
  },
  put: (url: string, data: any, options: RequestOptions = {}) => {
    options.method = 'PUT';
    return fetchRequest(url, data, options);
  },
  delete: (url: string, data: any, options: RequestOptions = {}) => {
    options.method = 'DELETE';
    return fetchRequest(url, null, options);
  },
};

// export const useRetryPolicy = (instance: AxiosInstance, retryConfig: RetryConfig) => {
//   instance.interceptors.request.use(config => {
//     const currentState = config['retry'] || {};
//     currentState.retryCount = currentState.retryCount || 0;
//     config['retry'] = currentState;
//     return config;
//   });

//   return instance.interceptors.response.use(null, err => {
//     const requestConfig = err.config;

//     if (axios.isCancel(err)) {
//       debug('[Retry] Upload canceled by user');
//       return Promise.reject(err);
//     }

//     debug(`[Retry] Start retry process code: ${err.code}, %O`, err);

//     /* istanbul ignore next */
//     if (!requestConfig) {
//       debug(`[Retry] Retry config not found, Rejecting request`);
//       return Promise.reject(err);
//     }

//     const state = requestConfig.retry;

//     if (!shouldRetry(err)) {
//       debug(`[Retry] Response code not allowing to retry`);
//       return Promise.reject(err);
//     }

//     requestConfig.retry.retryCount += 1;

//     if (requestConfig.retry.retryCount > retryConfig.retry) {
//       debug(`[Retry] Max retry count reached ${requestConfig.retry.retryCount}`);
//       return Promise.reject(err);
//     }

//     const retryDelay = Math.max(Math.min(retryConfig.retryMaxTime, (retryConfig.retryFactor ** state.retryCount) * 1000), 1);

//     debug(`[Retry] Retrying request to ${requestConfig.url}, count ${state.retryCount} of ${retryConfig.retry} - Delay: ${retryDelay}`);
//     return new Promise(resolve => setTimeout(() => {
//       if (typeof retryConfig.onRetry === 'function') {
//         retryConfig.onRetry.call(instance, requestConfig);
//       }

//       resolve(instance(requestConfig));
//     }, retryDelay));
//   });
// };
