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
import * as nock from 'nock';

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

const mockPrefetch = jest
  .fn()
  .mockName('prefetch')
  .mockReturnValue('prefetch');

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
  .mockImplementation((url, data) => {
    const params = data ? JSON.parse(data) : {};

    if (data && params.clouds && params.clouds.token) {
      return { token: testCloudToken };
    }

    return data;
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

    scope
      .get('/prefetch')
      .query({ apikey: testApiKey })
      .reply(200, mockPrefetch);

    scope.post('/auth/logout/').reply(200, mockLogout);
    scope.post('/folder/list').reply(200, (_, data) => mockList(JSON.parse(data)));
    scope.post('/store/').reply(200, (_, data) => mockStore(JSON.parse(data)));
    scope.post('/metadata/').reply(200, mockMetadata);

    scope.post(/\/recording\/(audio|video)\/init/).reply(200, mockTokInit);
    scope.post(/\/recording\/(audio|video)\/start/).reply(200, mockTokStart);
    scope.post(/\/recording\/(audio|video)\/stop/).reply(200, mockTokStop);
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('prefetch', () => {
    it('should make correct request to api', async () => {
      const res = await new CloudClient(testSession).prefetch();

      expect(mockPrefetch).toHaveBeenCalledWith(expect.any(String), '');
      expect(res).toEqual('prefetch');
    });
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

      expect(mockMetadata).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({
          apikey: testApiKey,
          url: testUrl,
        })
      );
      expect(res).toEqual('metadata');
    });

    it('should make correct request with security', async () => {
      const testUrl = 'http://test.com';

      const res = await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).metadata(testUrl);

      expect(mockMetadata).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify({
          apikey: testApiKey,
          url: testUrl,
          ...testSecurity,
        })
      );
      expect(res).toEqual('metadata');
    });
  });

  describe('OpenTok', () => {
    describe('tokInit', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokInit('audio');

        expect(mockTokInit).toHaveBeenCalledWith(expect.any(String), '');
        expect(res).toEqual({ body: 'init' });
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokInit('audio');

        expect(mockTokInit).toHaveBeenCalledWith(expect.any(String), '');
        expect(res).toEqual({ body: 'init' });
      });

      it('should throw on wrong type', () => {
        expect(() => {
          new CloudClient(testSession).tokInit('videoa');
        }).toThrowError();
      });
    });

    describe('tokStart', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokStart('audio', 'key', testTokSession);

        expect(mockTokStart).toHaveBeenCalledWith(expect.any(String), JSON.stringify({ apikey: 'key', session_id: testTokSession }));
        expect(res).toEqual({ body: 'start' });
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokStart('video', 'key', testTokSession);

        expect(mockTokStart).toHaveBeenCalledWith(expect.any(String), JSON.stringify({ apikey: 'key', session_id: testTokSession }));
        expect(res).toEqual({ body: 'start' });
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStart('videoa', 'key', testTokSession)).toThrowError();
      });
    });

    describe('tokStop', () => {
      it('should make correct request to api (audio)', async () => {
        const res = await new CloudClient(testSession).tokStop('audio', 'key', testTokSession, testTokArchiveId);

        expect(mockTokStop).toHaveBeenCalledWith(
          expect.any(String),
          JSON.stringify({
            apikey: 'key',
            session_id: testTokSession,
            archive_id: testTokArchiveId,
          })
        );
        expect(res).toEqual({ body: 'stop' });
      });

      it('should make correct request to api (video)', async () => {
        const res = await new CloudClient(testSession).tokStop('video', 'key', testTokSession, testTokArchiveId);

        expect(mockTokStop).toHaveBeenCalledWith(
          expect.any(String),
          JSON.stringify({
            apikey: 'key',
            session_id: testTokSession,
            archive_id: testTokArchiveId,
          })
        );
        expect(res).toEqual({ body: 'stop' });
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStop('videoa', 'key', testTokSession, testTokArchiveId)).toThrowError();
      });
    });
  });
});
