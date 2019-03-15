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

import { getName } from './utils';

describe('api:upload:utils', () => {
  describe('getName', () => {
    it('should firstly return customName from a config', () => {
      const file = {
        name: 'testFile',
        size: 4567,
      };
      const config = {
        customName: 'newName'
      };
      const result = getName(file, config);
      expect(result).toBe('newName');
    });
    it('should return file name if customName does not exists', () => {
      const file = {
        name: 'testFile',
        size: 4567,
      };
      const config = {};
      const result = getName(file, config);
      expect(result).toBe('testFile');
    });
  });
});
