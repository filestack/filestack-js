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

import { getSecurity, validateWebhookSignature } from './security';

describe('api:security', () => {
  describe('getSecurity', () => {
    it('should create a proper object with policy & signature', () => {
      const policy = {
        expiry: 1523595600,
        call: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
        handle: 'TEST_HANDLE',
      };
      const appSecret = 'testAppSecret';
      const result = getSecurity(policy, appSecret);
      const expected = {
        policy:
          'eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicGljayIsInJlYWQiLCJzdGF0Iiwid3JpdGUiLCJ3cml0ZVVybCIsInN0b3JlIiwiY29udmVydCIsInJlbW92ZSIsImV4aWYiLCJydW5Xb3JrZmxvdyJdLCJoYW5kbGUiOiJURVNUX0hBTkRMRSJ9',
        signature: '7df0536104cdcc16370ad6494cdbda30c9773a62eec6e5153fa539544db6206e',
      };
      expect(result).toEqual(expected);
    });

    it('should throw error on invalid security params', () => {
      const policy = {
        expiry: 'test',
        call: ['pick1', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
        handle: 'TEST_HANDLE',
      };
      const appSecret = 'testAppSecret';
      // @ts-ignore
      expect(() => getSecurity(policy, appSecret)).toThrowError('Invalid security params');
    });
  });

  describe('validateWebhookSignature', () => {
    it('should pass validation on proper signature', () => {
      const testRawData = '{"id": 6844, "action": "fp.upload", "timestamp": 1559199901, "text": {"url": "http://cdn.filestackapi.dev/xK88QArxRiyVvFzo4p33", "client": "Computer", "data": {"filename": "01 (1).png", "type": "image/png", "size": 881855}}}';

      const correctSignature = {
        signature: '14495b54b246e1352bb69cd91c5c1bfe2221f2d0330414b3df8f5fb2903db730',
        timestamp: '1559199901',
      };

      const secret = 'Y5cWb1rdRDSTSqEjF5pv';

      expect(validateWebhookSignature(secret, testRawData, correctSignature)).toBeTruthy();
    });
  });
});
