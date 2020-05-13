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
import { isURLSearchParams, isObject, isStream, isFormData, isArrayBuffer, isFile, isBlob, isBuffer } from './../utils';
import { getVersion, uniqueId } from './../../utils';
import { FsRequestOptions, FsResponse } from './../types';
import { set } from './headers';
import * as parser from 'fast-xml-parser';
import Debug from 'debug';

const debug = Debug('fs:request:data');

/**
 * Prepare request and set content-type header based on data
 *
 * @param headers
 * @param data
 */
export const prepareData = (config: FsRequestOptions) => {
  // set filestack debug headers first
  config = filestackHeaders(config);

  if (isFormData(config.data) || isBuffer(config.data) || isStream(config.data) || isFile(config.data) || isBlob(config.data)) {
    return config;
  }

  // @todo convert it to ArrayBufferView for browser
  if (isArrayBuffer(config.data)) {
    return config;
  }

  if (isURLSearchParams(config.data)) {
    config.headers = set(config.headers, 'content-type', 'application/x-www-form-urlencoded;charset=utf-8');
    config.data = config.data.toString();
  } else if (isObject(config.data)) {
    config.headers = set(config.headers, 'content-type', 'application/json', true);
    config.data = JSON.stringify(config.data);
  }

  return config;
};

/**
 * Add filestack debug headers to request
 *
 * @param config
 */
export const filestackHeaders = (config: FsRequestOptions) => {
  if (!config.filestackHeaders) {
    return config;
  }

  config.headers = set(config.headers, 'filestack-source', getVersion());
  config.headers = set(config.headers, 'filestack-trace-id', `${Math.floor(Date.now() / 1000)}-${uniqueId()}`);
  config.headers = set(config.headers, 'filestack-trace-span', `jssdk-${uniqueId()}`);

  return config;
};

/**
 * Prepare response data based on content type
 *
 * @param response
 */
export const parseResponse = async (response: FsResponse): Promise<FsResponse> => {
  if (!response.headers || !response.headers['content-type']) {
    return Promise.resolve(response);
  }

  const contentType = response.headers['content-type'];

  if (/application\/json/.test(contentType)) {
    try {
      response.data = JSON.parse(response.data);
    } catch (e) {
      debug('Cannot parse response %O - %O', response.data, response.headers);
    }
  } else if (/text\/(plain|html)/.test(contentType)) {
    if (isBuffer(response.data)) {
      response.data = bufferToString(response.data);
    }
  } else if (/application\/xml/.test(contentType)) {
    let data = response.data;

    if (isBuffer(response.data)) {
      data = bufferToString(response.data);
    }

    if (parser.validate(data) === true) {
      response.data = parser.parse(data, {
        ignoreAttributes : true,
        trimValues: true,
      });
    }
  }

  return Promise.resolve(response);
};

function bufferToString(buffer) {
  const bufView = new Uint16Array(buffer);
  const length = bufView.length;

  let result = '';
  let addition = Math.pow(2, 16) - 1;

  for (let i = 0; i < length; i += addition) {
    if (i + addition > length) {
      addition = length - i;
    }
    result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
  }

  return result;
}
