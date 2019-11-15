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

import { AdapterAbstract } from './abstract';
import { getVersion } from './../../utils';
import { RequestOptions, Response } from './../types';
import * as utils from './../utils';
import { FilestackError } from './../../../';
import Debug from 'debug';

// import { parse } from 'path';

const HTTPS_REGEXP =  /https:?/;
const MAX_REDIRECTS = 10;
const debug = Debug('fs:request:http');

export class HttpAdapter extends AdapterAbstract {

  private redirectHoops = 0;
  private redirectPaths = [];

  // @ts-ignore
  request(config: RequestOptions) {
    let data = config.data;
    const headers = config.headers;

    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = `filestack-request/${getVersion()}`;
    }

    if (data && !utils.isStream(data)) {
      if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return Promise.reject(new FilestackError('Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream', config));
      }

      headers['Content-Length'] = data.length;

      //@todo handle data type - content-type
      //@todo normalize headers name
    }

     // HTTP basic authentication
    let auth;
    if (config.auth) {
      auth = `${config.auth.username}:${config.auth.password}`;
    }

    // Parse url
    const parsed = url.parse(config.url);
    const protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      const urlAuth = parsed.auth.split(':');
      const urlUsername = urlAuth[0] || '';
      const urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    const isHttpsRequest = HTTPS_REGEXP.test(protocol);
    const agent = isHttpsRequest ? require('https') : require('http');

    const options = {
      path: parsed.path,
      host: parsed.host,
      port: parsed.port,
      protocol: parsed.protocol,
      method: config.method.toUpperCase(),
      headers: headers,
      agent: new agent.Agent(),
      auth: auth,
    };

    debug('Starting %s request with options %O', isHttpsRequest ? 'https' : 'http', options);

    return new Promise((resolve, reject): any => {
      let req = agent.request(options, (res) => {
        if (req.aborted) {
          return reject(new FilestackError('Request aborted', config));
        }

        let stream = res;

        switch (res.headers['content-encoding']) {
          case 'gzip':
          case 'compress':
          case 'deflate':
            // add the unzipper to the body stream processing pipeline
            stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());
            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
        }

        // we need to follow redirect so make same request with new location
        if ([301,302].indexOf(res.statusCode) > -1) {
          debug('Redirect received %s', res.statusCode);

          if (this.redirectHoops >= MAX_REDIRECTS) {
            return reject(new FilestackError(`Max redirects (${this.redirectHoops}) reached. Exiting`));
          }
          const url = res.headers['location'];

          if (!url || url.length === 0) {
            return reject(new FilestackError(`Redirect header location not found`));
          }

          if (this.redirectPaths.indexOf(url) > -1) {
            return reject(new FilestackError(`Redirect loop detected at url ${url}`));
          }

          this.redirectPaths.push(url);
          this.redirectHoops++;

          // free resources
          res = undefined;
          req = undefined;

          debug('Redirecting request to %s (hoop-count: %d)', url, this.redirectHoops);

          return resolve(this.request(Object.assign({}, config, { url })));
        }

        let response: Response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config,
          data: {},
        };

        let responseBuffer = [];
        stream.on('data', (chunk) => responseBuffer.push(chunk));

        stream.on('error', (err) => {
          if (req.aborted) {
            return reject(new FilestackError('Request aborted', config));
          }

          return reject(new FilestackError(err, config));
        });

        stream.on('end', () => {
          let responseData = Buffer.concat(responseBuffer);
          response.data = responseData;
          return resolve(response);
        });
      });

      // @todo handle timeout
      // @todo handle cancel token
      // @todo handle request error
      // @todo implement retry

      req.end(data);
    });
  }
}
