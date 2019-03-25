/*
 * Copyright (c) 2019 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getSecurity } from './security';

describe('api:security', () => {
  describe('getSecurity', () => {
    it('should create a proper object with policy & signature', () => {
      const policy = {
        expiry: 1523595600,
        call: ['read', 'convert'],
        handle: 'TEST_HANDLE',
      };
      const appSecret = 'testAppSecret';
      const result = getSecurity(policy, appSecret);
      const expected = {
        policy: 'eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiVEVTVF9IQU5ETEUifQ==',
        signature: '24940e75ff80bb43cbe29d7155cf6a7150a4533b1e8c4d9ff916c9aec5a3f3d0',
      };
      expect(result).toEqual(expected);
    });
  });
});
