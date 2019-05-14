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
import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { uniqueId } from '../utils';

const debug = Debug('fs:request');

const RESPONSE_DEBUG_PREFIX = 'x-filestack-';

export interface RetryConfig {
  retry: number;
  onRetry?: (requestConfig: any) => void;
  retryMaxTime: number;
  retryFactor: number;
}

/**
 *
 * @private
 * @param method
 * @param url
 */
export const requestWithSource = (retryConfig?: RetryConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    headers: {
      'filestack-source': 'JS-@{VERSION}',
      'filestack-trace-id': `${Math.floor(Date.now() / 1000)}-${uniqueId()}`,
      'filestack-trace-span': `jssdk-${uniqueId()}`,
    },
  });

  if (retryConfig) {
    useRetryPolicy(axiosInstance, retryConfig);
  }

  useDebugInterceptor(axiosInstance);
  return axiosInstance;
};

export const postWithRetry = (url: string, fields: Object, config: AxiosRequestConfig = {}, retryConfig?: RetryConfig): Promise<AxiosResponse> => {
  debug(`[RequestWithRetry] set fields %O for url ${url}`, fields);

  if (!config.headers) {
    config.headers = {};
  }

  config.headers = Object.assign({}, config.headers, {
    'filestack-source': 'JS-@{VERSION}',
    'filestack-trace-id': `${Math.floor(Date.now() / 1000)}-${uniqueId()}`,
    'filestack-trace-span': `jssdk-${uniqueId()}`,
  });

  const axiosInstance = axios.create();

  if (retryConfig) {
    useRetryPolicy(axiosInstance, retryConfig);
  }

  useDebugInterceptor(axiosInstance);
  return axiosInstance.post(url, fields, config);
};

export const shouldRetry = (err: AxiosError) => {
  // we always should retry on network failure
  switch (err.code) {
    case 'ECONNRESET':
    case 'ETIMEDOUT':
    case 'EADDRINUSE':
    case 'ESOCKETTIMEDOUT':
    case 'EPIPE':
      return true;
  }

  // if request was not made and there is no response - retry
  if (!err.response) {
    return true;
  }

  // we should retry on all server errors (5xx)
  if (500 <= err.response.status && err.response.status <= 599) {
    return true;
  }

  // we should not retry on other errors (4xx) ie: BadRequest etc
  return false;
};

const useDebugInterceptor = (instance) => {
  /* istanbul ignore next */ // this is internal debug method
  instance.interceptors.response.use(resp => {
    if (debug.enabled) {
      for (let i in resp.headers) {
        if (!resp.headers.hasOwnProperty(resp.headers) && i.indexOf(RESPONSE_DEBUG_PREFIX) === -1) {
          continue;
        }

        debug(`Filestack Response Debug Header - ${i}: ${resp.headers[i]}`);
      }
    }

    return resp;
  });
};

export const useRetryPolicy = (instance: AxiosInstance, retryConfig: RetryConfig) => {
  instance.interceptors.request.use(config => {
    const currentState = config['retry'] || {};
    currentState.retryCount = currentState.retryCount || 0;
    config['retry'] = currentState;
    return config;
  });

  return instance.interceptors.response.use(null, err => {
    const requestConfig = err.config;

    if (axios.isCancel(err)) {
      debug('[Retry] Upload canceled by user');
      return Promise.reject(err);
    }

    debug(`[Retry] Start retry process code: ${err.code}, %O`, err);

    /* istanbul ignore next */
    if (!requestConfig) {
      debug(`[Retry] Retry config not found, Rejecting request`);
      return Promise.reject(err);
    }

    const state = requestConfig.retry;

    if (!shouldRetry(err)) {
      debug(`[Retry] Response code not allowing to retry`);
      return Promise.reject(err);
    }

    requestConfig.retry.retryCount += 1;

    if (requestConfig.retry.retryCount > retryConfig.retry) {
      debug(`[Retry] Max retry count reached ${requestConfig.retry.retryCount}`);
      return Promise.reject(err);
    }

    const retryDelay = Math.max(Math.min(retryConfig.retryMaxTime, (retryConfig.retryFactor ** state.retryCount) * 1000), 1);

    debug(`[Retry] Retrying request to ${requestConfig.url}, count ${state.retryCount} of ${retryConfig.retry} - Delay: ${retryDelay}`);
    return new Promise(resolve => setTimeout(() => {
      if (typeof retryConfig.onRetry === 'function') {
        retryConfig.onRetry.call(instance, requestConfig);
      }

      resolve(instance(requestConfig));
    }, retryDelay));
  });
};

// set global debug inspector
useDebugInterceptor(axios);
export { axios as request };
