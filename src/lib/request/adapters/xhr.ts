
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

import { AdapterInterface } from './interface';
import { RequestOptions, Response } from '../types';
import * as utils from '../utils';
import { prepareData, parseResponse } from './../helpers/data';
import { RequestError, RequestErrorCode } from '../error';
import { parse as parseHeaders } from '../helpers';
import Debug from 'debug';

const debug = Debug('fs:request:xhr');

export class XhrAdapter implements AdapterInterface {
  request(config: RequestOptions) {

    config = prepareData(config);

    let { data, headers } = config;

    // if data is type of form let browser to set proper content type
    if (utils.isFormData(data)) {
      delete headers['Content-Type'];
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password || '';
      headers.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    debug('Starting request to %s with options %O', config.url, config);

    request.open(config.method.toUpperCase(), config.url, true);

    request.timeout = config.timeout;

    return new Promise<Response>((resolve, reject) => {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        const responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        const responseData = request.response;

        const response: Response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
        };

        request = null;

        resolve(parseResponse(response));
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        request = null;
        reject(new RequestError('Request aborted', config, null, RequestErrorCode.ABORTED));
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        request = null;
        reject(new RequestError('Network Error', config, null, RequestErrorCode.NETWORK));
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        request = null;
        reject(new RequestError('Request timeout', config, null, RequestErrorCode.TIMEOUT));
      };

      // Add headers to the request
      if ('setRequestHeader' in request && headers && Object.keys.length) {
        for (let key in headers) {
          if (typeof data === 'undefined') {
            delete headers[key];
            continue;
          }

          request.setRequestHeader(key, headers[key]);
        }
      }

    // Add withCredentials to request if needed
    // @todo
    // if (config.withCredentials) {
    //   request.withCredentials = true;
    // }

      // Handle progress if needed
      if (typeof config.onProgress === 'function') {
        request.addEventListener('progress', config.onProgress);
      }

    // if (config.cancelToken) {
    //   // Handle cancellation
    //   config.cancelToken.promise.then(function onCanceled(cancel) {
    //     if (!request) {
    //       return;
    //     }

    //     request.abort();
    //     reject(cancel);
    //     // Clean up request
    //     request = null;
    //   });
    // }

      if (data === undefined) {
        data = null;
      }

      request.send(data);
    });
  }
}
