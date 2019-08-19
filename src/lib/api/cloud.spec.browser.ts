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
import unmock, { States } from 'unmock-node';

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

describe('cloud', () => {
  let states: States;
  beforeAll(() => {
    states = unmock.on();
  });
  beforeEach(() => {
    states.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    unmock.off();
  });

  describe('prefetch', () => {
    it('should make correct request to api', async () => {
      const expectedPrefetchResponse = 'prefetch';
      const mockPrefetchGet = jest.fn().mockImplementationOnce(() => expectedPrefetchResponse);
      states.filestackApi.get('/prefetch', mockPrefetchGet);

      const res = await new CloudClient(testSession).prefetch();

      const expectedRequest = { body: undefined, method: 'GET' };
      expect(mockPrefetchGet)
        .toHaveBeenCalledWith(
          expect.objectContaining(expectedRequest),
          expect.anything()
        );
      expect(res).toEqual(expectedPrefetchResponse);
    });
  });

  describe('list', () => {
    const expectedRequestBase = { apikey: testApiKey, clouds: { test: true }, flow: 'web' };
    beforeEach(() => states.reset());
    it('should make correct list request', async () => {
      const clouds = { test: true };
      const mockFolderListPost = jest.fn().mockImplementationOnce(_ => {
        return { token: testCloudToken };
      });
      states.filestackApi.post('/folder/list', mockFolderListPost);
      await new CloudClient(testSession).list({ ...clouds });

      expect(mockFolderListPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequestBase }), expect.anything()
        );
    });

    it('should make correct list request with session cache', async () => {
      const clouds = { test: true };
      localStorage.setItem(PICKER_KEY, testCloudToken);

      const mockFolderListPost = jest.fn().mockImplementationOnce(() => {
        return { token: testCloudToken };
      });
      states.filestackApi.post('/folder/list', mockFolderListPost);

      await new CloudClient(testSession, {
        sessionCache: true,
      }).list({ ...clouds });

      expect(mockFolderListPost)
        .toHaveBeenCalledWith(
          expect.objectContaining(
            { body: { ...expectedRequestBase, token: testCloudToken } }
          ),
          expect.anything()
        );
    });

    it('should set token on api token response', async () => {
      const clouds = { token: true };
      states.filestackApi.post('/folder/list', { token: testCloudToken });
      const res = await new CloudClient(testSession).list({ ...clouds });

      expect(res).toHaveProperty('token', testCloudToken);
    });

    it('should cache session token to local storage', async () => {
      const clouds = { token: true };
      states.filestackApi.post('/folder/list', { token: testCloudToken });
      await new CloudClient(testSession, { sessionCache: true }).list({ ...clouds });

      expect(localStorage.setItem).toHaveBeenCalledWith(PICKER_KEY, testCloudToken);
    });

    it('should make correct list request with security', async () => {
      const clouds = { test: true };

      const mockFolderListPost = jest.fn().mockImplementationOnce(() => {
        return { token: testCloudToken };
      });
      states.filestackApi.post('/folder/list', mockFolderListPost);

      await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).list({ ...clouds });

      const expectedRequestBody = { ...expectedRequestBase, ...testSecurity };

      expect(mockFolderListPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequestBody }),
          expect.anything()
        );
    });
  });

  describe('store', () => {
    const expectedRequestBase = { apikey: testApiKey, flow: 'web' };
    it('store should make correct basic request', async () => {
      const mockStorePost = jest.fn().mockImplementationOnce(() => ({ message: 'Boo' }));
      states.filestackApi.post('/store/', mockStorePost);
      await new CloudClient(testSession).store('google', 'test', { filename: '1' });

      const expectedRequest = {
        ...expectedRequestBase,
        clouds: {
          google: {
            path: 'test',
            store: {
              filename: '1',
              location: 's3',
            },
          },
        },
      };

      expect(mockStorePost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequest }), expect.anything()
        );
    });

    it('should respect store location param', async () => {
      const mockStorePost = jest.fn().mockImplementationOnce(() => ({ message: 'Boo' }));
      states.filestackApi.post('/store/', mockStorePost);

      await new CloudClient(testSession).store('google', 'test', { filename: '1', location: 'gcs' });

      const expectedRequest = {
        ...expectedRequestBase,
        clouds: {
          google: {
            path: 'test',
            store: {
              filename: '1',
              location: 'gcs',
            },
          },
        },
      };

      expect(mockStorePost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequest }), expect.anything()
        );
    });

    it('should make correct basic request with security', async () => {
      const mockStorePost = jest.fn().mockImplementationOnce(() => ({ message: 'Boo' }));
      states.filestackApi.post('/store/', mockStorePost);

      await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).store('token', 'test', { filename: '1' });

      const expectedRequest = {
        ...expectedRequestBase,
        clouds: {
          token: {
            path: 'test',
            store: {
              filename: '1',
              location: 's3',
            },
          },
        },
        ...testSecurity,
      };

      expect(mockStorePost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequest }), expect.anything());
    });

    it('should handle custom source', async () => {
      const mockStorePost = jest.fn().mockImplementationOnce(() => ({ message: 'Boo' }));
      states.filestackApi.post('/store/', mockStorePost);

      const customSource = {
        customSourcePath: 'cs_path',
        customSourceContainer: 'cs_container',
      };

      await new CloudClient(testSession).store('customsource', 'test', { filename: '1' }, customSource);

      const expectedRequest = {
        ...expectedRequestBase,
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
      };
      expect(mockStorePost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequest }), expect.anything()
        );
    });
  });

  describe('logout', () => {
    const expectedRequestBase = { apikey: testApiKey, flow: 'web' };
    it('should make correct request to logout', async () => {
      const mockLogoutPost = jest.fn();
      states.filestackApi.post('/auth/logout', mockLogoutPost);
      await new CloudClient(testSession).logout();
      expect(mockLogoutPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: expectedRequestBase }),
          expect.anything()
        );
    });

    it('should make correct request to logout with provided cloud', async () => {
      const mockLogoutPost = jest.fn();
      states.filestackApi.post('/auth/logout', mockLogoutPost);
      await new CloudClient(testSession).logout('google');
      expect(mockLogoutPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({ body: { ...expectedRequestBase, clouds: { google: {} } } }),
          expect.anything()
        );
    });

    it('should make correct request to logout and return correct response when cloud name is returned', async () => {
      const mockLogoutPost = jest.fn().mockImplementationOnce(() => ({ token: testCloudToken }));
      states.filestackApi.post('/auth/logout', mockLogoutPost);
      const res = await new CloudClient(testSession).logout('token');
      expect(res).toEqual(testCloudToken);
    });

    it('should make correct request to logout and clean session cache ', async () => {
      localStorage.setItem(PICKER_KEY, testCloudToken);

      const mockLogoutPost = jest.fn();
      states.filestackApi.post('/auth/logout', mockLogoutPost);

      await new CloudClient(testSession, { sessionCache: true }).logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith(PICKER_KEY);
      expect(mockLogoutPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            body: { ...expectedRequestBase, token: testCloudToken },
          }),
          expect.anything()
        );
    });
  });

  describe('metadata', () => {
    const testUrl = 'http://test.com';
    const expectedRequestBase = { apikey: testApiKey, url: testUrl };
    it('should make correct request', async () => {
      const mockMetadataPost = jest.fn().mockImplementationOnce(() => 'metadata');
      states.filestackApi.post('/metadata', mockMetadataPost);
      const res = await new CloudClient(testSession).metadata(testUrl);

      expect(mockMetadataPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            body: expectedRequestBase,
          }),
          expect.anything()
        );
      expect(res).toBe('metadata');
    });

    it('should make correct request with security', async () => {

      const mockMetadataPost = jest.fn().mockImplementationOnce(() => 'metadata');
      states.filestackApi.post('/metadata', mockMetadataPost);

      await new CloudClient({
        ...testSession,
        ...testSecurity,
      }).metadata(testUrl);

      expect(mockMetadataPost)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            body: { ...expectedRequestBase, ...testSecurity },
          }),
          expect.anything()
     );
    });
  });

  describe('OpenTok', () => {
    describe('tokInit', () => {
      it('should make correct request to api audio', async () => {
        const mockTokInit = jest.fn().mockImplementationOnce(() => 'init');
        states.filestackApi.post('/recording/audio/init', mockTokInit);
        const res = await new CloudClient(testSession).tokInit('audio');

        expect(mockTokInit)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: undefined,
            }),
            expect.anything()
          );
        expect(res).toEqual('init');
      });

      it('should make correct request to api video', async () => {
        const mockTokInit = jest.fn();
        states.filestackApi.post('/recording/video/init', mockTokInit);

        await new CloudClient(testSession).tokInit('video');

        expect(mockTokInit)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: undefined,
            }),
            expect.anything()
          );
      });

      it('tokInit should throw on wrong type', async () => {
        expect(() =>
          new CloudClient(testSession)
            .tokInit('videoa')
        ).toThrowError('Type must be');
      });
    });

    describe('tokStart', () => {
      const expectedRequest = { apikey: testApiKey, session_id: testTokSession };
      it('should make correct request to api audio', async () => {
        const mockTokStart = jest.fn().mockImplementationOnce(() => 'start');
        states.filestackApi.post('/recording/audio/start', mockTokStart);
        const res = await new CloudClient(testSession).tokStart('audio', testApiKey, testTokSession);
        expect(mockTokStart)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: expectedRequest,
            }),
            expect.anything());
        expect(res).toEqual('start');
      });

      it('should make correct request to api video', async () => {
        const mockTokStart = jest.fn();
        states.filestackApi.post('/recording/video/start', mockTokStart);
        await new CloudClient(testSession).tokStart('video', testApiKey, testTokSession);

        expect(mockTokStart)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: expectedRequest,
            }),
            expect.anything());
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStart('videoa', testApiKey, testTokSession)).toThrowError('Type must be');
      });
    });

    describe('tokStop', () => {
      const expectedRequest = { apikey: testApiKey, session_id: testTokSession, archive_id: testTokArchiveId };
      it('should make correct request to api audio', async () => {
        const mockTokStop = jest.fn().mockImplementationOnce(() => 'stop');
        states.filestackApi.post('/recording/audio/stop', mockTokStop);
        const res = await new CloudClient(testSession).tokStop('audio', testApiKey, testTokSession, testTokArchiveId);

        expect(mockTokStop)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: expectedRequest,
            }),
            expect.anything());
        expect(res).toEqual('stop');
      });

      it('should make correct request to api video', async () => {
        const mockTokStop = jest.fn();
        states.filestackApi.post('/recording/video/stop', mockTokStop);
        await new CloudClient(testSession).tokStop('video', testApiKey, testTokSession, testTokArchiveId);

        expect(mockTokStop)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              body: expectedRequest,
            }),
            expect.anything()
          );
      });

      it('should throw on wrong type', () => {
        expect(() => new CloudClient(testSession).tokStop('videoa', 'key', testTokSession, testTokArchiveId)).toThrowError('Type must be');
      });
    });
  });
});
