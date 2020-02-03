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
import { FsRequestOptions, FsHttpMethod, FsResponse } from './types';
import { Dispatch } from './dispatch';
import { RequestAdapter } from './request_adapter.node';

/**
 * Main isomorphic Filestack request library
 *
 * @export
 * @class FsRequest
 */
export class FsRequest {
  /**
   * Request static instance
   *
   * @private
   * @static
   * @type {FsRequest}
   * @memberof FsRequest
   */
  private static instance: FsRequest;

  /**
   * Default request options
   *
   * @private
   * @type {RequestOptions}
   * @memberof FsRequest
   */
  private defaults: FsRequestOptions;

  /**
   * Request Dispatcher
   *
   * @private
   * @type {Dispatch}
   * @memberof FsRequest
   */
  private dispatcher: Dispatch;

  /**
   * Creates an instance of Request.
   *
   * @param {RequestOptions} [config]
   * @memberof FsRequest
   */
  constructor(config?: FsRequestOptions) {

    this.defaults = config;
    this.dispatcher = new Dispatch(new RequestAdapter());
  }

  /**
   * Returns static FsRequest instance
   *
   * @private
   * @static
   * @returns
   * @memberof FsRequest
   */
  private static getInstance() {
    if (!FsRequest.instance) {
      FsRequest.instance = new FsRequest();
    }

    return FsRequest.instance;
  }

  /**
   * Run request with given adapter
   *
   * @param {RequestOptions} config
   * @returns
   * @memberof Request
   */

  public dispatch(config: FsRequestOptions) {
    if (!config.method) {
      config.method = FsHttpMethod.GET;
    }

    return this.dispatcher.request(Object.assign({}, this.defaults, config));
  }

  /**
   * Dispatch request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static dispatch(url: string, config: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { url }));
  }

  /**
   * Dispatch GET request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static get(url: string, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.GET, url }));
  }

  /**
   * Dispatch HEAD request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static head(url: string, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.HEAD, url }));
  }

  /**
   * Dispatch OPTIONS request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static options(url: string, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.OPTIONS, url }));
  }

  /**
   * Dispatch PURGE request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static purge(url: string, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.PURGE, url }));
  }

  /**
   * Dispatch DELETE request
   *
   * @static
   * @param {string} url
   * @param {FsRequestOptions} config
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static delete(url: string, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.DELETE, url }));
  }

  /**
   * Dispatch POST request
   *
   * @static
   * @param {string} url
   * @param {*} [data]
   * @param {FsRequestOptions} [config]
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static post(url: string, data?: any, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.POST, url, data }));
  }

  /**
   * Dispatch PUT request
   *
   * @static
   * @param {string} url
   * @param {*} [data]
   * @param {FsRequestOptions} [config]
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static put(url: string, data?: any, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.PUT, url, data }));
  }

  /**
   * Dispatch PATCH request
   *
   * @static
   * @param {string} url
   * @param {*} [data]
   * @param {FsRequestOptions} [config]
   * @returns {Promise<FsResponse>}
   * @memberof FsRequest
   */
  public static path(url: string, data?: any, config?: FsRequestOptions): Promise<FsResponse> {
    return FsRequest.getInstance().dispatch(Object.assign({}, config || {}, { method: FsHttpMethod.PATH, url, data }));
  }
}

export default FsRequest;
