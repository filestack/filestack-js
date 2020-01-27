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

import { prepareData, parseResponse } from './data';

describe('Request/Helpers/Data', () => {
  describe('prepare data', () => {
    it('should return empty data', () => {
      const data = { url: 'https://filestack.com', data: {} };
      expect(prepareData(data)).toEqual(data);
    });

    it('should return ArrayBuffer', () => {
      const data = { url: 'https://filestack.com', data: new ArrayBuffer(10) };
      expect(prepareData(data)).toEqual(data);
    });

    it('should return url params', () => {
      const data = { url: 'https://filestack.com', data: new URLSearchParams('q=search&id=1') };
      expect(prepareData(data)).toEqual(data);
    });
  });

  describe('parse response', () => {
    it('should return equal response data', () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {},
        data: [],
        config: {
          url: 'https://filestack.com',
        },
      };
      expect(parseResponse(response)).toEqual(response);
    });

    it('should return response with application/json and data stringify', () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({ a: 1 }),
        config: {
          url: 'https://filestack.com',
        },
      };
      expect(parseResponse(response)).toEqual(response);
    });

    it('should return response with application/json and json data ', () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'application/json',
        },
        data: { a: 1 },
        config: {
          url: 'https://filestack.com',
        },
      };
      expect(parseResponse(response)).toEqual(response);
    });

    it('should return text/plain response with ArrayBuffer ', () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'text/plain',
        },
        data: new ArrayBuffer(10),
        config: {
          url: 'https://filestack.com',
        },
      };
      expect(parseResponse(response)).toEqual(response);
    });
  });
});
