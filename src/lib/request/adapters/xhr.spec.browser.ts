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

import * as nock from 'nock';
import * as utils from '../utils';
import { XhrAdapter } from './xhr';
import { FsHttpMethod } from '../types';
import { FsCancelToken } from '../token';
import { FsRequestError, FsRequestErrorCode } from '../error';

describe('Request/Adapters/xhr', () => {
  let scope;
  let requestAdapter;
  const url = 'https://filestack.com';

  beforeAll(() => {
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  afterEach(() => {
    nock.cleanAll();
    scope = null;
  });

  beforeEach(() => {
    scope = nock(url);

    // depending on test we add xhr or http
    requestAdapter = new XhrAdapter();
  });

  describe('request basic', () => {
    it('should return req', async () => {
      const options = {
        url: url,
        method: FsHttpMethod.GET,
      };
      scope.get('/').reply(200, 'ok', { 'access-control-allow-origin': '*' });
      const adapter = new XhrAdapter();
      const res = await adapter.request(options);
      expect(res.status).toEqual(200);
      scope.done();
    });
  });

  describe('request auth', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe('request form', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        data: new FormData(),
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe('request FsCancelToken', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        cancelToken: new FsCancelToken(),
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe.only('request delay', () => {
    describe('Timeouts', () => {
      it('Should throw an FilestackError on socket abort', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          timeout: 50,
        };

        scope.get('/').socketDelay(2000).reply(200, 'ok', {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
        });

        try {
          setTimeout(() => {
            nock.abortPendingRequests();
          }, 100);
          await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.ABORTED);
        }
        scope.done();
      });
    });

    describe('Network errors', () => {
      it('Should throw an FilestackError on response ECONNREFUSED error', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNREFUSED' });

        let res;
        try {
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response ECONNRESET error', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNRESET' });

        let res;
        try {
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response ENOTFOUND error', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        let res;
        try {
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });
    });
  });

});
