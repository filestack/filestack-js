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
import { RequestOptions, Response } from './types';
import { AdapterInterface } from './adapters/interface';
import { RequestError, RequestErrorCode } from './error';
import Debug from 'debug';

const debug = Debug('fs:request:dispatch');

export class Dispatch {

  adapter: AdapterInterface;

  constructor(adapter: AdapterInterface) {
    this.adapter = adapter;
  }

  public request(config: RequestOptions): Promise<Response> {
    config.headers = config.headers || {};

    // Flatten headers
    config.headers = Object.assign({}, config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

    ['delete', 'get', 'purge', 'head', 'post', 'put', 'patch', 'common'].forEach((method) => delete config.headers[method]);

    return this.adapter.request(config).then((response) => {
      // @todo return reject if cancel requested

      return response;
    }, (reason) => {
      return this.retry(reason);
    });
  }

  private retry(err: RequestError)  {
    const config = err.config;

    if (!config.retry) {
      debug('[Retry] Retry config not found. Exiting');
      return Promise.reject(err);
    }

    if (!this.shouldRetry(err)) {
      debug('[Retry] Request is not retriable. Exiting');
      return Promise.reject(err);
    }

    const retryConfig = config.retry;
    let attempts = config.runtime && config.runtime.retryCount ? config.runtime.retryCount : 0;

    if (retryConfig.retry && retryConfig.retry <= attempts) {
      debug('[Retry] Retry attempts reached %d. Exiting', attempts);
      return Promise.reject(err);
    }

    const retryDelay = Math.max(Math.min(retryConfig.retryMaxTime, (retryConfig.retryFactor ** attempts) * 1000), 1);

    config.runtime = {
      ...config.runtime,
      retryCount: attempts++,
    };

    debug(`[Retry] Retrying request to ${config.url}, count ${attempts} of ${retryConfig.retry} - Delay: ${retryDelay}`);

    return new Promise<Response>((resolve) => {
      setTimeout(() => resolve(this.request(config)), retryDelay);
    });
  }

  private shouldRetry(err: RequestError) {
    // we always should retry on network failure
    switch (err.code) {
      case RequestErrorCode.NETWORK:
      case RequestErrorCode.SERVER:
      case RequestErrorCode.TIMEOUT:
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
  }
}
