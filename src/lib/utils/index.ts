/*
 * Copyright (c) 2018 by Filestack.
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

import { Session } from '../client';
import { Hosts } from './../../config';
import { ExtensionsMap } from './extensions';
import { fromBuffer } from 'file-type';
import isutf8 from 'isutf8';

/**
 * Resolve cdn url based on handle type
 *
 * @private
 * @param session session object
 * @param handle file handle (hash, src://alias, url)
 */
export const resolveCdnUrl = (session: Session, handle: string): string => {
  const cdnURL = session.urls.cdnUrl;

  if (handle && (handle.indexOf('src:') === 0 || handle.indexOf('http') === 0)) {
    if (!session.apikey) {
      throw new Error('Api key is required when storage alias is provided');
    }

    // apikey is required for alias or external sources call
    return `${cdnURL}/${session.apikey}`;
  }

  return cdnURL;
};

/**
 * Resolve all urls with provided cnames
 *
 * @private
 * @param urls
 * @param cname
 */
export const resolveHost = (urls: Hosts, cname: string): Hosts => {
  if (!cname) {
    return urls;
  }

  const hosts = /filestackapi.com|filestackcontent.com/i;

  Object.keys(urls).forEach(key => {
    urls[key] = urls[key].replace(hosts, cname);
  });

  return urls;
};

/**
 * Removes empty options from object
 *
 * @private
 * @param obj
 */
export const removeEmpty = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(k => !newObj[k] && typeof newObj[k] !== 'boolean' && delete newObj[k]);
  return newObj;
};

/**
 * Returns unique time
 */
let last;
export const uniqueTime = () => {
  const time = Date.now();
  last = time === last ? time + 1 : time;
  return last;
};

/**
 * Generates random string with provided length
 *
 * @param len
 */
export const uniqueId = (len: number = 10): string => {
  return new Array(len).join().replace(/(.|$)/g, () => ((Math.random() * 36) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']());
};

/**
 * Check if input is a svg
 *
 * @param {Uint8Array | Buffer} file
 * @returns {string} - mimetype
 */
export const getMimetype = async(file: Uint8Array | Buffer, name?: string): Promise<string> => {
  let type;
  try {
     type = await fromBuffer(file);
  } catch(e) {
    console.warn("An exception occurred while processing the buffer:", e.message);
  }
  const excludedMimetypes = ['text/plain', 'application/octet-stream', 'application/x-ms', 'application/x-msi', 'application/zip'];

  const isPNG = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  if (isPNG(file)) {
    console.log("is PNG");
    return 'image/png';
  }
  console.log("name: ",name);
  if (type && excludedMimetypes.indexOf(type.mime) === -1) {
    return type.mime;
  }

  if (name && name.indexOf('.') > -1) {
    const mime = extensionToMime(name);

    if (mime) {
      return mime;
    }
  }

  try {
    if (isutf8(file)) {
      return 'text/plain';
    }
  } catch (e) {
    /* istanbul ignore next */
    console.warn('Additional mimetype checks (text/plain) are currently not supported for browsers');
  }
  // this is only fallback, omit it in coverage
  /* istanbul ignore next */

  // if we cant find types by extensions and we have magic bytes fallback to it
  if (type) {
    return type.mime;
  }

  return 'application/octet-stream';

};

function check(signature) {
  return (buffer) => signature.every((byte, i) => byte === buffer[i]);
}

/**
 * Change extension to according mimetype using ext=>mimetype map
 *
 * @param ext - string
 * @return string|boolean
 */
export const extensionToMime = (ext: string) => {
  console.log("getting mimetype: ",ext);
  if (!ext || ext.length === 0) {
    return;
  }

  if (ext.split('/').length === 2) {
    return ext;
  }

  if (ext.indexOf('.') > -1) {
    ext = ext.split('.').pop();
  }

  ext = ext.toLocaleLowerCase();

  const keys = Object.keys(ExtensionsMap);
  const mapLen = keys.length;

  for (let i = 0; i < mapLen; i++) {
    if (ExtensionsMap[keys[i]].indexOf(ext) > -1) {
      return keys[i];
    }
  }

  return;
};

/**
 * Sanitizer Options
 */
export type SanitizeOptions =
  | boolean
  | {
    exclude?: string[];
    replacement?: string;
  };

/**
 * Sanitize file name
 *
 * @param name
 * @param {bool} options  - enable,disable sanitizer, default enabled
 * @param {string} options.replacement - replacement for sanitized chars defaults to "-"
 * @param {string[]} options.exclude - array with excluded chars default - `['\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']`
 */
export const sanitizeName = (name: string, options: SanitizeOptions = true): string => {
  if (typeof options === 'boolean' && !options) {
    return name;
  }

  let ext;

  const replacement = typeof options !== 'boolean' && options.replacement ? options.replacement : '-';
  const exclude = typeof options !== 'boolean' && options.exclude ? options.exclude : ['\\', '{', '}', '|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>'];

  if (!name || name.length === 0) {
    return 'undefined';
  }

  const fileParts = name.split('.');

  if (fileParts.length > 1) {
    ext = fileParts.pop();
  }

  return `${fileParts
    .join('.')
    .split('')
    .map(char => (exclude.indexOf(char) > -1 ? replacement : char))
    .join('')}${ext ? '.' + ext : ''}`;
};

/**
 * Filter object to given fields
 *
 * @param toFilter
 * @param requiredFields
 */
export const filterObject = (toFilter, requiredFields: string[]) => {
  if (!requiredFields || requiredFields.length === 0) {
    return toFilter;
  }

  if (Object.keys(toFilter).length === 0) {
    return toFilter;
  }

  return Object.keys(toFilter)
    .filter(f => requiredFields.indexOf(f) > -1)
    .reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {});
};

/**
 * Deep cleanup object from functions
 *
 * @param obj
 */
export const cleanUpCallbacks = (obj: any) => {
  if (!obj || Object.keys(obj).length === 0) {
    return obj;
  }

  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'function') {
      obj[k] = undefined;
    }

    if (obj[k] === Object(obj[k])) {
      obj[k] = cleanUpCallbacks(obj[k]);
    }
  });

  return obj;
};

export * from './index.node';
