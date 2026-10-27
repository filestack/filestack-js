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

    it('should parse multipart upload xml responses to json', async () => {
      const xmlResponse = (xml: string) => ({
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'application/xml',
        },
        data: xml,
        config: {
          url: 'https://filestack.com',
        },
      });

      const init = await parseResponse(xmlResponse('<?xml version="1.0" encoding="UTF-8"?><InitiateMultipartUploadResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Bucket>bucket</Bucket><Key>dir/file.jpg</Key><UploadId>VXBsb2FkIElEIGZvciA2aWWpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA</UploadId></InitiateMultipartUploadResult>'));
      const complete = await parseResponse(xmlResponse('<?xml version="1.0" encoding="UTF-8"?><CompleteMultipartUploadResult><Location>https://bucket.s3.amazonaws.com/dir/file.jpg</Location><Bucket>bucket</Bucket><Key>dir/file.jpg</Key><ETag>"3858f62230ac3c915f300c664312c11f-9"</ETag></CompleteMultipartUploadResult>'));

      expect(init.data).toEqual({
        InitiateMultipartUploadResult: {
          Bucket: 'bucket',
          Key: 'dir/file.jpg',
          UploadId: 'VXBsb2FkIElEIGZvciA2aWWpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA',
        },
      });
      expect(complete.data).toEqual({
        CompleteMultipartUploadResult: {
          Location: 'https://bucket.s3.amazonaws.com/dir/file.jpg',
          Bucket: 'bucket',
          Key: 'dir/file.jpg',
          ETag: '"3858f62230ac3c915f300c664312c11f-9"',
        },
      });
    });

    // CVE-2026-33036: numeric character references bypassed fast-xml-parser's entity limits and
    // made parsing quadratic (~19 s for this 195 KB body with fast-xml-parser 5.3.6).
    it('should parse an xml response flooded with numeric entities quickly', async () => {
      const response = {
        status: 200,
        statusText: 'ok',
        headers: {
          'content-type': 'application/xml',
        },
        data: `<root>${'&#65;'.repeat(40000)}</root>`,
        config: {
          url: 'https://filestack.com',
        },
      };

      const start = Date.now();
      const res = await parseResponse(response);

      expect(Date.now() - start).toBeLessThan(1000);
      expect(typeof res.data.root).toBe('string');
    }, 60000);
  });
});
