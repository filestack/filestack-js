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
import { resolveCdnUrl, resolveHost, removeEmpty, uniqueTime, uniqueId, md5, sanitizeName, filterObject, b64, getVersion, cleanUpCallbacks } from './index';
import { config } from '../../config';
const v = require('../../../../package.json').version;

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
      expect(md5(Buffer.from('test'))).toEqual('CY9rzUYh03PK3k6DJie09g==');
    });
  });

  describe('getVersion', () => {
    it('should return correct version from package json', () => {
      expect(getVersion()).toEqual(`JS-${v}`);
    });
  });

  describe('b64', () => {
    it('should return correct b65 value', () => {
      expect(b64('testtext')).toEqual('dGVzdHRleHQ=');
    });

    it('should escape chars to make b64 url safe string - char "/"', () => {
      expect(b64('*0eijATh#"I$PR)s<uTa}{t>E"LC:L', true)).toEqual('KjBlaWpBVGgjIkkkUFIpczx1VGF9e3Q-RSJMQzpM');
    });

    it('should escape chars to make b64 url safe string - char ""', () => {
      expect(b64('W{wpB@ckYD0O@&?!||9PS)7^+F*H8N', true)).toEqual('V3t3cEJAY2tZRDBPQCY_IXx8OVBTKTdeK0YqSDhO');
    });
  });

  describe('sanitizeName', () => {
    it('should sanitize file name with extension', () => {
      expect(sanitizeName('a\\{%`"~[]#|^<>1.jpg')).toEqual('a-------------1.jpg');
    });

    it('should sanitize file name without extension', () => {
      expect(sanitizeName('123qwe')).toEqual('123qwe');
    });

    it('should return undefined on empty string', () => {
      expect(sanitizeName('')).toEqual('undefined');
    });

    it('should respect sanitize options as boolean', () => {
      expect(sanitizeName('[]#|.jpg', false)).toEqual('[]#|.jpg');
    });

    it('should not change dots in filename', () => {
      expect(sanitizeName('[]#some.tar.gz', false)).toEqual('[]#some.tar.gz');
    });

    it('should respect sanitize options with provided options', () => {
      expect(sanitizeName('[]#|.jpg', {
        exclude: ['[', ']'],
        replacement: '_',
      })).toEqual('__#|.jpg');
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

    it('should not throw on empty filtered object', () => {
      expect(filterObject({}, ['test'])).toEqual({});
    });
  });

  describe('CleanupCallbacks', () => {
    it('should set callbacks as undefined and return untouched object', () => {
      const testObj = {
        fn: () => 1,
        test: {
          fn2: () => 2,
        },
        testN: 123,
        tests: 'string',
        testObj: {
          tst: 123,
        },
      };

      expect(cleanUpCallbacks(testObj)).toEqual({
        test: {},
        testN: 123,
        tests: 'string',
        testObj: {
          tst: 123,
        },
      });
    });
  });
});
