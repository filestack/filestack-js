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

import * as utils from '../utils';
import { parse, normalizeHeaders, set, normalizeName } from './headers';

describe('Request/Helpers/Headers', () => {
  beforeAll(() => {
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  describe('parse headers', () => {
    it('should return object', () => {
      expect(parse(null)).toEqual({});
    });

    it('should return object', () => {
      const headers = ':';
      expect(parse(headers)).toEqual({});
    });

    it('should return object', () => {
      const headers = 'from:filestack.com\nfrom:filestack.com';
      expect(parse(headers)).toEqual({ from: 'filestack.com' });
    });

    it('should return object', () => {
      const headers = 'set-cookie:false';
      expect(parse(headers)).toEqual({ 'set-cookie': ['false'] });
    });
  });

  describe('normalize headers', () => {
    it('should return object', () => {
      // @ts-ignore
      expect(normalizeHeaders()).toEqual({});
    });

    it('should return object', () => {
      const data = { ['set-cookies']: 'false' };
      expect(normalizeHeaders(data)).toEqual({ 'Set-Cookies': 'false' });
    });
  });

  describe('cookies', () => {
    it('should return object', () => {
      const data = { ['set-cookies']: 'false' };
      expect(set(data, 'set-cookies', 'value', true)).toEqual({ 'Set-Cookies': 'value', 'set-cookies': 'false' });
    });

    it('should return object', () => {
      // @ts-ignore
      expect(set('', 'name', 'value', true)).toEqual({ Name: 'value' });
    });

    it('should return object', () => {
      const data = { 'www-authenticate': '' };
      expect(set(data, 'name', 'value', true)).toEqual({ Name: 'value', 'www-authenticate': '' });
    });
  });

  describe('normalize name', () => {
    it('should return string', () => {
      expect(normalizeName('www-authenticate')).toEqual('WWW-Authenticate');
    });

    it('should return string', () => {
      expect(normalizeName('content-type')).toBe('Content-Type');
    });
  });
});
