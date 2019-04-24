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

import * as t from 'tcomb-validation';
import { Session } from '../client';
import { Hosts } from './../../config';
import * as SparkMD5 from 'spark-md5';

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

export const resolveHost = (urls: Hosts, cname: string): Hosts => {
  if (cname) {
    const hosts = /filestackapi.com|filestackcontent.com/i;

    Object.keys(urls).forEach(key => {
      urls[key] = urls[key].replace(hosts, cname);
    });
  }

  return urls;
};

/**
 * Check config options
 *
 * @private
 * @param name
 * @param allowed
 * @param options
 */
export const checkOptions = (name: string, allowed: any, options: any = {}): {} => {
  const keys = Object.keys(options);
  const allowedNames = allowed.map((a: any) => a.name);
  const namesFormatted = allowedNames.join(', ');
  keys.forEach(key => {
    if (allowedNames.indexOf(key) < 0) {
      throw new Error(`${key} is not a valid option for ${name}. Valid options are: ${namesFormatted}`);
    }
  });
  allowed.forEach((obj: any) => {
    let value = options[obj.name];
    // Should we transform a location value if we return only keys?
    if (obj.name === 'location' && typeof value === 'string') {
      value = value.toLowerCase();
    }
    if (value !== undefined) {
      const result = t.validate(value, obj.type);
      if (!result.isValid()) {
        const error = result.firstError();
        if (error && error.message) {
          throw new Error(error.message);
        }
      }
    }
  });
  return keys;
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
export const md5 = (data: any) => {
  if ((isNode())) {
    return (require('crypto')).createHash('md5').update(data).digest('base64');
  }

  /* istanbul ignore next */
  return btoa(SparkMD5.ArrayBuffer.hash(data, true));
};

/**
 * Sanitize file name
 *
 * @param name
 */
export const sanitizeName = (name: string, ext: string = ''): string  => {
  if (!name || name.length === 0) {
    return 'undefined';
  }

  const fileParts = name.split('.');

  if (fileParts.length > 1) {
    ext = fileParts.pop();
  }

  return `${fileParts.join('_').replace(/\s+/gi, '_').replace(/[^a-zA-Z0-9\-\_]/gi, '_')}${ext ? `.${ext}` : '' }`;
};

/**
 * Filter object to given fields
 *
 * @param toFilter
 * @param requiredFields
 */
export const filterObject = (toFilter: Object, requiredFields): Object => {
  if (!requiredFields || requiredFields.length === 0) {
    return toFilter;
  }

  return Object.keys(toFilter).filter(f => requiredFields.indexOf(f) > -1).reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {});
};
