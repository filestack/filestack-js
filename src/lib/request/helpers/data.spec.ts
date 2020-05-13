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
    it('should return equal response data', async () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {},
        data: [],
        config: {
          url: 'https://filestack.com',
        },
      };
      expect(await parseResponse(response)).toEqual(response);
    });

    it('should return response with application/json and data stringify', async () => {
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
      expect(await parseResponse(response)).toEqual(response);
    });

    it('should return response with application/json and json data ', async () => {
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
      expect(await parseResponse(response)).toEqual(response);
    });

    it('should return text/plain response with ArrayBuffer ', async () => {
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
      expect(await parseResponse(response)).toEqual(response);
    });

    it('should parse application/xml response to json', async () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'application/xml',
        },
        data: Buffer.from('<?xml version="1.0" encoding="UTF-8"?><Error><code>RequestTimeTooSkewed</code><Message>The difference between the request time and the current time is toolarge.</Message><RequestTime>20191102T153031Z</RequestTime><ServerTime>2019-11-02T15:56:35Z</ServerTime><MaxAllowedSkewMilliseconds>900000</MaxAllowedSkewMilliseconds><RequestId>6C8855BC97D17A1B</RequestId><HostId>3bwhtSpY9tAypFr9L6V+W6UAxFUyk7mK+VQGhIu4Bxj0t7jhQWMEEinW4YHpi8Q9qONnx1CEHKE=</HostId></Error>'),
        config: {
          url: 'https://filestack.com',
        },
      };

      const res = await parseResponse(response);

      return expect(res.data).toEqual({
        Error: {
          code: 'RequestTimeTooSkewed',
          Message: 'The difference between the request time and the current time is toolarge.',
          RequestTime: '20191102T153031Z',
          ServerTime: '2019-11-02T15:56:35Z',
          MaxAllowedSkewMilliseconds: 900000,
          RequestId: '6C8855BC97D17A1B',
          HostId: '3bwhtSpY9tAypFr9L6V+W6UAxFUyk7mK+VQGhIu4Bxj0t7jhQWMEEinW4YHpi8Q9qONnx1CEHKE=',
        },
      });
    });
  });
});
