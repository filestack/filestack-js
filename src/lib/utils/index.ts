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
import { Map } from './extensions';
import * as SparkMD5 from 'spark-md5';
import fileType from 'file-type';
import * as isutf8 from 'isutf8';

const mobileRegexp = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;

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
 * Check if application is runned in facebook browser
 */
export const isFacebook = () => !isNode() && navigator && navigator.userAgent && /\[FB.*;/i.test(navigator.userAgent);

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
    return require('crypto')
      .createHash('md5')
      .update(data)
      .digest('base64');
  }

  /* istanbul ignore next */
  return btoa(SparkMD5.ArrayBuffer.hash(data, true));
};

/**
 * Check if input is a svg
 *
 * @param {Uint8Array | Buffer} file
 * @returns {string} - mimetype
 */
export const getMimetype = (file: Uint8Array | Buffer, name?: string): string => {
  let type = fileType(file);

  // check x-ms and x-msi by extension
  if (type && (type.mime !== 'application/x-ms' && type.mime !== 'application/x-msi')) {
    return type.mime;
  }

  if (name && name.indexOf('.') > -1) {
    const ext = name.split('.').pop();
    const keys = Object.keys(Map);
    const mapLen = keys.length;

    for (let i = 0; i < mapLen; i++) {
      if (Map[keys[i]].indexOf(ext) > -1) {
        return keys[i];
      }
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
  return 'application/octet-stream';
};

/**
 * return based string
 * @param data
 */
export const b64 = (data: string, safeUrl: boolean = false): string => {
  let b64;

  if (isNode()) {
    b64 = Buffer.from(data).toString('base64');
  } else {
    b64 = btoa(data);
  }

  if (safeUrl) {
    return b64.replace(/\//g, '_').replace(/\+/g, '-');
  }

  return b64;
};

/**
 * Return currently used filestack-js sdk version
 */
export const getVersion = () => {
  if (isNode()) {
    const rootArr = __dirname.split('/');
    const fsIndex = rootArr.findIndex((e) => e === 'filestack-js');
    const rootDir = rootArr.splice(0, fsIndex + 1).join('/');

    return `JS-${require(`${rootDir}/package.json`).version}`;
  }

  return 'JS-@{VERSION}';
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
 * @param {string[]} options.exclude - array with excluded chars default - ['\', '{', '}','|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']
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
    .join('_')
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

  return Object.keys(toFilter)
    .filter(f => requiredFields.indexOf(f) > -1)
    .reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {});
};
