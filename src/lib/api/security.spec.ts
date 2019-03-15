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
        handle: 'bfTNCigRLq0QMOrsFKzb',
      };
      const appSecret = 'testAppSecret';
      const result = getSecurity(policy, appSecret);
      const expected = {
        policy: 'eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYmZUTkNpZ1JMcTBRTU9yc0ZLemIifQ==',
        signature: 'ab1624c9f219ca0118f1af43d21ee87a09a07645c15c9fdbb7447818739c2b8b',
      };
      expect(result).toEqual(expected);
    });
  });
});
