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
import { trim } from './../utils';
import { FsRequestHeaders } from './../types';

const ignoreDuplicates = [
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent',
];

/**
 * Parse response raw header (xhr)
 *
 * @param {string} headers - raw headers string
 */
export const parse = headers => {
  let parsed = {};
  let key;
  let val;
  let i;

  if (!headers) {
    return parsed;
  }

  headers.split('\n').forEach(line => {
    i = line.indexOf(':');
    key = trim(line.substr(0, i)).toLowerCase();
    val = trim(line.substr(i + 1));

    if (!key) {
      return;
    }

    if (parsed[key] && ignoreDuplicates.indexOf(key) >= 0) {
      return;
    }

    if (key === 'set-cookie') {
      parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

/**
 * Normalize input headers
 *
 * @param headers
 */
export const normalizeHeaders = (headers: FsRequestHeaders): FsRequestHeaders => {
  if (!headers) {
    return {};
  }

  const toReturn = {};

  for (let i in headers) {
    toReturn[normalizeName(i)] =  headers[i];
  }

  return toReturn;
};

// expect(set({}, 'set-cookies', 'value')).toEqual({ 'Set-Cookies': 'value' });
/**
 * Set request headers
 *
 * @param headers - object containing headers
 * @param name - header name
 * @param value - header value
 * @param setIFExists - determine if we should change header value if exists
 */
export const set = (headers: FsRequestHeaders, name: string, value: string, setIFExists = false) => {
  const normalizedName = normalizeName(name);

  if (!headers) {
    headers = {};
  }

  // cleanup headers from undefined vals
  headers = JSON.parse(JSON.stringify(headers));
  if (headers[name] === undefined && headers[normalizedName] === undefined) {
    headers[normalizedName] = value;
  } else if (setIFExists) {
    delete headers[name];
    headers[normalizedName] = value;
  }

  return headers;
};

/**
 * Normalize header names according to rfc spec
 *
 * @param {string} name - header name
 */
export const normalizeName = (name: string) => {
  // the exceptions
  let result = {
    'content-md5': 'Content-MD5',
    dnt: 'DNT',
    etag: 'ETag',
    'last-event-id': 'Last-Event-ID',
    tcn: 'TCN',
    te: 'TE',
    'www-authenticate': 'WWW-Authenticate',
    'x-dnsprefetch-control': 'X-DNSPrefetch-Control',
  }[name.toLowerCase()];

  if (result) {
    return result;
  }

  // the default
  return name
    .split('-')
    .map(function(text) {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    })
    .join('-');
};
