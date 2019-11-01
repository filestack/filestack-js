/*
 * Copyright (c) 2018 by Filestack.
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

import axios from 'axios';
import { requestWithSource, postWithRetry } from './request';
import * as nock from 'nock';

const v = require('../../../package.json').version;

const testHost = 'https://test.com';

const mockPost = jest.fn().mockName('mockPut');

describe('Request', () => {
  afterAll(() => {
    nock.restore();
  });
  beforeEach(() => {
    nock(testHost)
      .persist()
      .post('/post')
      .reply(200, function(url, data) {
        return mockPost(url, JSON.parse(data), this.req.headers);
      });

    nock(testHost)
      .post('/fail2')
      .times(2)
      .reply(501, {
        code: 'SERVER_ERROR',
        message: 'Internal Server Error',
      })
      .post('/fail2')
      .once()
      .reply(200, function(url, data) {
        return mockPost(url, JSON.parse(data), this.req.headers);
      });

    mockPost.mockReturnValue({
      test: 123,
    });
  });

  afterEach(() => {
    mockPost.mockClear();
  });

  describe('requestWithSource', () => {
    it('should set correct source', async () => {
      const res = await requestWithSource().post(`${testHost}/post`, {});

      expect(mockPost).toHaveBeenCalledWith(
        '/post',
        {},
        expect.objectContaining({
          'filestack-source': `JS-${v}`,
          'filestack-trace-span': expect.any(String),
          'filestack-trace-id': expect.any(String),
        })
      );

      expect(res).toEqual(expect.objectContaining({ status: 200 }));
    });

    it('should respect retry config', async () => {
      const onRetry = jest.fn().mockName('onRetry');

      nock(testHost)
        .post('/retrytest')
        .twice()
        .replyWithError({
          message: 'something awful happened',
          code: 'ECONNRESET',
        })
        .post('/retrytest')
        .once()
        .reply(200, function(url, data) {
          return mockPost(url, JSON.parse(data), this.req.headers);
        });

      const res = await requestWithSource({
        retry: 2,
        retryFactor: 2,
        retryMaxTime: 1000,
        onRetry,
      }).post(`${testHost}/retrytest`, {
        test: 1,
      });

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(res).toEqual(expect.objectContaining({ status: 200 }));
    });

    it('should run request without params', async () => {
      const onRetry = jest.fn().mockName('onRetry');

      nock(testHost)
        .post('/retrytest')
        .twice()
        .replyWithError({
          message: 'something awful happened',
          code: 'ECONNRESET',
        })
        .post('/retrytest')
        .once()
        .reply(200, {});

      const res = await requestWithSource({
        retry: 2,
        retryFactor: 2,
        retryMaxTime: 1000,
        onRetry,
      }).post(`${testHost}/retrytest`);

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(res).toEqual(expect.objectContaining({ status: 200 }));
    });
  });

  describe('postWithRetry', () => {
    it('should respect user defined headers', async () => {
      const fields = {
        test: 1,
      };

      const headers = {
        test: 1,
      };

      await postWithRetry(`${testHost}/post`, fields, { headers });

      expect(mockPost).toHaveBeenCalledWith(
        '/post',
        fields,
        expect.objectContaining({
          ...headers,
          'filestack-source': `JS-${v}`,
          'filestack-trace-span': expect.any(String),
          'filestack-trace-id': expect.any(String),
        })
      );
    });

    it('should add default headers if nothing is provided', async () => {
      const fields = {
        test: 1,
      };

      await postWithRetry(`${testHost}/post`, fields);

      expect(mockPost).toHaveBeenCalledWith(
        '/post',
        fields,
        expect.objectContaining({
          'filestack-source': `JS-${v}`,
          'filestack-trace-span': expect.any(String),
          'filestack-trace-id': expect.any(String),
        })
      );
    });

    it('should respect retry config', async () => {
      const onRetry = jest.fn().mockName('onRetry');

      const fields = {
        test: 1,
      };

      const res = await postWithRetry(
        `${testHost}/fail2`,
        fields,
        {},
        {
          retry: 2,
          retryFactor: 2,
          retryMaxTime: 1000,
          onRetry,
        }
      );

      expect(mockPost).toHaveBeenCalledWith(
        '/fail2',
        fields,
        expect.objectContaining({
          'filestack-source': `JS-${v}`,
          'filestack-trace-span': expect.any(String),
          'filestack-trace-id': expect.any(String),
        })
      );

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(res).toEqual(expect.objectContaining({ status: 200 }));
    });

    it('should reject on max retry count', async () => {
      expect.assertions(1);

      await expect(
        postWithRetry(
          `${testHost}/fail2`,
          {},
          {},
          {
            retry: 1,
            retryFactor: 2,
            retryMaxTime: 1000,
          }
        )
      ).rejects.toEqual(expect.any(Error));
    });

    it('should reject on 4xx errors (request errors)', async () => {
      const onRetry = jest.fn().mockName('onRetry');
      nock(testHost)
        .post('/401')
        .reply(401, {});

      await expect(
        postWithRetry(
          `${testHost}/401`,
          {},
          {},
          {
            retry: 1,
            retryFactor: 2,
            retryMaxTime: 1000,
            onRetry,
          }
        )
      ).rejects.toEqual(expect.any(Error));

      expect(onRetry).not.toHaveBeenCalled();
    });

    it('should retry on network errors like (ECONNRESET)', async () => {
      const onRetry = jest.fn().mockName('onRetry');
      nock(testHost)
        .post('/fail3')
        .twice()
        .replyWithError({
          message: 'something awful happened',
          code: 'ECONNRESET',
        })
        .post('/fail3')
        .once()
        .reply(200, function(url, data) {
          return mockPost(url, JSON.parse(data), this.req.headers);
        });

      await expect(
        postWithRetry(
          `${testHost}/fail3`,
          {},
          {},
          {
            retry: 3,
            retryFactor: 2,
            retryMaxTime: 1000,
            onRetry,
          }
        )
      ).resolves.toEqual(expect.objectContaining({ status: 200 }));

      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it('should not retry on user cancel request', () => {
      const onRetry = jest.fn().mockName('onRetry');
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      setTimeout(() => source.cancel('user_cancel'), 1);

      return expect(
        postWithRetry(
          `${testHost}/fail2`,
          {},
          {
            cancelToken: source.token,
          },
          {
            retry: 3,
            retryFactor: 2,
            retryMaxTime: 10000,
            onRetry,
          }
        )
      ).rejects.toEqual({ message: 'user_cancel' });
    });
  });
});
