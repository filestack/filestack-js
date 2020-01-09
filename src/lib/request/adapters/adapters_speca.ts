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
import { FsHttpMethod } from '../types';
import { FsCancelToken } from '../token';
import { FsRequestError, FsRequestErrorCode } from '../error';

export const adaptersSpeca = (adapter: any, adapterName: string) => {
  describe(`Request/Adapters/${adapterName}`, () => {
    let scope;
    const url = 'https://filestack.com';

    beforeAll(() => {
      spyOn(utils, 'isNode').and.returnValue(false);
    });

    beforeEach(() => {
      nock.cleanAll();
      scope = null;
    });

    beforeEach(() => {
      scope = nock(url);
    });

    describe('request basic', () => {
      it('should return status 200', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };
        scope.get('/').reply(200, 'ok', { 'access-control-allow-origin': '*' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
        scope.done();
      });
    });

    describe('request auth', () => {
      it('should return status 200', async () => {
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

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
      });
    });

    describe('request with redirect', () => {
      it('should return status 200', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').reply(302, 'ok', { location: 'https://example.com' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);

        scope.done();
      });
    });

    describe('request with redirect but without url', () => {
      it('should return FsRequestError with FsRequestErrorCode.NETWORK', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').reply(302, 'ok', { location: '' });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }
        scope.done();
      });
    });

    describe('request with redirect hoops', () => {
      it('should return FsRequestError with FsRequestErrorCode.MAXREDIRECTS', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope
          .get('/')
          .reply(302, 'ok', { location: 'https://filestack.com/a' })
          .get('/a')
          .reply(302, 'ok', { location: 'https://filestack.com/b' })
          .get('/b')
          .reply(302, 'ok', { location: 'https://filestack.com/c' })
          .get('/c')
          .reply(302, 'ok', { location: 'https://filestack.com/d' })
          .get('/d')
          .reply(302, 'ok', { location: 'https://filestack.com/e' })
          .get('/e')
          .reply(302, 'ok', { location: 'https://filestack.com/f' })
          .get('/f')
          .reply(302, 'ok', { location: 'https://filestack.com/g' })
          .get('/g')
          .reply(302, 'ok', { location: 'https://filestack.com/h' })
          .get('/h')
          .reply(302, 'ok', { location: 'https://filestack.com/i' })
          .get('/i')
          .reply(302, 'ok', { location: 'https://filestack.com/j' })
          .get('/j')
          .reply(302, 'ok', { location: 'https://filestack.com/k' });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.MAXREDIRECTS);
        }

        scope.done();
      });
    });

    describe('request with redirect duplicate path', () => {
      it('should return status 200', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope
          .get('/')
          .reply(302, 'ok', { location: 'https://filestack.com/a' })
          .get('/a')
          .reply(302, 'ok', { location: 'https://filestack.com/a' })
          .get('/a')
          .reply(200, 'ok');

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
      });
    });

    describe('request form', () => {
      it('should return status 200', async () => {
        const form = new FormData();

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          data: form,
        };

        scope.options('/').reply(200, 'ok', {
          'access-control-allow-origin': '*',
        });

        scope.get('/').reply(200, 'ok');

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);

        scope.done();
      });
    });

    describe('request auth', () => {
      it('should return status 200', async () => {
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

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
      });
    });

    // @fixme:
    describe('Network errors', () => {
      it('Should throw an FilestackError on socket abort with FsRequestErrorCode.ABORTED code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          timeout: 50,
        };

        scope
          .get('/')
          .socketDelay(2000)
          .reply(200, 'ok', {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
          });

        try {
          setTimeout(() => {
            nock.abortPendingRequests();
          }, 100);
          const requestAdapter = new adapter();
          await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.ABORTED);
        }
        scope.done();
      });

      it('Should throw an FilestackError on response ECONNREFUSED error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNREFUSED' });

        let res;
        try {
          const requestAdapter = new adapter();
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response ECONNRESET error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNRESET' });

        let res;
        try {
          const requestAdapter = new adapter();
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response ENOTFOUND error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        let res;
        try {
          const requestAdapter = new adapter();
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response onProgress with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          onProgress: () => console.log(),
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        let res;
        try {
          const requestAdapter = new adapter();
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        expect(res).toBeFalsy();
        scope.done();
      });

      it('Should throw an FilestackError on response cancelToken resolve with FsRequestErrorCode.ABORTED code', async () => {
        const token = new FsCancelToken();
        token.getSource = () => Promise.resolve('ok');

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          cancelToken: token,
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        let res;
        try {
          const requestAdapter = new adapter();
          res = await requestAdapter.request(options);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.ABORTED);
        }

        expect(res).toBeUndefined();
      });

      it('Should throw an FilestackError on response cancelToken reject with FsRequestErrorCode.NETWORK code', async () => {
        const token = new FsCancelToken();
        token.getSource = () => Promise.reject('ok');

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          cancelToken: token,
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        let res;
        try {
          const requestAdapter = new adapter();
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
};
