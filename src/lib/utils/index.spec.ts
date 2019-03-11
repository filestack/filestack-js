/*
 * Copyright (c) 2019 by Filestack.
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
import { resolveCdnUrl, resolveHost, checkOptions, removeEmpty, throttle, range } from './index';
import * as t from 'tcomb-validation';

describe('utils:index', () => {
  describe('resolveCdnUrl', () => {
    const session = {
      apikey: 'DevZpGbhtSzZL5bOtYw7Lz',
      cname: 'fs.enplug.com',
      urls: {
        cdnUrl: 'https://cdn.fs.enplug.com',
        cloudApiUrl: 'https://cloud.fs.enplug.com',
        fileApiUrl: 'https://www.fs.enplug.com/api/file',
        pickerUrl: 'https://static.fs.enplug.com/picker/1.4.4/picker.js',
        uploadApiUrl: 'https://upload.fs.enplug.com',
      },
    };
    it('should properly resolve cdn url with hashed handle', () => {
      const handle = '5aYkEQJSQCmYShsoCnZN';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.fs.enplug.com');
    });
    it('should properly resolve cdn url with src handle', () => {
      const handle = 'src://test123/flug_8-trans_atlantik-300dpi.jpg';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.fs.enplug.com/DevZpGbhtSzZL5bOtYw7Lz');
    });
    it('should properly resolve cdn url with hashed handle', () => {
      const handle = 'https://static1.squarespace.com/static/544eb3cce4b0ef091773611f/t/59ba7ce1bd10f00dcdc80a5f/1505394087367/DSC_0527.jpg';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.fs.enplug.com/DevZpGbhtSzZL5bOtYw7Lz');
    });
    it('shoudl throw error when using src handle or url without apikey', () => {
      const handle = 'src://test123/flug_8-trans_atlantik-300dpi.jpg';
      session.apikey = '';
      expect(() => { resolveCdnUrl(session, handle); }).toThrow('Api key is required when storage alias is provided');
    });
  });
  describe('resolveHost', () => {
    const hosts = {
      cdnUrl: 'filestackcontent.com',
      cloudApiUrl: 'https://cloud.fs.enplug.com',
      fileApiUrl: 'https://www.fs.enplug.com/api/file',
      pickerUrl: 'https://static.fs.enplug.com/picker/1.4.4/picker.js',
      uploadApiUrl: 'https://upload.fs.enplug.com',
    };
    it('should return proper host', () => {
      const cname = 'fs.enplug.com';
      const result = resolveHost(hosts, cname);
      expect(result).toEqual(hosts);
    });
    it('should return hosts when cname is an empty string', () => {
      const cname = '';
      const result = resolveHost(hosts, cname);
      expect(result).toEqual(hosts);
    });
  });
  describe('checkOptions', () => {
    const name = 'metadata';
    const allowed = [{ name: 'size', type: t.Boolean }, { name: 'location', type: t.String }, { name: 'filename', type: t.Boolean }];
    it('should not throwe error if options are valid', () => {
      const options = { size: true };
      const result = checkOptions(name, allowed, options);
      expect(result).toEqual(Object.keys(options));
    });
    it('should throw error when option is not allowed', () => {
      const options = { wrongOption: true };
      expect(() => { checkOptions(name, allowed, options); }).toThrow('wrongOption is not a valid option for metadata. Valid options are: size, location, filename');
    });
    it('should throw error when option is allowed, but it has a wrong type', () => {
      const options = { size: 'It is a string!' };
      expect(() => { checkOptions(name, allowed, options); }).toThrow('Invalid value \"It is a string!\" supplied to Boolean');
    });
  });
  describe('removeEmpty', () => {
    it('should remove empty options from an object', () => {
      const newObject = { test1: true, test2: undefined, test3: false };
      const result = removeEmpty(newObject);
      expect(result).toEqual({ test1: true, test3: false });
    });
  });
  describe('throttle', () => {
    const testFunc = jest.fn();
    const delay = 2000;
    jest.useFakeTimers();
    it('should invoke a function after a specific delay', () => {
      const throttleCb = throttle(testFunc, delay);
      throttleCb();
      expect(testFunc).not.toBeCalled();
      jest.advanceTimersByTime(2000);
      expect(testFunc).toBeCalled();
      expect(testFunc).toHaveBeenCalledTimes(1);
    });
    it('should invoke a function at start although a specific delay is setted', () => {
      const throttleCb = throttle(testFunc, delay, true);
      throttleCb();
      expect(testFunc).toBeCalled();
      expect(testFunc).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(2000);
      expect(testFunc).toHaveBeenCalledTimes(1);
    });
  });
  describe('range', () => {
    it('should be able to create array recognizing proived step param', () => {
      const start = 5;
      const stop = 23;
      const step = 4;
      const result = range(start, stop, step);
      const expected = [5, 9, 13, 17, 21];
      expect(result).toEqual(expected);
    });
    it('should be able to create a proper array without provided step param', () => {
      const start = 5;
      const stop = 9;
      const result = range(start, stop);
      const expected = [5, 6, 7, 8];
      expect(result).toEqual(expected);
    });
  });
});
