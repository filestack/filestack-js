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
import * as nock from 'nock';
import { HttpAdapter } from './http';
import { FsHttpMethod } from '../types';
import { FsRequestError } from './../error';

const TEST_HOST_HTTP = 'http://filestacktest.com';
const TEST_HOST_HTTPS = 'https://filestacktest-https.com';

// let scope;
// let scopeHttps;

describe('Request/Adapter/Http', () => {
  // beforeEach(() => {
  //   scope = nock(testHost);
  //   scope.persist();

  //   interceptorStart = scope.post('/multipart/start');
  //   interceptorUpload = scope.post('/multipart/upload');
  //   interceptorCommit = scope.post('/multipart/commit');
  //   interceptorComplete = scope.post('/multipart/complete');
  //   interceptorS3 = scope.put('/fakes3');

  //   interceptorStart.reply(200, (_, data) => mockStart(JSON.parse(data)));
  //   interceptorUpload.twice().reply(200, (_, data) => mockUpload(JSON.parse(data)));
  //   interceptorCommit.reply(200, (_, data) => mockCommit(JSON.parse(data)));
  //   interceptorComplete.reply(200, (_, data) => mockComplete(JSON.parse(data)));
  //   interceptorS3.twice().reply(201, s3Callback, { etag: 'test' });

  //   mockStart.mockReturnValue({
  //     uri: mockedUri,
  //     region: mockRegion,
  //     upload_id: mockUploadId,
  //     location_url: testHost,
  //   });

  //   mockUpload.mockReturnValue({
  //     url: s3Url,
  //     headers: {
  //       test: 'test',
  //     },
  //     location_url: testHost,
  //   });

  //   mockPut.mockReturnValue({});
  //   mockCommit.mockReturnValue({});

  //   mockComplete.mockReturnValue({
  //     handle: 'test_handle',
  //     url: 'test_url',
  //     filename: 'test_filename',
  //     size: 123,
  //     mimetype: 'test_mimetype',
  //     status: 'test_status',
  //   });
  // });
  // beforeAll(() => {

  //   scopeHttps = nock(TEST_HOST_HTTPS);

  //   // interceptorStart.reply(200, (_, data) => mockStart(JSON.parse(data)));
  // });

  // afterEach(() => {
  //   nock.cleanAll();
  //   nock.enableNetConnect();
  //   jest.clearAllMocks();
  // });

  describe('Make request', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('should make correct get request with query string params', async () => {
      const scope = nock(TEST_HOST_HTTP);

      const params = {
        testParam: 123,
      };

      scope
        .get('/')
        .query(params)
        .reply(200, 'ok');

      const adapter = new HttpAdapter();
      const res = await adapter.request({
        method: FsHttpMethod.GET,
        url: TEST_HOST_HTTP,
        params,
      });

      expect(res.status).toEqual(200);

      scope.done();
    });

    it('should make correct https request', async () => {
      const scope = nock(TEST_HOST_HTTPS);

      scope.get('/').reply(200, 'ok');

      const adapter = new HttpAdapter();
      const res = await adapter.request({
        method: FsHttpMethod.GET,
        url: TEST_HOST_HTTPS,
      });

      expect(res.status).toEqual(200);

      scope.done();
    });

    it('should use default https protocol if not set', async () => {
      const scope = nock(TEST_HOST_HTTPS);
      scope.get('/').reply(200, 'ok');

      const adapter = new HttpAdapter();
      const res = await adapter.request({
        method: FsHttpMethod.GET,
        url: (TEST_HOST_HTTPS + '').replace('https://', ''),
      });

      expect(res.status).toEqual(200);

      scope.done();
    });

    it('should throw error when host is malformed', () => {
      const scope = nock(TEST_HOST_HTTPS);
      scope.get('/').reply(200, 'ok');

      const adapter = new HttpAdapter();

      return expect(
        adapter.request({
          method: FsHttpMethod.GET,
          url: '/',
        })
      ).rejects.toEqual(expect.any(FsRequestError));
    });

    it.only('should respect auth params', async () => {
      const scope = nock(TEST_HOST_HTTPS);
      const auth = {
        username: 'test',
        password: 'test',
      };

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new HttpAdapter();
      const res = await adapter.request({
        auth,
        headers: {
          authorization: 'test',
        },
        method: FsHttpMethod.GET,
        url: TEST_HOST_HTTPS,
      });

      expect(res.status).toEqual(200);

      scope.done();
    });
  });
});
