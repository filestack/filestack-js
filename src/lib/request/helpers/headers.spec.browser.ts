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

import { parse, normalizeHeaders, set, normalizeName } from './headers';

describe('Request/Helpers/Headers', () => {

  describe('parse headers', () => {
    it('should return empty object', () => {
      expect(parse(null)).toEqual({});
    });

    it('headers with : should return empty object ', () => {
      const headers = ':';
      expect(parse(headers)).toEqual({});
    });

    it('should return object with from filestack.com', () => {
      const headers = 'from:filestack.com\nfrom:filestack.com';
      expect(parse(headers)).toEqual({ from: 'filestack.com' });
    });

    it('should return set-cookies false', () => {
      const headers = 'set-cookie:false';
      expect(parse(headers)).toEqual({ 'set-cookie': ['false'] });
    });
  });

  describe('normalize headers', () => {
    it('normalize headers should return empty object', () => {
      // @ts-ignore
      expect(normalizeHeaders()).toEqual({});
    });

    it('normalize headers with set-cookies false, should return false', () => {
      const data = { ['set-cookies']: 'false' };
      expect(normalizeHeaders(data)).toEqual({ 'Set-Cookies': 'false' });
    });
  });

  describe('cookies', () => {
    it('should return cookies with specify values', () => {
      const data = { ['set-cookies']: 'false' };
      const res = set(data, 'set-cookies', 'value', true);
      expect(res).toEqual({ 'Set-Cookies': 'value', 'set-cookies': 'false' });
    });

    it('should return with value', () => {
      const h = {};
      const res = set(h, 'name', 'value', true);

      expect(res).toEqual({ Name: 'value' });
    });

    it('should return value www-authenticate', () => {
      const data = { 'www-authenticate': '' };
      const res = set(data, 'name', 'value', true);

      expect(res).toEqual({ Name: 'value', 'www-authenticate': '' });
    });
  });

  describe('normalize name', () => {
    it('should return string to equal WWW-Authenticate', () => {
      expect(normalizeName('www-authenticate')).toEqual('WWW-Authenticate');
    });

    it('should return Content-Type', () => {
      expect(normalizeName('content-type')).toBe('Content-Type');
    });
  });
});
