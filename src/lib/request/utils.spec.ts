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

import { isArray, isArrayBuffer, isBuffer, isArrayBufferView, isObject, isString, isFile, isBlob, isStream, isURLSearchParams, isFormData, trim, isNode } from './utils';
import { Readable } from 'stream';

const printLog = (status: boolean | string, name: string, value: string): string => `${name} should return ${status} when value is ${value}`;

describe('Request/Utils', () => {
  describe('isArray', () => {
    it(printLog(true, 'isArray', "['value']"), () => expect(isArray(['value'])).toBeTruthy());

    it(printLog(true, 'isArray', '[]'), () => expect(isArray([])).toBeTruthy());

    // @ts-ignore
    it(printLog(true, 'isArray', ''), () => expect(isArray()).toBeFalsy());

    // @ts-ignore
    it(printLog(true, 'isArray', null), () => expect(isArray(null)).toBeFalsy());
  });

  describe('isArrayBuffer', () => {
    it(printLog(true, 'isArrayBuffer', 'new ArrayBuffer(10)'), () => {
      expect(isArrayBuffer(new ArrayBuffer(10))).toBeTruthy();
    });
    it(printLog(true, 'isArrayBuffer', ''), () => {
      // @ts-ignore
      expect(isArrayBuffer()).toBeFalsy();
    });
  });

  // isBuffer
  describe('isBuffer', () => {
    it(printLog(true, 'isBuffer', ''), () => {
      // @ts-ignore
      expect(isBuffer(null)).toBeFalsy();
    });
    it(printLog(true, 'isBuffer', ''), () => {
      // @ts-ignore
      expect(isBuffer(Buffer.alloc(10))).toBeTruthy();
    });
  });

  describe('isArrayBufferView', () => {
    it(printLog(true, 'isArrayBufferView', 'new DataView(new ArrayBuffer(10))'), () => {
      expect(isArrayBufferView(new DataView(new ArrayBuffer(10)))).toBeTruthy();
    });

    it(printLog(true, 'isArrayBufferView', null), () => {
      // @ts-ignore
      expect(isArrayBufferView(null)).toBeFalsy();
    });

    it(printLog(true, 'isArrayBufferView', null), () => {
      // @ts-ignore
      expect(isArrayBufferView(Buffer.alloc(10))).toBeTruthy();
    });
  });

  describe('isObject', () => {
    it(printLog(true, 'isObject', "{prop: 'value'}"), () => expect(isObject({ prop: 'value' })).toBeTruthy());

    it(printLog(false, 'isObject', "'value'"), () => expect(isObject('value')).toBeFalsy());

    it(printLog(false, 'isObject', '10'), () => expect(isObject(10)).toBeFalsy());
  });

  describe('isString', () => {
    it(printLog(true, 'isString', "'value'"), () => expect(isString('value')).toBeTruthy());

    it(printLog(false, 'isString', '10'), () => expect(isString(10)).toBeFalsy());

    it(printLog(false, 'isString', '{}'), () => expect(isString({})).toBeFalsy());

    it(printLog(false, 'isString', '[]'), () => expect(isString([])).toBeFalsy());

    it(printLog(false, 'isString', 'false'), () => expect(isString(false)).toBeFalsy());
  });

  // @fixme: to browser ==>

  // @todo @fixme
  describe('isFile', () => {
    it(printLog(false, 'isFile', null), () => expect(isFile(null)).toBeFalsy());
  });

  // @todo @fixme
  describe('isBlob', () => {
    it(printLog(false, 'isBlob', null), () => expect(isBlob(null)).toBeFalsy());

    // const blob = new Blob([JSON.stringify({ hello: 'word' }, null, 2)], { type: 'application/json' });
    // it(printLog(true, 'isBlob', 'new Blob()'), () => expect(isBlob(blob)).toBeTruthy());
  });

  describe('isStream', () => {
    it(printLog(true, 'isStream', 'Stream.Readable()'), () => {
      const stream = new Readable();
      spyOn(stream, '_read').and.returnValue(() => console.log(''));
      stream.push('beep');
      expect(isStream(stream)).toBeTruthy();
    });

    it(printLog(true, 'isStream', "'value'"), () => expect(isStream('value')).toBeFalsy());

    it(printLog(true, 'isStream', '10'), () => expect(isStream(10)).toBeFalsy());

    it(printLog(true, 'isStream', '[]'), () => expect(isStream([])).toBeFalsy());
  });

  describe('isURLSearchParams', () => {
    it(printLog(true, 'isURLSearchParams', "new URLSearchParams('q=filename=&size=12')"), () => {
      expect(isURLSearchParams(new URLSearchParams('q=filename=&size=12'))).toBeTruthy();
    });

    it(printLog(true, 'isURLSearchParams', "new URLSearchParams('')"), () => {
      expect(isURLSearchParams(new URLSearchParams(''))).toBeTruthy();
    });
  });

  describe('isFormData', () => {
    // it(printLog(true, 'isFormData', "'value'"), () => expect(isFormData(formData)).toBeTruthy());

    it(printLog(true, 'isFormData', "'value'"), () => expect(isFormData('value')).toBeFalsy());

    it(printLog(true, 'isFormData', '10'), () => expect(isFormData({})).toBeFalsy());

    it(printLog(true, 'isFormData', '[]'), () => expect(isFormData([])).toBeFalsy());

    it(printLog(true, 'isFormData', '{}'), () => expect(isFormData({})).toBeFalsy());
  });

  describe('trim', () => {
    it(printLog("'value' without whitespace", 'trim', "' value'"), () => expect(trim(' value')).toEqual('value'));

    it(printLog("'value' without whitespace ", 'trim', "' value '"), () => expect(trim(' value ')).toEqual('value'));
  });

  describe('isNode', () => {
    it(printLog(true, 'isNode', ''), () => {
      expect(isNode()).toBeTruthy();
    });

    // it(printLog(true, 'isNode', 'is node'), () => expect(isNode()).toBeFalsy());
  });
});
