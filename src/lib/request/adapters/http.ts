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

import * as url from 'url';
import * as zlib from 'zlib';
import Debug from 'debug';

import { AdapterInterface } from './interface';
import { getVersion } from '../../utils';
import { FsRequestOptions, FsResponse } from '../types';
import * as utils from '../utils';
import { prepareData, parseResponse, combineURL, set as setHeader, normalizeHeaders } from './../helpers';
import { FsRequestErrorCode, FsRequestError } from '../error';

const HTTPS_REGEXP = /https:?/;
const MAX_REDIRECTS = 10;
const debug = Debug('fs:request:http');

export class HttpAdapter implements AdapterInterface {
  private redirectHoops = 0;
  private redirectPaths = [];

  request(config: FsRequestOptions) {
    config.headers = normalizeHeaders(config.headers);

    let { data, headers } = prepareData(config);

    headers = setHeader(headers, 'user-agent', `filestack-request/${getVersion()}`);

    // for now we are not using streams
    if (data) {
      debug('Request data %O', data);

      if (!Buffer.isBuffer(data)) {
        if (!utils.isString(data)) {
          return Promise.reject(new FsRequestError('Data must be a string, JSON or a Buffer', config));
        }

        data = Buffer.from(data, 'utf-8');
      }

      headers = setHeader(headers, 'content-length', data.length, true);
    }

    // HTTP basic authentication
    let auth;
    if (config.auth) {
      auth = `${config.auth.username || ''}:${config.auth.password || ''}`;
    }

    // Parse url
    let parsed = url.parse(config.url);

    // try to add default https protocol
    if (!parsed.protocol) {
      parsed = url.parse(`https://${config.url}`);
    }

    if (!parsed.host) {
      return Promise.reject(new FsRequestError(`Cannot parse provided url ${config.url}`, config, null, FsRequestErrorCode.NETWORK));
    }

    // normalize auth header
    if (auth && headers.Authorization) {
      delete headers.Authorization;
    }

    const isHttpsRequest = HTTPS_REGEXP.test(parsed.protocol);
    const agent = isHttpsRequest ? require('https') : require('http');

    const options = {
      path: combineURL(parsed.path, config.params),
      host: parsed.host,
      port: parsed.port,
      protocol: parsed.protocol,
      method: config.method.toUpperCase(),
      headers: headers,
      agent: new agent.Agent(),
      auth: auth,
    };

    debug('Starting %s request with options %O', isHttpsRequest ? 'https' : 'http', options);

    return new Promise<FsResponse>((resolve, reject): any => {
      let req = agent.request(options, res => {
        // just be sure that response will not be called after request is aborted
        /* istanbul ignore next */
        if (!req || req.aborted) {
          return reject(new FsRequestError('Request aborted', config));
        }

        let stream = res;
        debug('Response statusCode: %d, Response Headers: %O', res.statusCode, res.headers);

        const compressHeaders = res.headers['content-encoding'];

        if (compressHeaders && compressHeaders.length && ['gzip', 'compress', 'deflate'].some((v) => compressHeaders.indexOf(v) > -1)) {
          // add the unzipper to the body stream processing pipeline
          stream = res.statusCode === 204 ? stream : stream.pipe(zlib.createUnzip());
          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
        }

        let response: FsResponse = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config,
          data: {},
        };

        // we need to follow redirect so make same request with new location

        if ([301, 302].indexOf(res.statusCode) > -1) {
          debug('Redirect received %s', res.statusCode);

          if (this.redirectHoops >= MAX_REDIRECTS) {
            return reject(new FsRequestError(`Max redirects (${this.redirectHoops}) reached. Exiting`, config, response, FsRequestErrorCode.REDIRECT));
          }

          const url = res.headers['location'];

          if (!url || url.length === 0) {
            return reject(new FsRequestError(`Redirect header location not found`, config, response, FsRequestErrorCode.REDIRECT));
          }

          if (this.redirectPaths.indexOf(url) > -1) {
            return reject(new FsRequestError(`Redirect loop detected at url ${url}`, config, response, FsRequestErrorCode.REDIRECT));
          }

          this.redirectPaths.push(url);
          this.redirectHoops++;

          // free resources
          res = undefined;
          req = undefined;

          debug('Redirecting request to %s (hoop-count: %d)', url, this.redirectHoops);

          return resolve(this.request(Object.assign({}, config, { url })));
        }

        let responseBuffer = [];
        stream.on('data', chunk => responseBuffer.push(chunk));

        stream.on('error', err => {
          res = undefined;
          req = undefined;
          responseBuffer = undefined;

          debug('Request error: Aborted %O', err);

          if (req.aborted) {
            return;
          }

          return reject(new FsRequestError(err.message, config, null, FsRequestErrorCode.NETWORK));
        });

        stream.on('end', () => {
          // check if there is any response data inside
          if (res.statusCode !== 204) {
            // prepare response
            response.data = Buffer.concat(responseBuffer);
            response = parseResponse(response);
          } else {
            response.data = null;
          }

          // free resources
          res = undefined;
          req = undefined;
          responseBuffer = undefined;

          if (500 <= response.status && response.status <= 599) {
            // server error throw
            debug('Server error(5xx) - %O', response);
            return reject(new FsRequestError(`Server error ${url}`, config, response, FsRequestErrorCode.SERVER));
          } else if (400 <= response.status && response.status <= 499) {
            debug('Request error(4xx) - %O', response);
            return reject(new FsRequestError(`Request error ${url}`, config, response, FsRequestErrorCode.REQUEST));
          }

          debug('Request ends: %O', response);
          return resolve(response);
        });
      });

      if (config.cancelToken) {
        config.cancelToken
          .getSource()
          .then(reason => {
            // if request is done cancel token should not throw any error
            if (!req) {
              return;
            }

            req.abort();

            debug('Request canceled by user %s', reason);
            reject(new FsRequestError(`Request aborted - ${reason}`, config, null, FsRequestErrorCode.ABORTED));
          })
          // only for safety
          /* istanbul ignore next */
          .catch(error => error);
      }

      if (config.timeout) {
        req.setTimeout(config.timeout, () => {
          req.abort();
          return reject(new FsRequestError('Request timeout', config, null, FsRequestErrorCode.TIMEOUT));
        });
      }

      req.on('error', err => {
        if (req.aborted) {
          return;
        }

        debug('Request error: %s - %O', err, err.code);
        return reject(new FsRequestError(`Request error: ${err.code}`, config, null, FsRequestErrorCode.NETWORK));
      });

      req.end(data);
    });
  }
}
