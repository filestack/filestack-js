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
import { RequestOptions, FilestackStatic, HttpMethod } from './types';
import { HttpAdapter, XhrAdapter } from './adapter';
import { dispatch } from './dispatch';

export class RequestInstance {
  private defaults: RequestOptions;

  constructor(config?: RequestOptions) {
    this.defaults = config;
  }

  request(config: RequestOptions) {
     /*eslint no-param-reassign:0*/
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    if (!config.method && this.defaults.method) {
      config.method = this.defaults.method;
    }

    if (!config.method) {
      config.method = HttpMethod.GET;
    }

    let adapter;

    // @todo - select proper adapter according to env use require to for tree shaking ?
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      adapter = new HttpAdapter();
    } else {
      adapter = new XhrAdapter();
    }

    return dispatch(config, adapter);
  }
}

export const StaticRequest: FilestackStatic = {
  request: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { url }));
  },
  get: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.GET, url }));
  },
  head: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.HEAD, url }));
  },
  options: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.OPTIONS, url }));
  },
  purge: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.PURGE, url }));
  },
  delete: (url: string, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.DELETE, url }));
  },
  post: (url: string, data: any, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.POST, url, data }));
  },
  put: (url: string, data: any, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.PUT, url, data }));
  },
  patch: (url: string, data: any, config: RequestOptions) => {
    return (new RequestInstance()).request(Object.assign({}, config || {}, { method: HttpMethod.PATCH, url, data }));
  },
};

export default StaticRequest;
