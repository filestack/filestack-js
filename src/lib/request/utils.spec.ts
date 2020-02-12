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

import * as utils from './utils';
import { Readable } from 'stream';

const printLog = (status: boolean | string, name: string, value: string): string => `${name} should return ${status} when value is ${value}`;

describe('Request/Utils', () => {
  describe('isArray', () => {
    it(printLog(true, 'isArray', "['value']"), () => expect(utils.isArray(['value'])).toBeTruthy());

    it(printLog(true, 'isArray', '[]'), () => expect(utils.isArray([])).toBeTruthy());

    // @ts-ignore
    it(printLog(true, 'isArray', ''), () => expect(utils.isArray()).toBeFalsy());

    // @ts-ignore
    it(printLog(true, 'isArray', null), () => expect(utils.isArray(null)).toBeFalsy());
  });

  describe('isArrayBuffer', () => {
    it(printLog(true, 'isArrayBuffer', 'new ArrayBuffer(10)'), () => {
      expect(utils.isArrayBuffer(new ArrayBuffer(10))).toBeTruthy();
    });
    it(printLog(true, 'isArrayBuffer', ''), () => {
      // @ts-ignore
      expect(utils.isArrayBuffer()).toBeFalsy();
    });
  });

  // isBuffer
  describe('isBuffer', () => {
    it(printLog(true, 'isBuffer', ''), () => {
      // @ts-ignore
      expect(utils.isBuffer(null)).toBeFalsy();
    });
    it(printLog(true, 'isBuffer', ''), () => {
      // @ts-ignore
      expect(utils.isBuffer(Buffer.alloc(10))).toBeTruthy();
    });
  });

  describe('isArrayBufferView', () => {
    it(printLog(true, 'isArrayBufferView', 'new DataView(new ArrayBuffer(10))'), () => {
      expect(utils.isArrayBufferView(new DataView(new ArrayBuffer(10)))).toBeTruthy();
    });

    it(printLog(true, 'isArrayBufferView', null), () => {
      // @ts-ignore
      expect(utils.isArrayBufferView(null)).toBeFalsy();
    });

    it(printLog(true, 'isArrayBufferView', null), () => {
      // @ts-ignore
      expect(utils.isArrayBufferView(Buffer.alloc(10))).toBeTruthy();
    });
  });

  describe('isObject', () => {
    it(printLog(true, 'isObject', "{prop: 'value'}"), () => expect(utils.isObject({ prop: 'value' })).toBeTruthy());

    it(printLog(false, 'isObject', "'value'"), () => expect(utils.isObject('value')).toBeFalsy());

    it(printLog(false, 'isObject', '10'), () => expect(utils.isObject(10)).toBeFalsy());
  });

  describe('isString', () => {
    it(printLog(true, 'isString', "'value'"), () => expect(utils.isString('value')).toBeTruthy());

    it(printLog(false, 'isString', '10'), () => expect(utils.isString(10)).toBeFalsy());

    it(printLog(false, 'isString', '{}'), () => expect(utils.isString({})).toBeFalsy());

    it(printLog(false, 'isString', '[]'), () => expect(utils.isString([])).toBeFalsy());

    it(printLog(false, 'isString', 'false'), () => expect(utils.isString(false)).toBeFalsy());
  });

  describe('isFile', () => {
    it(printLog(false, 'isFile', null), () => expect(utils.isFile(null)).toBeFalsy());
  });

  describe('isBlob', () => {
    it(printLog(false, 'isBlob', null), () => expect(utils.isBlob(null)).toBeFalsy());
  });

  describe('isStream', () => {
    it(printLog(true, 'isStream', 'Stream.Readable()'), () => {
      const stream = new Readable();
      stream._read = () => '';
      stream.push('beep');
      expect(utils.isStream(stream)).toBeTruthy();
    });

    it(printLog(true, 'isStream', "'value'"), () => expect(utils.isStream('value')).toBeFalsy());

    it(printLog(true, 'isStream', '10'), () => expect(utils.isStream(10)).toBeFalsy());

    it(printLog(true, 'isStream', '[]'), () => expect(utils.isStream([])).toBeFalsy());
  });

  describe('isURLSearchParams', () => {
    it(printLog(true, 'isURLSearchParams', "new URLSearchParams('q=filename=&size=12')"), () => {
      expect(utils.isURLSearchParams(new URLSearchParams('q=filename=&size=12'))).toBeTruthy();
    });

    it(printLog(true, 'isURLSearchParams', "new URLSearchParams('')"), () => {
      expect(utils.isURLSearchParams(new URLSearchParams(''))).toBeTruthy();
    });
  });

  describe('isFormData', () => {
    it(printLog(true, 'isFormData', "'value'"), () => expect(utils.isFormData('value')).toBeFalsy());

    it(printLog(true, 'isFormData', '10'), () => expect(utils.isFormData({})).toBeFalsy());

    it(printLog(true, 'isFormData', '[]'), () => expect(utils.isFormData([])).toBeFalsy());

    it(printLog(true, 'isFormData', '{}'), () => expect(utils.isFormData({})).toBeFalsy());
  });

  describe('trim', () => {
    it(printLog("'value' without whitespace", 'trim', "' value'"), () => expect(utils.trim(' value')).toEqual('value'));

    it(printLog("'value' without whitespace ", 'trim', "' value '"), () => expect(utils.trim(' value ')).toEqual('value'));
  });
});
