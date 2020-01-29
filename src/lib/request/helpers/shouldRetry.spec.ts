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

import { shouldRetry } from './shouldRetry';
import { FsRequestErrorCode, FsRequestError } from '../error';
import { FsResponse } from './../types';

const testResponse = (code: number = 200): FsResponse => ({
  status: code,
  statusText: 'test',
  headers: {},
  data: {},
  config: {},
});

describe('Request/Helpers/shouldRetry', () => {
  describe('shouldRetry', () => {
    it('should retry on network error', () => {
      expect(shouldRetry(new FsRequestError('', null, testResponse(), FsRequestErrorCode.NETWORK))).toEqual(true);
    });

    it('should retry on server error', () => {
      expect(shouldRetry(new FsRequestError('', null, testResponse(), FsRequestErrorCode.SERVER))).toEqual(true);
    });

    it('should retry on server error', () => {
      expect(shouldRetry(new FsRequestError('', null, testResponse(), FsRequestErrorCode.TIMEOUT))).toEqual(true);
    });

    it('should retry on request 5xx code', () => {
      // @ts-ignore
      expect(shouldRetry(new FsRequestError('', null, testResponse(504), FsRequestErrorCode.OTHER))).toEqual(true);
    });

    it('should not retry on 4xx codes', () => {
      // @ts-ignore
      expect(shouldRetry(new FsRequestError('', null, testResponse(404), FsRequestErrorCode.REQUEST))).toEqual(false);
    });

    it('should not retry on request error', () => {
      // @ts-ignore
      expect(shouldRetry(new FsRequestError('', null, testResponse(), FsRequestErrorCode.REQUEST))).toEqual(false);
    });

    it('should not retry on request aborted', () => {
      // @ts-ignore
      expect(shouldRetry(new FsRequestError('', null, testResponse(), FsRequestErrorCode.ABORTED))).toEqual(false);
    });
  });
});
