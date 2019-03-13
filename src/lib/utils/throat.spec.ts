/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Original implementation of throat by Forbes Lindesay
 * https://github.com/ForbesLindesay/throat
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

import throat from './throat';

describe('utils:throat', () => {
  describe('throat', () => {
    it('should run function concurrently with proper throat factor', () => {
      const mockAsyncFunc = jest.fn((fileName) => {
        return new Promise((resolve) => {
          resolve(fileName);
        });
      });
      const input = ['fileA.txt', 'fileB.txt', 'fileC.txt', 'fileD.txt'];
      let result = [];
      Promise.all(input.map(throat(2, fileName => mockAsyncFunc(fileName)))).then((fileNames) => {
        result = fileNames;
      }).catch(e => {
        console.log(e);
      });
      expect(mockAsyncFunc).toHaveBeenCalledTimes(2);
    });
    it('should throw error second argument is not a function', () => {
      const notFunction = 'string';
      expect(() => { throat(2, notFunction); }).toThrow('Expected throat fn to be a function but got string');
    });
  });
});
