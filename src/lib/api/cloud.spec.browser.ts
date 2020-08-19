/*
 * Copyright (c) 2019 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { config } from './../../config';
import { CloudClient, PICKER_KEY } from './cloud';
import * as utils from './../utils';
import * as nock from 'nock';
import { Store, STORE_TYPE } from '../utils/store';

const testApiKey = 'API_KEY';
const testTokSession = 'TOK_SESSION';
const testTokArchiveId = 'ARCHIVE_ID';

const testCloudToken = 'testCloudToken';

const testSecurity = {
  policy: 'examplePolicy',
  signature: 'exampleSignature',
};

const sessionURls = config.urls;
const testSession = {
  apikey: testApiKey,
  urls: sessionURls,
};

let scope = nock(sessionURls.cloudApiUrl);

scope.defaultReplyHeaders({
  'access-control-allow-origin': req => req.headers['origin'],
  'access-control-allow-methods': req => req.headers['access-control-request-method'],
  'access-control-allow-headers': req => req.headers['access-control-request-headers'],
  'content-type': 'application/json',
});

const mockTokInit = jest
  .fn()
  .mockName('tokInit')
  .mockReturnValue('init');

const mockTokStart = jest
  .fn()
  .mockName('tokStart')
  .mockReturnValue('start');

const mockTokStop = jest
  .fn()
  .mockName('tokStop')
  .mockReturnValue('stop');

const mockMetadata = jest
  .fn()
  .mockName('metadata')
  .mockReturnValue('metadata');

const mockList = jest
  .fn()
  .mockName('list')
  .mockImplementation(data => {
    if (data && data.clouds.token) {
      return { token: testCloudToken };
    }

    return data;
  });

const mockLogout = jest
  .fn()
  .mockName('logout')
  .mockImplementation((url, params) => {
    if (params.clouds && params.clouds.token) {
      return { token: testCloudToken };
    }

    return params;
  });

const mockStore = jest
  .fn()
  .mockName('store')
  .mockImplementation(params => {
    if (params && params.clouds && params.clouds.token) {
      return JSON.stringify({ token: testCloudToken });
    }

    return JSON.stringify(params);
  });

describe('cloud', () => {
  beforeEach(() => {
    scope
      .persist()
      .options(/.*/)
      .reply(204, '', {
        'access-control-allow-headers': 'filestack-source,filestack-trace-id,filestack-trace-span',
        'access-control-allow-methods': '*',
        'access-control-allow-origin': '*',
      });

    scope.post('/auth/logout').reply(200, mockLogout);
    scope.post('/folder/list').reply(200, (_, data) => mockList(data));
    scope.post('/store/').reply(200, (_, data) => mockStore(data));
    scope.post('/metadata').reply(200, mockMetadata);

    scope.post(/\/recording\/(audio|video)\/init/).reply(200, mockTokInit);
    scope.post(/\/recording\/(audio|video)\/start/).reply(200, mockTokStart);
    scope.post(/\/recording\/(audio|video)\/stop/).reply(200, mockTokStop);
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('cancelToken', () => {
    const testDomain = 'http://delay.filestack.test';
    let scopeD;

    beforeEach(() => {
      scopeD = nock(testDomain);

      scopeD
        .post('/store/')
        .delay(4000)
        .reply(200);
      scopeD
        .post('/folder/list')
        .delay(4000)
        .reply(200);

      scopeD
        .persist()
        .options(/.*/)
        .reply(204, '', {
          'access-control-allow-headers': 'filestack-source,filestack-trace-id,filestack-trace-span',
          'access-control-allow-methods': '*',
          'access-control-allow-origin': '*',
        });
    });

    afterEach(() => {
      nock.cleanAll();
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('Should cancel store request', done => {
      const sessionClone = JSON.parse(JSON.stringify(testSession));
      sessionClone.urls.cloudApiUrl = testDomain;

      let token = {};

      new CloudClient(sessionClone)
        .store('google', 'test', { filename: '1', location: 'gcs' }, {}, token)
        .then(() => {
          done('Request not canceled');
        })
        .catch(err => {
          expect(err).toEqual(expect.any(Error));
          done();
        });

      setTimeout(() => {
        // @ts-ignore
        token.cancel();
      }, 500);
    });

    it('Should cancel list request', done => {
      const sessionClone = JSON.parse(JSON.stringify(testSession));
      sessionClone.urls.cloudApiUrl = testDomain;

      let token = {};

      new CloudClient(sessionClone)
        .list('google', token)
        .then(() => {
          done('Request not canceled');
        })
        .catch(err => {
          expect(err).toEqual(expect.any(Error));
          done();
        });

      setTimeout(() => {
        // @ts-ignore
        token.cancel();
      }, 500);
    });
  });

  describe('facebook inapp browser', () => {
    it('should set token to sessionStore when inapp browser is detected', async () => {
      spyOn(utils, 'isFacebook').and.returnValue(true);

      const client = new CloudClient(Object.assign({}, testSession, {
        prefetch: {
          settings: {
            inapp_browser: true,
          },
          pickerOptions: {},
        },
      }));

      const token = 'test';
      client.token = token;

      const store = new Store();

      expect(store.getItem(PICKER_KEY, STORE_TYPE.SESSION)).toEqual(token);
      store.setItem(PICKER_KEY, undefined, STORE_TYPE.SESSION);
    });

    it('should get token from sessionStore when inapp browser is detected', async () => {
      spyOn(utils, 'isFacebook').and.returnValue(true);

      const client = new CloudClient(Object.assign({}, testSession, {
        prefetch: {
          settings: {
            inapp_browser: true,
          },
          pickerOptions: {},
        },
      }));

      const store = new Store();

      const token = 'test';
      store.setItem(PICKER_KEY, token, STORE_TYPE.SESSION);

      expect(client.token).toEqual(token);
      store.setItem(PICKER_KEY, undefined, STORE_TYPE.SESSION);
    });

    it('should send appurl in list action', async () => {
      const clouds = { test: true };

      const client = new CloudClient(Object.assign({}, testSession, {
        prefetch: {
          settings: {
            inapp_browser: true,
          },
          pickerOptions: {},
        },
      }));

      const res = await client.list({ ...clouds });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        appurl: 'http://localhost/?fs-tab=init',
        clouds,
        token: null,
      });
    });

    it('should send pass mimetypes to backend as string', async () => {
      const clouds = { test: true };

      const client = new CloudClient(Object.assign({}, testSession, {
        prefetch: {
          settings: {
            inapp_browser: true,
          },
          pickerOptions: {},
        },
      }));

      const res = await client.list({ ...clouds }, {}, 'image/*');

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        appurl: 'http://localhost/?fs-tab=init',
        clouds,
        token: null,
        accept: ['image/*'],
      });
    });

    it('should send pass mimetypes to backend as array', async () => {
      const clouds = { test: true };

      const client = new CloudClient(Object.assign({}, testSession, {
        prefetch: {
          settings: {
            inapp_browser: true,
          },
          pickerOptions: {},
        },
      }));

      const res = await client.list({ ...clouds }, {}, ['image/*']);

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        appurl: 'http://localhost/?fs-tab=init',
        clouds,
        token: null,
        accept: ['image/*'],
      });
    });
  });

  it('should not send app url if urlsearch params is undefined', async () => {
    const clouds = { test: true };

    const before = window.URLSearchParams;
    window.URLSearchParams = undefined;

    const client = new CloudClient(Object.assign({}, testSession, {
      prefetch: {
        settings: {
          inapp_browser: true,
        },
        pickerOptions: {},
      },
    }));

    const res = await client.list({ ...clouds });

    expect(res).toEqual({
      apikey: testApiKey,
      flow: 'web',
      clouds,
      token: null,
    });

    window.URLSearchParams = before;
  });

  describe('list', () => {
    it('should make correct list request', async () => {
      const clouds = { test: true };

      const res = await new CloudClient(testSession).list({ ...clouds });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        clouds,
      });
    });

    it('should make correct list request with session cache', async () => {
      const clouds = { test: true };
      localStorage.setItem(PICKER_KEY, testCloudToken);

      const res = await new CloudClient(testSession, {
        sessionCache: true,
      }).list({ ...clouds });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        token: testCloudToken,
        clouds,
      });
    });

    it('should set token on api token response', async () => {
      const clouds = { token: true };
      const res = await new CloudClient(testSession).list({ ...clouds });

      expect(res).toEqual({ token: testCloudToken });
    });

    it('should cache session token to local storage', async () => {
      const clouds = { token: true };

      const res = await new CloudClient(testSession, { sessionCache: true }).list({ ...clouds });

      expect(localStorage.setItem).toHaveBeenCalledWith(PICKER_KEY, testCloudToken);
      expect(res).toEqual({ token: testCloudToken });
    });

    it('should make correct list request with security', async () => {
      const clouds = { test: true };

      const res = await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).list({ ...clouds });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        clouds,
        ...testSecurity,
      });
    });
  });

  describe('store', () => {
    it('should make correct basic request', async () => {
      const res = await new CloudClient(testSession).store('google', 'test', { filename: '1' });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        clouds: {
          google: {
            path: 'test',
            store: {
              filename: '1',
              location: 's3',
            },
          },
        },
      });
    });

    it('should respect store location param', async () => {
      const res = await new CloudClient(testSession).store('google', 'test', { filename: '1', location: 'gcs' });

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        clouds: {
          google: {
            path: 'test',
            store: {
              filename: '1',
              location: 'gcs',
            },
          },
        },
      });
    });

    it('should respect store upload tags', async () => {
      const uploadTags = { testTag: 'testTag' };

      const res = await new CloudClient(testSession).store('google', 'test', {}, null, null, uploadTags);

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        upload_tags: uploadTags,
        clouds: {
          google: {
            path: 'test',
            store: {
              location: 's3',
            },
          },
        },
      });
    });

    it('should make correct basic with security', async () => {
      const res = await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).store('token', 'test', { filename: '1' });

      const excepted = {
        ...testSecurity,
        apikey: testApiKey,
        flow: 'web',
        clouds: {
          token: {
            path: 'test',
            store: {
              filename: '1',
              location: 's3',
            },
          },
        },
      };

      expect(mockStore).toHaveBeenCalledWith(excepted);
      expect(res).toEqual(testCloudToken);
    });

    it('should handle custom source', async () => {
      const customSource = {
        customSourcePath: 'cs_path',
        customSourceContainer: 'cs_container',
      };

      const res = await new CloudClient(testSession).store('customsource', 'test', { filename: '1' }, customSource);

      expect(res).toEqual({
        apikey: testApiKey,
        flow: 'web',
        clouds: {
          customsource: {
            ...customSource,
            path: 'test',
            store: {
              filename: '1',
              location: 's3',
            },
          },
        },
      });
    });
  });

  describe('logout', () => {
    it('should make correct request to logout', async () => {
      expect(await new CloudClient(testSession).logout()).toEqual({ apikey: 'API_KEY', flow: 'web' });
    });

    it('should make correct request to logout with provided cloud', async () => {
      expect(await new CloudClient(testSession).logout('google')).toEqual({ apikey: 'API_KEY', flow: 'web', clouds: { google: {} } });
    });

    it('should make correct request to logout and return correct response when cloud name is returned', async () => {
      expect(await new CloudClient(testSession).logout('token')).toEqual('testCloudToken');
    });

    it('should make correct request to logout and clean session cache ', async () => {
      localStorage.setItem(PICKER_KEY, testCloudToken);

      const res = await new CloudClient(testSession, { sessionCache: true }).logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith(PICKER_KEY);
      expect(res).toEqual({ apikey: 'API_KEY', flow: 'web', token: testCloudToken });
    });
  });

  describe('metadata', () => {
    it('should make correct request', async () => {
      const testUrl = 'http://test.com';

      const res = await new CloudClient(testSession).metadata(testUrl);

      expect(mockMetadata).toHaveBeenCalledWith(expect.any(String), {
        apikey: testApiKey,
        url: testUrl,
      });
      expect(res).toEqual('metadata');
    });

    it('should make correct request with security', async () => {
      const testUrl = 'http://test.com';

      const res = await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).metadata(testUrl);

      expect(mockMetadata).toHaveBeenCalledWith(expect.any(String), {
        apikey: testApiKey,
        url: testUrl,
        ...testSecurity,
      });
      expect(res).toEqual('metadata');
    });
  });

  describe('OpenTok', () => {
    describe('tokInit', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokInit('audio');

        expect(mockTokInit).toHaveBeenCalledWith(expect.any(String), '');
        expect(res).toEqual('init');
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokInit('audio');

        expect(mockTokInit).toHaveBeenCalledWith(expect.any(String), '');
        expect(res).toEqual('init');
      });

      it('should throw on wrong type', async () => {
        expect(() => {
          new CloudClient(testSession)
            .tokInit('videoa')
            .then(() => {
              console.log('init');
            })
            .catch(() => {
              console.log('err');
            });
        }).toThrowError();
      });
    });

    describe('tokStart', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokStart('audio', 'key', testTokSession);

        expect(mockTokStart).toHaveBeenCalledWith(expect.any(String), { apikey: 'key', session_id: testTokSession });
        expect(res).toEqual('start');
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokStart('video', 'key', testTokSession);

        expect(mockTokStart).toHaveBeenCalledWith(expect.any(String), { apikey: 'key', session_id: testTokSession });
        expect(res).toEqual('start');
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStart('videoa', 'key', testTokSession)).toThrowError();
      });
    });

    describe('tokStop', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokStop('audio', 'key', testTokSession, testTokArchiveId);

        expect(mockTokStop).toHaveBeenCalledWith(expect.any(String), {
          apikey: 'key',
          session_id: testTokSession,
          archive_id: testTokArchiveId,
        });
        expect(res).toEqual('stop');
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokStop('video', 'key', testTokSession, testTokArchiveId);

        expect(mockTokStop).toHaveBeenCalledWith(expect.any(String), {
          apikey: 'key',
          session_id: testTokSession,
          archive_id: testTokArchiveId,
        });
        expect(res).toEqual('stop');
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStop('videoa', 'key', testTokSession, testTokArchiveId)).toThrowError();
      });
    });
  });
});
