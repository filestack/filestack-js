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

/**
 * Combine url with qs parameters
 *
 * @param {String} url base url
 * @param {Object} params Query string params object
 */
export const combineURL = (url, params) => {
  if (!params) {
    return url;
  }

  const serialized = urlfy(params);
  const hashIndex = url.indexOf('#');

  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex);
  }

  return url + (url.indexOf('?') === -1 ? '?' : '&') + serialized;
};

/**
 * Change request json params to url search ones
 *
 * @param {Object} obj Object to transform
 */
export const urlfy = val =>
  Object.keys(val)
    .filter(k => k && typeof val[k] !== 'undefined')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(val[k])}`)
    .join('&');
