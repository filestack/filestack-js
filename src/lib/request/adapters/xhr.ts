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
import { FsRequestOptions, FsResponse, FsHttpMethod } from '../types';
import { FsRequestError, FsRequestErrorCode } from '../error';
import { prepareData, parseResponse, parse as parseHeaders, combineURL } from './../helpers';

const debug = Debug('fs:request:xhr');
const CANCEL_CLEAR = `FsCleanMemory`;

export class XhrAdapter implements AdapterInterface {

  request(config: FsRequestOptions) {
    // if this option is unspecified set it by default
    if (typeof config.filestackHeaders === 'undefined') {
      config.filestackHeaders = true;
    }

    config = prepareData(config);
    config.headers = config.headers || {};

    let { data, headers } = config;

    // if data is type of form let browser to set proper content type
    if (utils.isFormData(data)) {
      delete headers['Content-Type'];
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      if (!config.auth.username || config.auth.username.length === 0 || !config.auth.password || config.auth.password.length === 0) {
        return Promise.reject(new FsRequestError(`Basic auth: username and password are required ${config.auth}`, config));
      }

      headers.Authorization = 'Basic ' + btoa(unescape(encodeURIComponent(`${config.auth.username}:${config.auth.password}`)));
      debug('Set request authorization to %s', config.auth.username + config.auth.password);
    }

    let url = config.url.trim();

    if (!/^http(s)?:\/\//.test(url)) {
      url = `https://${url}`;
    }

    url = combineURL(url, config.params);

    debug('Starting request to %s with options %O', url, config);

    request.open(config.method.toUpperCase(), url, true);

    request.timeout = config.timeout;

    return new Promise<FsResponse>((resolve, reject) => {
      request.onreadystatechange = async () => {
        if (!request || request.readyState !== 4) {
          return;
        }

        if (request.status === 0 && !request.responseURL) {
          return;
        }

        // Prepare the response
        const responseHeaders = parseHeaders(request.getAllResponseHeaders());
        const responseData = request.response;

        let response: FsResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
        };

        request = null;
        response = await parseResponse(response);

        if (500 <= response.status && response.status <= 599) {
          // server error throw
          debug('Server error(5xx) - %O', response);
          return reject(new FsRequestError(`Server error ${url}`, config, response, FsRequestErrorCode.SERVER));
        } else if (400 <= response.status && response.status <= 499) {
          debug('Request error(4xx) - %O', response);
          return reject(new FsRequestError(`Request error ${url}`, config, response, FsRequestErrorCode.REQUEST));
        }

        // clear cancel token to avoid memory leak
        if (config.cancelToken) {
          config.cancelToken.cancel(CANCEL_CLEAR);
        }

        return resolve(response);
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        /* istanbul ignore next: just to be sure that abort was not called twice */
        if (!request) {
          return;
        }

        request = null;
        reject(new FsRequestError('Request aborted', config, null, FsRequestErrorCode.ABORTED));
      };

      // Handle low level network errors
      request.onerror = function handleError(err) {
        request = null;
        debug('Request error! %O', err);
        reject(new FsRequestError('Network Error', config, null, FsRequestErrorCode.NETWORK));
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        request = null;
        debug('Request timed out. %O', config);
        reject(new FsRequestError('Request timeout', config, null, FsRequestErrorCode.TIMEOUT));
      };

      // Add headers to the request
      if ('setRequestHeader' in request && headers && Object.keys(headers).length) {
        for (let key in headers) {
          if (headers[key] === undefined) {
            continue;
          }

          debug('Set request header %s to %s', key, headers[key]);
          request.setRequestHeader(key, headers[key]);
        }
      }

      if (typeof config.onProgress === 'function' && [FsHttpMethod.POST, FsHttpMethod.PUT].indexOf(config.method) > -1) {
        /* istanbul ignore else: else path is just fallback to normal progress event */
        if (request.upload) {
          debug('Bind to upload progress event');
          request.upload.addEventListener('progress', config.onProgress);
        } else {
          debug('Bind to progress event');
          request.addEventListener('progress', config.onProgress);
        }
      }

      if (config.cancelToken) {
        config.cancelToken
          .getSource()
          .then(reason => {
            // do nothing if promise is resolved by system
            if (reason && reason.message === CANCEL_CLEAR) {
              return;
            }

            /* istanbul ignore next: if request is done cancel token should not throw any error */
            if (request) {
              request.abort();
              request = null;
            }

            debug('Request canceled by user %s, config: %O', reason, config);
            return reject(new FsRequestError(`Request aborted. Reason: ${reason}`, config, null, FsRequestErrorCode.ABORTED));
          })
          /* istanbul ignore next: only for safety */
          .catch(() => {/* empty */});
      }

      if (data === undefined) {
        data = null;
      }

      request.send(data);
    });
  }
}
