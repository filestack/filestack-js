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

import { FsRequest } from './request';
import { FsRequestOptions } from './types';
import { Dispatch } from './dispatch';

jest.mock('./dispatch');

describe('Request/Request', () => {
  describe('new FsRequest()', () => {
    const request = new FsRequest({});
    const expected = { defaults: {}, dispatcher: { adapter: { redirectHoops: 0, redirectPaths: [] } } };
    it(`request should return equal to `, () => expect(request).toEqual(expected));
  });

  describe.only('get', () => {
    it(`FsRequest get method should return status 200`, async () => {
      const dispatchSpy = jest.fn(() => Promise.resolve('response'));

      // @ts-ignore
      Dispatch.prototype.request.mockImplementation(dispatchSpy);
      const response = await FsRequest.get('https://filestack.com');

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://filestack.com',
      });

      expect(response).toBe('response');
    });
  });
});
