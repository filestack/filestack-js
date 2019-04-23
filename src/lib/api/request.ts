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
import * as FormData from 'form-data';
// import { uniqueId } from '../utils';

const debug = Debug('fs:request');

export interface RetryConfig {
  retry: number;
  onRetry?: () => void;
  retryMaxTime: number;
  retryFactor: number;
}

/**
 *
 * @private
 * @param method
 * @param url
 */
export const requestWithSource = (retryConfig?): AxiosInstance => {
  const axiosInstance = axios.create({ headers: {
    'Filestack-Source': 'JS-@{VERSION}',
    // 'Filestack-Trace-Id': `${Date.now() / 100}-${uniqueId()}`,
    // 'Filestack-Trace-Span': `jssdk-${uniqueId()}`,
  }});

  if (retryConfig) {
    useRetryPolicy(axiosInstance, retryConfig);
  }

  return axiosInstance;
};

/**
 * Make multipart POST request to given url with parsed form data
 *
 * @private
 * @param url - request url
 * @param fields - multipart fields (key->value)
 * @config Axios Config
 */
const multipart = (url: string, fields: Object, config: AxiosRequestConfig = {}, retryConfig?: RetryConfig): Promise<AxiosResponse> => {
  const fd = new FormData();

  debug(`[Multipart] set mulitpart fields %O for url ${url}`, fields);
  Object.keys(fields).forEach((key: string) => {
    let field = fields[key];

    if (field === undefined) {
      return;
    }

    if (typeof field === 'object') {
      field = JSON.stringify(field);
    }

    fd.append(key, field);
  });

  if (!config.headers) {
    config.headers = {};
  }

  config.headers = Object.assign(
    {},
    // support for node boundary
    fd.getHeaders ? fd.getHeaders() : undefined,
    config.headers,
    {
      'Filestack-Source': 'JS-@{VERSION}',
      // 'Filestack-Trace-Id': uniqueId(), // add time in minutes before id
      // 'Filestack-Trace-Span': `jssdk-${uniqueId()}`,
    }
  );

  const axiosInstance = axios.create();

  if (retryConfig) {
    useRetryPolicy(axiosInstance, retryConfig);
  }

  return axiosInstance.post(url, fd, config);
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

export const useRetryPolicy = (instance: AxiosInstance, retryConfig: RetryConfig) => {
  axios.interceptors.request.use(config => {
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

    if (!requestConfig) {
      return Promise.reject(err);
    }

    const state = requestConfig.retry;

    if (!state) {
      return Promise.reject(err);
    }

    if (!shouldRetry(err)) {
      debug(`[Retry] Response code not allowing to retry`);
      return Promise.reject(err);
    }

    state.retryCount += 1;

    if (requestConfig.retryCount > retryConfig.retry) {
      return Promise.reject(err);
    }

    const retryDelay = Math.max(Math.min(retryConfig.retryMaxTime, retryConfig.retryFactor ** requestConfig.retryCount * 1000), 1);

    debug(`[Retry] Retrying request to ${requestConfig.url}, count ${state.retryCount} of ${retryConfig.retry} - Delay: ${retryDelay}`);
    return new Promise(resolve => setTimeout(() => resolve(instance(requestConfig)), retryDelay));
  });
};

export { axios as request, multipart };
