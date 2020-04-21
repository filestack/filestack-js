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

/* istanbul ignore file */
import * as nock from 'nock';
import * as zlib from 'zlib';
import { FsHttpMethod, FsRequestOptions } from '../types';
import { FsCancelToken } from '../token';
import { FsRequestError, FsRequestErrorCode } from '../error';

export const adaptersHttpAbstract = (adapter: any, adapterName: string) => {
  describe(`Request/Adapters/${adapterName}`, () => {
    let scope;
    const url = 'https://somewrongdom.moc';

    beforeEach(() => {
      nock.cleanAll();
      scope = null;
    });

    beforeEach(() => {
      scope = nock(url).defaultReplyHeaders({
        'access-control-allow-origin': req => req.headers['origin'],
        'access-control-allow-methods': req => req.headers['access-control-request-method'],
        'access-control-allow-headers': req => req.headers['access-control-request-headers'],
      });

      if (adapterName === 'xhr') {
        scope.options(/.*/).reply(200);
      }
    });

    describe('request basic', () => {
      it('should make correct request (https)', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };
        scope.get('/').reply(200, 'ok', { 'Content-Type': 'text/plain' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
        expect(res.data).toEqual('ok');
        scope.done();
      });

      it('should make correct request (http)', async () => {
        const httpUrl = url.replace('https', 'http');

        const scopeHttp = nock(httpUrl).defaultReplyHeaders({
          'access-control-allow-origin': req => req.headers['origin'],
          'access-control-allow-methods': req => req.headers['access-control-request-method'],
          'access-control-allow-headers': req => req.headers['access-control-request-headers'],
        });

        if (adapterName === 'xhr') {
          scopeHttp.options(/.*/).reply(200);
        }

        const options = {
          url: httpUrl,
          method: FsHttpMethod.GET,
        };

        scopeHttp.get('/').reply(200, 'ok', { 'Content-Type': 'text/plain' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('ok');
        scopeHttp.done();
      });

      it('should add https protocol if no protocol is provided', async () => {
        const options = {
          url: url.replace('https://', ''),
          method: FsHttpMethod.GET,
        };

        scope.get('/').reply(200, 'ok', { 'Content-Type': 'text/plain' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('ok');
        scope.done();
      });

      it('should handle string as data param', async () => {
        const msg = 'Some test stream data';
        const mock = jest
          .fn()
          .mockName('bufferData')
          .mockReturnValue(msg);

        const options = {
          url: url,
          method: FsHttpMethod.POST,
          data: msg,
        };

        scope.post('/').reply(200, function(_, data) {
          return mock(data);
        }, { 'Content-Type': 'text/plain' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
        expect(res.data).toEqual(msg);

        expect(mock).toHaveBeenLastCalledWith(msg);

        scope.done();
      });

      // gzip support is handled by the browser on xhr side
      if (adapterName !== 'xhr') {
        it('should handle deflate response', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          const data = zlib.gzipSync(Buffer.from('ok', 'utf-8'));
          scope.get('/').reply(200, data, { 'Content-encoding': 'gzip, deflate', 'Content-type': 'text/plain' });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);
          expect(res.status).toEqual(200);
          expect(res.data).toEqual('ok');
          scope.done();
        });

        it('should handle 204 gzip request', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          scope.get('/').reply(204, '', { 'Content-encoding': 'gzip, deflate', 'Content-type': 'text/plain' });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);
          expect(res.status).toEqual(204);
          expect(res.data).toEqual(null);

          scope.done();
        });

        it('should handle Buffer as data param', async () => {
          const msg = 'Some test stream data';

          const mock = jest
            .fn()
            .mockName('bufferData')
            .mockReturnValue('ok');

          const options = {
            url: url,
            method: FsHttpMethod.POST,
            data: Buffer.from(msg, 'utf-8'),
          };

          scope.post('/').reply(200, function(_, data) {
            return mock(data);
          }, { 'Content-type': 'text/plain' });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);
          expect(res.status).toEqual(200);
          expect(mock).toHaveBeenLastCalledWith(msg);

          scope.done();
        });

        it('should throw error when data type is unsupported', () => {
          const Readable = require('stream').Readable;

          const options = {
            url: url,
            method: FsHttpMethod.POST,
            data: Readable.from(['test']),
          };

          const requestAdapter = new adapter();

          return expect(requestAdapter.request(options)).rejects.toEqual(expect.any(FsRequestError));
        });
      }

      it('should make request with auth', async () => {
        const auth = {
          username: 'test',
          password: 'test',
        };

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          auth,
        };

        scope.options('/').reply(200, 'ok');

        scope
          .get('/')
          .basicAuth({ user: auth.username, pass: auth.password })
          .reply(200, 'ok', { 'access-control-allow-origin': '*' });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
      });

      it('should throw an error on empty username', async () => {
        const auth = {
          username: null,
          password: 'test',
        };

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          auth,
        };

        const requestAdapter = new adapter();
        return expect(requestAdapter.request(options)).rejects.toEqual(expect.any(FsRequestError));
      });

      it('should throw an error on empty password', async () => {
        const auth = {
          username: 'test',
          password: null,
        };

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          auth,
        };

        const requestAdapter = new adapter();
        return expect(requestAdapter.request(options)).rejects.toEqual(expect.any(FsRequestError));
      });

      it('should overwrite auth header if auth data is provided', async () => {
        const auth = {
          username: 'test',
          password: 'test',
        };

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          auth,
          headers: {
            Authorization: 'test123',
          },
        };

        scope.options('/').reply(200, 'ok');

        scope
          .get('/')
          .basicAuth({ user: auth.username, pass: auth.password })
          .reply(200, 'ok');

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
      });

      it('should contain default headers', async () => {
        const mock = jest
          .fn()
          .mockName('default/headers')
          .mockReturnValue('ok');

        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').reply(200, function(_, data) {
          return mock(this.req.headers);
        });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
        expect(mock).toHaveBeenCalledWith(
          expect.objectContaining({ 'filestack-source': expect.any(String), 'filestack-trace-id': expect.any(String), 'filestack-trace-span': expect.any(String) })
        );
      });

      it('should omit default headers', async () => {
        const mock = jest
          .fn()
          .mockName('default/headers')
          .mockReturnValue('ok');

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          filestackHeaders: false,
        };

        scope.get('/').reply(200, function(_, data) {
          return mock(this.req.headers);
        });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);

        expect(res.status).toEqual(200);
        expect(mock).toHaveBeenCalledWith(
          expect.not.objectContaining({ 'filestack-source': expect.any(String), 'filestack-trace-id': expect.any(String), 'filestack-trace-span': expect.any(String) })
        );
      });

      it('should skip undefined headers', async () => {
        const mock = jest
          .fn()
          .mockName('undefined/headers')
          .mockReturnValue('ok');
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          headers: {
            test: undefined,
          },
        };

        scope.get('/').reply(200, function(_, data) {
          return mock(this.req.headers);
        });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        expect(res.status).toEqual(200);
        expect(mock).toHaveBeenCalledWith(expect.not.objectContaining({ test: undefined }));

        scope.done();
      });
    });

    describe('redirects ', () => {
      // xhr redirects are handled by the browser
      if (adapterName !== 'xhr') {
        it('should follow 302 redirect', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          const response = { test: 123 };

          scope.get('/').reply(302, 'ok', {
            location: `${url}/resp`,
          });
          scope.get('/resp').reply(200, response, {
            'Content-type': 'application/json',
          });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);
          expect(res.status).toEqual(200);
          expect(res.data).toEqual(response);

          scope.done();
        });

        it('should throw error when no location is provided', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          scope.get('/').reply(302, 'ok', { location: '' });

          try {
            const requestAdapter = new adapter();
            await requestAdapter.request(options);

            // return error in try will not emit error
            expect(false).toEqual(true);
          } catch (err) {
            expect(err).toEqual(expect.any(FsRequestError));
            expect(err.code).toEqual(FsRequestErrorCode.REDIRECT);
          }
          scope.done();
        });

        it('should throw error (REDIRECT) on max redirects', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          if (adapterName === 'xhr') {
            scope.options('/').reply(200, 'ok');
          }

          scope
            .get('/')
            .reply(302, 'ok', {
              location: `${url}/a`,
            })
            .get('/a')
            .reply(301, 'ok', {
              location: `${url}/b`,
            })
            .get('/b')
            .reply(302, 'ok', {
              location: `${url}/c`,
            })
            .get('/c')
            .reply(301, 'ok', {
              location: `${url}/d`,
            })
            .get('/d')
            .reply(302, 'ok', {
              location: `${url}/e`,
            })
            .get('/e')
            .reply(301, 'ok', {
              location: `${url}/f`,
            })
            .get('/f')
            .reply(302, 'ok', {
              location: `${url}/g`,
            })
            .get('/g')
            .reply(301, 'ok', {
              location: `${url}/h`,
            })
            .get('/h')
            .reply(302, 'ok', {
              location: `${url}/i`,
            })
            .get('/i')
            .reply(301, 'ok', {
              location: `${url}/j`,
            })
            .get('/j')
            .reply(302, 'ok', {
              location: `${url}/k`,
            });

          try {
            const requestAdapter = new adapter();
            await requestAdapter.request(options);

            // return error in try will not emit error
            expect(false).toEqual(true);
          } catch (err) {
            expect(err).toEqual(expect.any(FsRequestError));
            expect(err.code).toEqual(FsRequestErrorCode.REDIRECT);
          }

          scope.done();
        });

        it('should throw error on redirect loop', async () => {
          const options = {
            url: url,
            method: FsHttpMethod.GET,
          };

          scope
            .get('/')
            .reply(302, 'ok', { location: `${url}/a` })
            .get('/a')
            .reply(302, 'ok', { location: `${url}/a` })
            .get('/a')
            .reply(200, 'ok');

          try {
            const requestAdapter = new adapter();
            await requestAdapter.request(options);

            // return error in try will not emit error
            expect(false).toEqual(true);
          } catch (err) {
            expect(err).toEqual(expect.any(FsRequestError));
            expect(err.code).toEqual(FsRequestErrorCode.REDIRECT);
          }
        });
      }
    });

    if (adapterName === 'xhr') {
      describe('request form', () => {
        it('Should send form data', async () => {
          const form = new FormData();

          const options = {
            url: url,
            method: FsHttpMethod.POST,
            data: form,
          };

          const resp = { form: 'ok' };

          scope.post('/').reply(200, resp, { 'Content-type': 'application/json' });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);

          expect(res.status).toEqual(200);
          expect(res.data).toEqual(resp);

          scope.done();
        });
      });
    }

    describe('4xx and 5xx errors handling', () => {
      it('should handle 4xx response', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        const errorResp = { test: 123 };

        scope.get('/').reply(404, errorResp, {
          'Content-type': 'application/json',
        });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.REQUEST);
          expect(err.response.status).toEqual(404);
          expect(err.response.data).toEqual(errorResp);
        }

        scope.done();
      });

      it('should handle 5xx response', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        const errorResp = { test: 123 };

        scope.get('/').reply(501, errorResp, {
          'Content-type': 'application/json',
        });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.SERVER);
          expect(err.response.status).toEqual(501);
          expect(err.response.data).toEqual(errorResp);
        }

        scope.done();
      });
    });

    if (adapterName === 'xhr') {
      describe('progress event', () => {
        it('should handle upload progress', async () => {
          const progressSpy = jest
            .fn()
            .mockName('bufferData')
            .mockReturnThis();
          const buf = Buffer.alloc(1024);
          buf.fill('a');

          const options: FsRequestOptions = {
            url: `${url}/progress`,
            method: FsHttpMethod.POST,
            onProgress: progressSpy,
            data: buf,
          };

          scope.options('/progress').reply(200, 'ok', {
            'Content-type': 'application/json',
          });

          scope.post('/progress').reply(200, 'ok', {
            'Content-type': 'application/json',
          });

          const requestAdapter = new adapter();
          const res = await requestAdapter.request(options);
          // for jsdom we cannot check progress event correctly
          expect(progressSpy).toHaveBeenCalled();
        });
      });
    }

    describe('cancelToken', () => {
      it('Should throw abort request when token will be called', async () => {
        const token = new FsCancelToken();

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          cancelToken: token,
        };

        scope
          .get('/')
          .delay(2000)
          .reply(200, 'ok', {
            'Content-type': 'application/json',
          });

        setTimeout(() => {
          token.cancel();
        }, 100);

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.ABORTED);
        }
      });

      it('Should not throw undefined error when cancel token will be called after request finished', async () => {
        const token = new FsCancelToken();

        const options = {
          url: url,
          method: FsHttpMethod.GET,
          cancelToken: token,
        };

        scope.get('/').reply(200, 'ok', {
          'Content-type': 'text/plain',
        });

        const requestAdapter = new adapter();
        const res = await requestAdapter.request(options);
        token.cancel();

        expect(res.status).toEqual(200);
        expect(res.data).toEqual('ok');

        scope.done();
      });
    });

    describe('Network errors', () => {
      it('should throw an error on domain not found', async () => {
        const options = {
          url: 'https://some-badd-url.er',
          method: FsHttpMethod.GET,
        };

        const requestAdapter = new adapter();
        return expect(requestAdapter.request(options)).rejects.toEqual(expect.any(FsRequestError));
      });

      it('Should throw an FilestackError on socket abort with FsRequestErrorCode.TIMEOUTED code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          timeout: 50,
        };

        scope
          .get('/')
          .delay(2000)
          .reply(200, 'ok', {
            'Content-type': 'application/json',
          });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.TIMEOUT);
        }

        scope.done();
      });

      it('Should throw an FilestackError on response ECONNREFUSED error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNREFUSED' });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        scope.done();
      });

      it('Should throw an FilestackError on response ECONNRESET error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ECONNRESET' });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        scope.done();
      });

      it('Should throw an FilestackError on response ENOTFOUND error with FsRequestErrorCode.NETWORK code', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
        };

        scope.get('/').replyWithError({ code: 'ENOTFOUND' });

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
        }

        scope.done();
      });

      it('Should abort request on timeout', async () => {
        const options = {
          url: url,
          method: FsHttpMethod.GET,
          timeout: 1000,
        };

        scope
          .get('/')
          .delay(2000)
          .reply(200, 'ok');

        try {
          const requestAdapter = new adapter();
          await requestAdapter.request(options);

          // return error in try will not emit error
          expect(false).toEqual(true);
        } catch (err) {
          expect(err).toEqual(expect.any(FsRequestError));
          expect(err.code).toEqual(FsRequestErrorCode.TIMEOUT);
        }

        scope.done();
      });
    });
  });
};
