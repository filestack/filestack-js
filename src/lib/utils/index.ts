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
import * as SparkMD5 from 'spark-md5';
import fileType from 'file-type';
import * as isutf8 from 'isutf8';

const mobileRegexp = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
const htmlCommentsRegexp = /<!--([\s\S]*?)-->/g;
const svgRegexp = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?<svg[^>]*>[^]*<\/svg>\s*$/i;

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
 * Returns information about current env (browser|nodejs)
 */
export const isNode = () => typeof process !== 'undefined' && process.versions && process.versions.node;

/**
 * Returns if browser is a mobile device (if node env always return false)
 */
/* istanbul ignore next */
export const isMobile = () => !isNode() && navigator && navigator.userAgent && mobileRegexp.test(navigator.userAgent);

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
 * Calculates a MD5 checksum for passed buffer
 * @private
 * @param data  Data to be hashed
 * @returns     base64 encoded MD5 hash
 */
export const md5 = (data: any): string => {
  if (isNode()) {
    return (requireNode('crypto')).createHash('md5').update(data).digest('base64');
  }

  /* istanbul ignore next */
  return btoa(SparkMD5.ArrayBuffer.hash(data, true));
};

/**
 * Check if input is a svg
 *
 * @param input
 */
const isSvg = (input: Uint8Array | Buffer) => input && svgRegexp.test(String.fromCharCode.apply(null, input).replace(htmlCommentsRegexp, ''));

/**
 * Check if input is a svg
 *
 * @param {Uint8Array | Buffer} file
 * @returns {string} - mimetype
 */
export const getMimetype = (file: Uint8Array | Buffer): string => {
  let type = fileType(file);
  if (type) {
    return type.mime;
  }

  try {

    if (isSvg(file)) {
      return 'image/svg+xml';
    }

    if (isutf8(file)) {
      return 'text/plain';
    }
  } catch (e) {
    console.warn('Additional mimetype checks (text/plain) are currently not supported for browsers');
  }

  return 'application/octet-stream';
};

/**
 * return based string
 * @param data
 */
export const b64 = (data: string): string => {
  if (isNode()) {
    return Buffer.from(data).toString('base64');
  }

  return btoa(data);
};

/**
 * Hides require from buindling by weback to browser
 *
 * @param {string} name
 */
export const requireNode = (name: string): any => {
  if (!isNode()) {
    return false;
  }

  return require && require(name);
};

/**
 * Sanitizer Options
 */
export type SanitizeOptions = (boolean | {
  exclude?: string[],
  replacement?: string,
});

/**
 * Sanitize file name
 *
 * @param name
 * @param {bool} options  - enable,disable sanitizer, default enabled
 * @param {string} options.replacement - replacement for sanitized chars defaults to "-"
 * @param {string[]} options.exclude - array with excluded chars default - ['\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']
 */
export const sanitizeName = (name: string, options: SanitizeOptions = true): string  => {
  if (typeof options === 'boolean' && !options) {
    return name;
  }

  let ext;

  const replacement = typeof options !== 'boolean' && options.replacement ? options.replacement :  '-';
  const exclude = typeof options !== 'boolean' && options.exclude ? options.exclude : ['\\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>'];

  if (!name || name.length === 0) {
    return 'undefined';
  }

  const fileParts = name.split('.');

  if (fileParts.length > 1) {
    ext = fileParts.pop();
  }

  return `${fileParts.join('_').split('').map((char) => exclude.indexOf(char) > -1 ? replacement : char).join('')}${ext ? '.' + ext : ''}`;
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

  return Object.keys(toFilter).filter(f => requiredFields.indexOf(f) > -1).reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {});
};

/**
 * Flatten object to python dump format
 *
 * @param obj
 */
export const flattenObject = (obj: Object): Object => {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj) && !obj.length) {
    return undefined;
  }

  if (obj && obj.constructor && obj.constructor === Object && !Object.keys(obj)) {
    return undefined;
  }

  let toReturn = {};

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) {
      continue;
    }

    if (obj[i] && typeof obj[i] === 'object' && obj[i].constructor === Object) {
      const flatObject = flattenObject(obj[i]);

      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue;
        }

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else if (Array.isArray(obj[i])) {
      obj[i].forEach((el, idx) => {
        toReturn[i + '.' + idx] = flattenObject(el);
      });
    } else {
      toReturn[i] = obj[i];
    }
  }
  return toReturn;
};
