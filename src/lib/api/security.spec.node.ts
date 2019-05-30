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

  describe.only('validateWeebhookSignature', () => {
    it('should pass validation on proper signature', () => {
      const testData = {
        id: 1000,
        action: 'fs.workflow',
        text: {
          createdAt: '2020-04-26T10:53:02.936164785Z',
          jobid: 'jobid-jobid-jobid-jobid-jobid',
          results: {
            border: {
              mimetype: 'image/png',
              url: 'https://cdn.filestackcontent.com/Aaaaaaaaaaaaaaaaaaaaaaz/wf://workflowid-workflowid-workflowid-workflowid/jobid-jobid-jobid-jobid-jobid/aaaaaaaaaaaaaaaaaaaa',
            },
            circle: {
              mimetype: 'image/png',
              url: 'https://cdn.filestackcontent.com/Aaaaaaaaaaaaaaaaaaaaaaz/wf://workflowid-workflowid-workflowid-workflowid/jobid-jobid-jobid-jobid-jobid/bbbbbbbbbbbbbbbbbbbb',
            },
            metadata: {
              data: {
                filename: 'filename.jpg',
                mimetype: 'image/jpeg',
                size: 64016,
                uploaded: 1501181734097.6802,
              },
            },
          },
          sources: ['Handle1', 'Handle2'],
          status: 'Finished',
          updatedAt: '2020-04-26T10:53:06.524680403Z',
          workflow: 'workflowid-workflowid-workflowid-workflowid',
        },
        timestamp: 1558123673,
      };

      const correctSignature = {
        signature: 'd2d2d662fa2b9f85eb1fda5c5013d2ea142c96fdec0183927b3178fdf17623ae',
        timestamp: '1559044473',
      };

      const secret = 'SecretSecretSecretAA';

      expect(validateWebhookSignature(secret, testData, correctSignature)).toBeTruthy();
    });
  });
});
