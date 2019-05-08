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
import { resolveCdnUrl, resolveHost, checkOptions, removeEmpty, isMobile, uniqueTime, uniqueId, md5, sanitizeName, filterObject } from './index';
import * as t from 'tcomb-validation';
import { config } from '../../config';

describe('utils:index', () => {
  describe('resolveCdnUrl', () => {

    const session = {
      apikey: 'TEST_API_KEY',
      cname: 'example.com',
      urls: config.urls,
    };

    it('should properly resolve cdn url with hashed handle', () => {
      const handle = '5aYkEQJSQCmYShsoCnZN';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.filestackcontent.com');
    });

    it('should properly resolve cdn url with src handle', () => {
      const handle = 'src://test123/test.jpg';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.filestackcontent.com/TEST_API_KEY');
    });

    it('should properly resolve cdn url with hashed handle', () => {
      const handle = 'https://static1.squarespace.com/static/544eb3cce4b0ef091773611f/t/59ba7ce1bd10f00dcdc80a5f/1505394087367/DSC_0527.jpg';
      const result = resolveCdnUrl(session, handle);
      expect(result).toEqual('https://cdn.filestackcontent.com/TEST_API_KEY');
    });

    it('should throw an error when using src handle or url without apikey', () => {
      const handle = 'src://test123/test.jpg';
      session.apikey = '';
      expect(() => { resolveCdnUrl(session, handle); }).toThrow('Api key is required when storage alias is provided');
    });
  });

  describe('resolveHost', () => {
    const hosts = config.urls;

    const checkHosts = (hosts, expected) => {
      Object.keys(hosts).forEach((k) => {
        expect(hosts[k].indexOf(expected) > -1).toBeTruthy();
      });
    };

    it('should return proper host', () => {
      const cname = 'example.com';
      const result = resolveHost(hosts, cname);
      checkHosts(result, cname);
    });

    it('should return hosts when cname is an empty string', () => {
      const cname = '';
      const result = resolveHost(hosts, cname);
      checkHosts(result, cname);
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

    it('should throw an error when option is not allowed', () => {
      expect(() => { checkOptions(name, allowed, { wrongOption: true }); }).toThrow('wrongOption is not a valid option for metadata. Valid options are: size, location, filename');
    });

    it('should throw an error when option is allowed, but it has a wrong type', () => {
      expect(() => { checkOptions(name, allowed, { size: 'It is a string!' }); }).toThrow('Invalid value \"It is a string!\" supplied to Boolean');
    });
  });

  describe('removeEmpty', () => {
    it('should remove empty options from an object', () => {
      const testOb = { test1: true, test2: undefined, test3: false };
      expect(removeEmpty(testOb)).toEqual({ test1: true, test3: false });
    });
  });

  describe('uniqueTime', () => {
    it('should return unique times', () => {
      expect(uniqueTime()).not.toEqual(uniqueTime());
    });
  });

  describe('uniqueId', () => {
    it('should get different ids each time', () => {
      expect(uniqueId()).not.toEqual(uniqueId());
    });

    it('should return id with given length', () => {
      expect(uniqueId(12).length).toEqual(12);
      expect(uniqueId(4).length).toEqual(4);
    });
  });

  describe('md5', () => {
    it('should return correct md5 value', () => {
      expect(md5('test')).toEqual('CY9rzUYh03PK3k6DJie09g==');
    });
  });

  describe.only('sanitizeName', () => {
    it('should sanitize file name with extension', () => {
      expect(sanitizeName('!@#te"\'.jpg')).toEqual('!@#te__.jpg');
      expect(sanitizeName('!# test.jpg')).toEqual('!#_test.jpg');
      expect(sanitizeName('123qwe.png')).toEqual('123qwe.png');
    });

    it('should sanitize file name without extension', () => {
      expect(sanitizeName('123qwe')).toEqual('123qwe');
    });

    it('should return undefined on empty string', () => {
      expect(sanitizeName('')).toEqual('undefined');
    });
  });

  describe('filterObject', () => {
    it('should filter object', () => {
      expect(filterObject({
        test: 1,
        test2: 2,
        test3: 3,
      }, ['test', 'test2'])).toEqual({
        test: 1,
        test2: 2,
      });
    });

    it('should result the same object on empty requirements', () => {
      expect(filterObject({
        test: 1,
        test2: 2,
        test3: 3,
      }, [])).toEqual({
        test: 1,
        test2: 2,
        test3: 3,
      });
    });
  });
});
