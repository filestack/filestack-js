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

describe('api/security', () => {
  describe('getSecurity', () => {
    it('should throw not supported error', () => {
      const policy = {
        expiry: 1523595600,
        call: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
        handle: 'TEST_HANDLE',
      };
      const appSecret = 'testAppSecret';

      expect(() => getSecurity(policy, appSecret)).toThrowError('getSecurity is only supported in nodejs');
    });
  });

  describe('validateWebhookSignature', () => {
    it('should throw not supported error', () => {
      const testRawData = '{"id": 6844, "action": "fp.upload", "timestamp": 1559199901, "text": {"url": "http://cdn.filestackapi.dev/xK88QArxRiyVvFzo4p33", "client": "Computer", "data": {"filename": "01 (1).png", "type": "image/png", "size": 881855}}}';

      const correctSignature = {
        signature: '14495b54b246e1352bb69cd91c5c1bfe2221f2d0330414b3df8f5fb2903db730',
        timestamp: '1559199901',
      };

      const secret = 'Y5cWb1rdRDSTSqEjF5pv';

      expect(() => validateWebhookSignature(secret, testRawData, correctSignature)).toThrowError('validateWebhookSignature is only supported in nodejs');
    });
  });
});
