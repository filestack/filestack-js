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
import * as Stream from 'stream';
import { FsRequestOptions, FsResponse } from '../types';
import * as utils from '../utils';
import { prepareData, parseResponse, combineURL, set as setHeader, normalizeHeaders } from './../helpers';
import { FsRequestErrorCode, FsRequestError } from '../error';
import { FsHttpMethod } from './../types';

const HTTPS_REGEXP = /https:?/;
const HTTP_CHUNK_SIZE = 16 * 1024;
const MAX_REDIRECTS = 10;
const CANCEL_CLEAR = `FsCleanMemory`;
const debug = Debug('fs:request:http');

/**
 * Writable stream thats overwrap http request for progress event
 *
 * @class HttpWritableStream
 * @extends {Stream.Writable}
 */
class HttpWritableStream extends Stream.Writable {
  private request;

  constructor(req, opts = {}) {
    super(opts);

    this.request = req;
    req.once('drain', () => this.emit('drain'));
  }

  _write(chunk: any, encoding?: string, cb?: (error: Error | null | undefined) => void): void {
    this.request.write(chunk, encoding, cb);
  }

  end(chunk) {
    if (chunk) {
      this.request.write(chunk);
    }

    this.request.end();
  }
}

/**
 * Node http request class
 *
 * @export
 * @class HttpAdapter
 * @implements {AdapterInterface}
 */
export class HttpAdapter implements AdapterInterface {
  private redirectHoops = 0;
  private redirectPaths = [];

  /**
   * do request based on configuration
   *
   * @param {FsRequestOptions} config
   * @returns
   * @memberof HttpAdapter
   */
  request(config: FsRequestOptions) {
    // if this option is unspecified set it by default
    if (typeof config.filestackHeaders === 'undefined') {
      config.filestackHeaders = true;
    }

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
      if (!config.auth.username || config.auth.username.length === 0) {
        return Promise.reject(new FsRequestError(`Basic auth: username is required ${config.auth}`, config));
      }

      auth = `${config.auth.username}:${config.auth.password}`;
    }

    // Parse url
    let parsed = url.parse(config.url);

    // try to add default https protocol
    if (!parsed.protocol) {
      parsed = url.parse(`https://${config.url}`);
    }

    /* istanbul ignore next: just be sure that the host is parsed correctly, not needed to test */
    if (!parsed.host) {
      return Promise.reject(new FsRequestError(`Cannot parse provided url ${config.url}`, config));
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
        /* istanbul ignore next: just be sure that response will not be called after request is aborted */
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

          // clear cancel token to avoid memory leak
          if (config.cancelToken) {
            config.cancelToken.cancel(CANCEL_CLEAR);
          }

          return resolve(this.request(Object.assign({}, config, { url })));
        }

        let responseBuffer = [];
        stream.on('data', chunk => responseBuffer.push(chunk));

        /* istanbul ignore next: its hard to test socket events with jest and nock - tested manually */
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

        stream.on('end', async () => {
          // check if there is any response data inside
          if (res.statusCode !== 204) {
            // prepare response
            response.data = Buffer.concat(responseBuffer);
            response = await parseResponse(response);
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
            // do nothing if promise is resolved by system
            if (reason && reason.message === CANCEL_CLEAR) {
              return;
            }

            /* istanbul ignore next: if request is done cancel token should not throw any error */
            if (req) {
              req.abort();
              req = null;
            }

            debug('Request canceled by user %s, config: %O', reason, config);
            return reject(new FsRequestError(`Request aborted. Reason: ${reason}`, config, null, FsRequestErrorCode.ABORTED));
          })
          /* istanbul ignore next: only for safety */
          .catch(() => {/* empty */});
      }

      if (config.timeout) {
        req.setTimeout(config.timeout, () => {
          req.abort();
          return reject(new FsRequestError('Request timeout', config, null, FsRequestErrorCode.TIMEOUT));
        });
      }

      req.on('error', err => {
        if (!req || req.aborted) {
          return;
        }

        debug('Request error: %s - %O', err, err.code);
        return reject(new FsRequestError(`Request error: ${err.code}`, config, null, FsRequestErrorCode.NETWORK));
      });

      if (Buffer.isBuffer(data) && ['POST', 'PUT'].indexOf(config.method) > -1) {
        return this.bufferToChunks(data).pipe(this.getProgressMonitor(config, data.length)).pipe(new HttpWritableStream(req));
      }

      req.end(data);
    });
  }

  /**
   * Monitor and emit progress event if needed
   *
   * @private
   * @memberof HttpAdapter
   */
  private getProgressMonitor = (config, total) => {
    let loaded = 0;

    const progress = new Stream.Transform();
    progress._transform = (chunk, encoding, cb) => {
      if (typeof config.onProgress === 'function' && [FsHttpMethod.POST, FsHttpMethod.PUT].indexOf(config.method) > -1) {
        loaded += chunk.length;
        config.onProgress({
          lengthComputable: true,
          loaded,
          total,
        });
      }
      cb(null, chunk);
    };

    return progress;
  }

  /**
   * Convert buffer to stream
   *
   * @private
   * @param {*} buffer
   * @returns {Stream.Readable}
   * @memberof HttpAdapter
   */
  private bufferToChunks(buffer): Stream.Readable {
    const chunking = new Stream.Readable();
    const totalLength = buffer.length;
    const remainder = totalLength % HTTP_CHUNK_SIZE;
    const cutoff = totalLength - remainder;

    for (let i = 0; i < cutoff; i += HTTP_CHUNK_SIZE) {
      const chunk = buffer.slice(i, i + HTTP_CHUNK_SIZE);
      chunking.push(chunk);
    }

    if (remainder > 0) {
      const remainderBuffer = buffer.slice(-remainder);
      chunking.push(remainderBuffer);
    }

    chunking.push(null);

    return chunking;
  }
}
