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
import * as utils from './index';

describe('utils:index', () => {
  beforeAll(() => {
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  describe('getVersion', () => {
    it('should return version string to replace', () => {
      expect(utils.getVersion()).toEqual(`JS-@{VERSION}`);
    });
  });

  describe('md5', () => {
    it('should return correct md5 value', () => {
      expect(utils.md5(Buffer.from('test'))).toEqual('CY9rzUYh03PK3k6DJie09g==');
    });
  });

  describe('b64', () => {
    it('should return correct b65 value', () => {
      expect(utils.b64('testtext')).toEqual('dGVzdHRleHQ=');
    });
  });

  describe('requireNode', () => {
    it('should require node package', () => {
      expect(utils.requireNode('crypto')).toBeFalsy();
    });
  });
});
