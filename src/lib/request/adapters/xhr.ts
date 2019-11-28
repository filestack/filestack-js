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
import Debug from 'debug';
import * as utils from '../utils';
import { AdapterInterface } from './interface';
import { FsRequestOptions, FsResponse } from '../types';
import { FsRequestError, FsRequestErrorCode } from '../error';
import { prepareData, parseResponse, parse as parseHeaders, combineURL } from './../helpers';

const debug = Debug('fs:request:xhr');

export class XhrAdapter implements AdapterInterface {
  request(config: FsRequestOptions) {
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
      debug('Set request authorization to %s', username + ':' + password);
    }

    const url = combineURL(config.url, config.params);
    debug('Starting request to %s with options %O', url, config);

    request.open(config.method.toUpperCase(), url, true);

    request.timeout = config.timeout;

    return new Promise<FsResponse>((resolve, reject) => {
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

        const response: FsResponse = {
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
        reject(new FsRequestError('Request aborted', config, null, FsRequestErrorCode.ABORTED));
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        request = null;
        reject(new FsRequestError('Network Error', config, null, FsRequestErrorCode.NETWORK));
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        request = null;
        reject(new FsRequestError('Request timeout', config, null, FsRequestErrorCode.TIMEOUT));
      };

      // Add headers to the request
      if ('setRequestHeader' in request && headers && Object.keys.length) {
        for (let key in headers) {
          if (typeof data === 'undefined') {
            delete headers[key];
            continue;
          }
          debug('Set request header %s to %s', key, headers[key]);
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
        debug('Request progress setup');
        request.addEventListener('progress', config.onProgress);
      }

      if (config.cancelToken) {
        config.cancelToken
          .getSource()
          .then(reason => {
            // if request is done cancel token should not throw any error
            if (!request) {
              return;
            }

            request.abort();
            request = null;

            return reject(new FsRequestError(`Request aborted. Reason: ${reason}`, config, null, FsRequestErrorCode.ABORTED));
          })
          .catch(error => error);
      }

      if (data === undefined) {
        data = null;
      }

      request.send(data);
    });
  }
}
