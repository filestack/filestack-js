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

import { write, read, remove } from './cookies';

describe('Request/Helpers/Cookies', () => {
  describe('write', () => {
    it('should return array', () => {
      expect(write('name', 'value', 0, '/', 'filestack.com', true)).toEqual(undefined);
    });
  });

  describe('read', () => {
    it('should return null', () => {
      expect(read('name')).toEqual(null);
    });
    it('should not return value', () => {
      document.cookie = 'name=value';
      expect(read('name')).toEqual('value');
    });
  });

  describe('remove', () => {
    it('should return empty', () => {
      expect(remove('name')).toEqual(undefined);
    });
  });
});
