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
/* globals global */

import { CloudClient } from './cloud';
import { FilestackError } from '../../filestack_error';

const globalAny: any = global;

const mockGet = jest.fn().mockImplementation(() => Promise.resolve({ data: 'test' }));

const mockPost = jest.fn().mockImplementation((url, payload) => {
  if (payload && payload.apikey === 'setNewTokenApiKey') {
    return Promise.resolve({ data: { token: 'newToken' } });
  }

  if (payload && payload.clouds && Object.keys(payload.clouds).length > 0) {
    if (payload.clouds.customsource) {
      return Promise.resolve({ data: { customsource: 'test customSource' } });
    }

    if (url === 'https://cloud.filestackapi.com/auth/logout/') {
      return Promise.resolve({ data: { dropbox: 'test dropbox' } });
    }
  }

  return Promise.resolve({ data: 'test' });
});

jest.mock('./../api/request', () => {
  return {
    request: {
      CancelToken: {
        source: jest.fn(),
      },
    },
    requestWithSource: jest.fn(() => {
      return {
        get: mockGet,
        post: mockPost,
        CancelToken: {
          source: jest.fn(),
        },
      };
    }),
  };
});

describe('api:cloud', () => {
  const testApiKey = 'TEST_API_KEY';
  const defaultSession = {
    apikey: testApiKey,
    urls: {
      fileApiUrl: 'https://www.filestackapi.com/api/file',
      uploadApiUrl: 'https://upload.filestackapi.com',
      cloudApiUrl: 'https://cloud.filestackapi.com',
      cdnUrl: 'https://cdn.filestackcontent.com',
      pickerUrl: 'https://static.filestackapi.com/picker/1.4.4/picker.js',
    },
  };

  const createCloudClient = (session = defaultSession, clientOptions = {}) => new CloudClient(session, clientOptions);

  it('should properly instantiate CloudClient', () => {
    const cloudClient = createCloudClient();
    expect(cloudClient).toBeDefined();
    expect(cloudClient).toBeInstanceOf(CloudClient);
  });

  describe('prefetch', () => {
    it('should be able to prefetch', done => {
      const cloudClient = createCloudClient();
      const expectedReqParams = {
        params: { apikey: 'TEST_API_KEY' },
      };

      expect.assertions(2);
      return cloudClient.prefetch().then(data => {
        expect(mockGet).toBeCalledTimes(1);
        expect(mockGet).toBeCalledWith('https://cloud.filestackapi.com/prefetch', expectedReqParams);
        done();
      });
    });
  });

  describe('list', () => {
    const clouds = {
      facebook: {
        path: '/',
      },
      instagram: {
        path: '/',
      },
      googledrive: {
        path: '/',
      },
      dropbox: {
        path: '/',
      },
    };

    it('should make a proper req when list', done => {
      const cloudClient = createCloudClient();
      const expectedReqParams = {
        apikey: 'TEST_API_KEY',
        clouds,
        flow: 'web',
        token: undefined,
      };
      expect.assertions(2);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams, {});
        done();
      });
    });

    it('should make a proper req when list with policy & signature', done => {
      const session = {
        ...defaultSession,
        policy: 'newPolicy',
        signature: 'newSignature',
      };

      const cloudClient = createCloudClient(session);
      const expectedReqParams = {
        apikey: 'TEST_API_KEY',
        clouds,
        flow: 'web',
        policy: 'newPolicy',
        signature: 'newSignature',
        token: undefined,
      };

      expect.assertions(2);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams, {});
        done();
      });
    });

    it('should be able to set token if provided in response', done => {
      const session = {
        ...defaultSession,
        apikey: 'setNewTokenApiKey',
      };

      const cloudClient = createCloudClient(session);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');

      const expectedReqParams = {
        apikey: session.apikey,
        clouds,
        flow: 'web',
        token: undefined,
      };

      expect.assertions(3);

      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams, {});
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
  });

  describe('store', () => {
    it('should be able to store file from an url', done => {
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';

      const cloudClient = createCloudClient();
      const expectedReqParams = { apikey: 'TEST_API_KEY', clouds: { 'image.jpg': { path: 'http://test.pl/images/', store: { location: 's3' } } }, flow: 'web', token: undefined };

      expect.assertions(2);

      return cloudClient.store(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams, {});
        done();
      });
    });

    it('should be able to store file from a custom source', done => {
      const name = 'customsource';
      const path = '';
      const customSource = {
        customSourcePath: '/images/image2.jpg',
        customSourceContainer: 'myTestBucket',
      };

      const cloudClient = createCloudClient();
      const expectedReqParams = {
        apikey: 'TEST_API_KEY',
        clouds: { customsource: { customSourceContainer: 'myTestBucket', customSourcePath: '/images/image2.jpg', path: '', store: { location: 's3' } } },
        flow: 'web',
        token: undefined,
      };

      expect.assertions(3);

      return cloudClient.store(name, path, {}, customSource).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams, {});
        expect(data).toBe('test customSource');
        done();
      });
    });

    it('should be able to store file from an url, respecting custom signature & policy', done => {
      const session = {
        ...defaultSession,
        policy: 'newPolicy',
        signature: 'newSignature',
      };

      const options = {
        location: 'instagram',
      };

      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session, options);

      const expectedReqParams = {
        apikey: 'TEST_API_KEY',
        clouds: { 'image.jpg': { path: 'http://test.pl/images/', store: { location: 'instagram' } } },
        flow: 'web',
        policy: 'newPolicy',
        signature: 'newSignature',
        token: undefined,
      };

      expect.assertions(2);

      return cloudClient.store(name, path, options).then(() => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams, {});
        done();
      });
    });

    it('should be able to set token if provided in response', done => {
      const session = {
        ...defaultSession,
        apikey: 'setNewTokenApiKey',
      };

      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');

      const expectedReqParams = {
        apikey: session.apikey,
        clouds: { 'image.jpg': { path: 'http://test.pl/images/', store: { location: 's3' } } },
        flow: 'web',
        token: undefined,
      };

      expect.assertions(3);

      return cloudClient.store(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams, {});
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
  });

  describe('logout', () => {
    it('should make a proper request', done => {
      const cloudClient = createCloudClient();
      const expectedReqParams = { apikey: 'TEST_API_KEY', clouds: { dropbox: {} }, flow: 'web', token: undefined };
      expect.assertions(3);

      return cloudClient.logout('dropbox').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/auth/logout/', expectedReqParams);
        expect(data).toBe('test dropbox');
        done();
      });
    });

    it('should clear localStorage if a name is not provided', done => {
      globalAny.localStorage = {
        getItem: jest.fn().mockReturnValue('eXaMpLeToken'),
        removeItem: jest.fn(),
      };

      const options = {
        sessionCache: {
          testKey: 'testValue',
        },
      };

      const cloudClient = createCloudClient(defaultSession, options);
      const expectedReqParams = { apikey: 'TEST_API_KEY', flow: 'web', token: 'eXaMpLeToken' };

      expect.assertions(2);

      return cloudClient.logout().then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/auth/logout/', expectedReqParams);
        done();
      });
    });
  });

  describe('metadata', () => {
    it('should make a proper request', done => {
      const session = {
        ...defaultSession,
        policy: 'newPolicy',
        signature: 'newSignature',
      };

      const cloudClient = createCloudClient(session);
      const expectedReqParams = {
        apikey: 'TEST_API_KEY',
        policy: 'newPolicy',
        signature: 'newSignature',
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg',
      };

      expect.assertions(2);

      return cloudClient.metadata('https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/metadata/', expectedReqParams);
        done();
      });
    });
  });

  describe('tokInit', () => {
    it('should correctly init recording process', done => {
      const cloudClient = createCloudClient();

      expect.assertions(2);

      return cloudClient.tokInit('video').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/init');
        done();
      });
    });

    it('should throw an error when type is incorrect', () => {
      const cloudClient = createCloudClient();

      return expect(() => cloudClient.tokInit('wrongType')).toThrowError('Type must be one of video or audio.');
    });
  });

  describe('tokStart', () => {
    const tokApiKey = '4g1h7yy32';
    const sessionId = '1_MX40NTExNzczMn5-MTU1MjQ4OTE4Nzk3M35QcnMrSTIxRG55VWVscEtwTFlNUzBUMXZ-fg';

    it('should correctly start recording process', () => {
      const cloudClient = createCloudClient();
      const payload = { apikey: tokApiKey, session_id: sessionId };

      expect(() => cloudClient.tokStart('video', tokApiKey, sessionId)).not.toThrowError();
      expect(mockPost).toBeCalledTimes(1);
      expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/start', payload);
    });

    it('should throw an error when type is incorrect', () => {
      const cloudClient = createCloudClient();

      return expect(() => cloudClient.tokStart('wrongType', tokApiKey, sessionId)).toThrowError('Type must be one of video or audio.');
    });
  });

  describe('tokStop', () => {
    const tokApiKey = 'TOK_API_KEY';
    const sessionId = 'TOK_SESSION_ID';
    const archiveId = 'TOK_ARCHIVE_ID';

    it('should correctly start recording process', () => {
      const cloudClient = createCloudClient();
      const payload = { apikey: tokApiKey, session_id: sessionId, archive_id: archiveId };

      expect(() => cloudClient.tokStop('video', tokApiKey, sessionId, archiveId)).not.toThrowError();
      expect(mockPost).toBeCalledTimes(1);
      expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/stop', payload);
    });

    it('should throw an error when type is incorrect', () => {
      const cloudClient = createCloudClient();
      return expect(() => cloudClient.tokStop('wrongType', tokApiKey, sessionId, archiveId)).toThrowError('Type must be one of video or audio.');
    });
  });
});
