/*
 * Copyright (c) 2018 by Filestack
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

import { combineURL } from './url';

describe('Request/Helpers/Url', () => {
  describe('combineURL', () => {
    it('should return url', () => {
      const url = 'https://filestack.com';
      // @ts-ignore
      expect(combineURL(url)).toBe(url);
    });

    it('should return url with id=1', () => {
      const url = 'https://filestack.com';
      const params = { id: 1 };
      expect(combineURL(url, params)).toEqual(`${url}?id=1`);
    });

    it('should return url with id=1', () => {
      const url = 'https://filestack.com';
      const params = { id: '1' };
      expect(combineURL(url + '#', params)).toBe(`${url}?id=1`);
    });
  });
});
