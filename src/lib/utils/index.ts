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

import throatImpl from './throat';
import * as t from 'tcomb-validation';
import { Session } from '../client';
import { Hosts } from './../../config';

export const throat = throatImpl;

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

export const resolveHost = (hosts: Hosts, cname: string): Hosts => {
  let result = hosts;

  if (cname) {
    const hosts = /filestackapi.com|filestackcontent.com/i;

    Object.keys(hosts).forEach((key) => {
      result[key] = hosts[key].replace(hosts, cname);
    });
  }

  return result;
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
  keys.forEach((key) => {
    if (allowedNames.indexOf(key) < 0) {
      throw new Error(`${key} is not a valid option for ${name}. Valid options are: ${namesFormatted}`);
    }
  });
  allowed.forEach((obj: any) => {
    let value = options[obj.name];
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
  Object.keys(newObj).forEach(k => (!newObj[k] && typeof newObj[k] !== 'boolean') && delete newObj[k]);
  return newObj;
};

/**
 *
 * @private
 * @param fn
 * @param interval
 * @param callFirst
 */
export const throttle = function throttle(fn: any, interval: number, callFirst?: boolean) {
  let wait = false;
  let callNow = false;
  /* istanbul ignore next */
  return function (this: any, ...args: any[]) {
    callNow = !!callFirst && !wait;
    const context = this;
    if (!wait) {
      wait = true;
      setTimeout(function () {
        wait = false;
        if (!callFirst) {
          return fn.apply(context, args);
        }
      }, interval);
    }
    if (callNow) {
      callNow = false;
      return fn.apply(this, arguments);
    }
  };
};

/**
 *
 * @private
 * @param start
 * @param stop
 * @param step
 */
export const range = (start: number, stop: number, step: number = 1) => {
  const toReturn: any[] = [];
  for (; start < stop; start += step) {
    toReturn.push(start);
  }
  return toReturn;
};
