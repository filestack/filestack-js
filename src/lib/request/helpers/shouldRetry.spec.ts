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
import * as utils from '../utils';
import { FsRequestErrorCode } from '../error';

describe('Request/Helpers/shouldRetry', () => {
  beforeAll(() => {
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  describe('shouldRetry', () => {
    it('should return true', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: {
          status: 500,
          statusText: '',
          headers: null,
          data: '',
          config: {
            url: 'https://filestack.com',
          },
        },
        code: FsRequestErrorCode.NETWORK,
      };
      expect(shouldRetry(data)).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return true', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: {
          status: 500,
          statusText: '',
          headers: null,
          data: '',
          config: {
            url: 'https://filestack.com',
          },
        },
        code: FsRequestErrorCode.SERVER,
      };
      expect(shouldRetry(data)).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return true', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: {
          status: 500,
          statusText: '',
          headers: null,
          data: '',
          config: {
            url: 'https://filestack.com',
          },
        },
        code: FsRequestErrorCode.TIMEOUT,
      };
      expect(shouldRetry(data)).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return true', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: false,
        code: FsRequestErrorCode.ABORTED,
      };
      // @ts-ignore
      expect(shouldRetry(data)).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return true', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: {
          status: 510,
        },
        code: FsRequestErrorCode.ABORTED,
      };
      // @ts-ignore
      expect(shouldRetry(data)).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return false', () => {
      const data = {
        message: 'msg',
        name: '',
        config: {},
        response: {
          status: 404,
        },
        code: FsRequestErrorCode.ABORTED,
      };
      // @ts-ignore
      expect(shouldRetry(data)).toBe(false);
    });
  });
});
