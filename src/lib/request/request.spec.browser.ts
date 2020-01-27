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
import { FsHttpMethod } from './types';
import { Dispatch } from './dispatch';

jest.mock('./dispatch');

const dispatchSpy = jest.fn(() => Promise.resolve('response'));
// @ts-ignore
Dispatch.prototype.request.mockImplementation(dispatchSpy);

describe('Request/Request', () => {

  describe('dispatch', () => {
    it('should return response', async () => {
      const fsRequest = new FsRequest();
      const response = await fsRequest.dispatch({ method: FsHttpMethod.GET });

      expect(dispatchSpy).toHaveBeenCalledWith({ method: FsHttpMethod.GET });

      expect(response).toBe('response');
    });
  });
});
