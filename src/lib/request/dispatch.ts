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
import { FsRequestOptions, FsResponse } from './types';
import { AdapterInterface } from './adapters/interface';
import { FsRequestError } from './error';
import { shouldRetry } from './helpers/shouldRetry';
import Debug from 'debug';

const debug = Debug('fs:request:dispatch');

/**
 * Request dispatcher
 *
 * @export
 * @class Dispatch
 */
export class Dispatch {
  adapter: AdapterInterface;

  /**
   * Creates an instance of Dispatch.
   *
   * @param {AdapterInterface} adapter http | XHR adapater
   * @memberof Dispatch
   */
  constructor(adapter: AdapterInterface) {
    this.adapter = adapter;
  }

  /**
   * Dispatch request adding retry policy
   * @todo add data preprocesor
   *
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof Dispatch
   */
  public request(config: FsRequestOptions): Promise<FsResponse> {
    config.headers = config.headers || {};
    debug('Dispatching request %O', config);
    return this.adapter.request(config).catch((reason: FsRequestError) => {
      debug('Request error "%s": %O', reason, reason.response);
      return this.retry(reason);
    });
  }

  /**
   * Request retrier
   *
   * @private
   * @param {FsRequestError} err
   * @returns
   * @memberof Dispatch
   */
  private retry(err: FsRequestError) {
    const config = err.config;

    if (!shouldRetry(err)) {
      debug('[Retry] Request error is not retriable. Exiting');
      return Promise.reject(err);
    }

    if (!config.retry) {
      debug('[Retry] Retry config not found. Exiting');
      return Promise.reject(err);
    }

    const retryConfig = config.retry;
    let attempts = config.runtime && config.runtime.retryCount ? config.runtime.retryCount : 0;

    if (retryConfig.retry && retryConfig.retry <= attempts) {
      debug('[Retry] Retry attempts reached %d. Exiting', attempts);
      return Promise.reject(err);
    }

    const retryDelay = Math.max(Math.min(retryConfig.retryMaxTime, retryConfig.retryFactor ** attempts * 1000), 1);

    config.runtime = {
      ...config.runtime,
      retryCount: attempts + 1,
    };

    debug(`[Retry] Retrying request to ${config.url}, count ${attempts} of ${retryConfig.retry} - Delay: ${retryDelay}`);

    return new Promise<FsResponse>(resolve => {
      setTimeout(() => resolve(this.request(config)), retryDelay);
    });
  }
}
