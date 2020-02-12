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

const printLog = (status: boolean | string, name: string, value: string): string => `${name} should return ${status} when value is ${value}`;

describe('Request/Utils', () => {
  describe('isBuffer', () => {
    // @ts-ignore
    it(printLog(false, 'isBuffer', '{}'), () => expect(utils.isBuffer()).toBeFalsy());
  });

  describe('isArrayBuffer', () => {
    it(printLog(true, 'isArrayBuffer', 'new ArrayBuffer(10)'), () => {
      expect(utils.isArrayBuffer(Buffer.alloc(10))).toBeFalsy();
    });
    it(printLog(true, 'isArrayBuffer', ''), () => {
      // @ts-ignore
      expect(utils.isArrayBuffer()).toBeFalsy();
    });
  });

  describe('isFile', () => {
    const file: File = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    it(printLog(true, 'isFile', 'new File()'), () => expect(utils.isFile(file)).toBeTruthy());
  });

  describe('isBlob', () => {
    const parts = ['<a id="id"></a>'];
    const blob: Blob = new Blob(parts, { type: 'text/html' });
    it(printLog(true, 'isBlob', 'new Blob()'), () => expect(utils.isBlob(blob)).toBeTruthy());
  });

  describe('isFormData', () => {
    const formData: FormData = new FormData();
    formData.append('name', 'value');
    it(printLog(true, 'isFormData', "'value'"), () => expect(utils.isFormData(formData)).toBeTruthy());
  });
});
