/*
 * Copyright (c) 2018 by Filestack.
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
import { requestWithSource as request } from './../api/request';

const globalAny: any = global;

const mockGet = jest.fn().mockImplementation((url) => {
  return new Promise((resolve, reject) => {
    resolve({ data: 'test' });
  });
});

const mockPost = jest.fn().mockImplementation((url, payload) => {
  return new Promise((resolve, reject) => {
    if (payload) {
      if (payload.apikey === 'setNewTokenApiKey') {
        resolve({ data: { token: 'newToken' } });
      }
      if (payload.clouds && Object.keys(payload.clouds).length > 0) {
        if (payload.clouds.customsource) {
          resolve({ data: { customsource: 'test customSource' } });
        } else if (url === 'https://cloud.filestackapi.com/auth/logout/') {
          resolve({ data: { dropbox: 'test dropbox' } });
        }
      }
    }
    resolve({ data: 'test' });
  });
});

jest.mock('./../api/request', () => {
  return {
    requestWithSource: jest.fn(() => {
      return {
        get: mockGet,
        post: mockPost,
      };
    }),
  };
});

describe('api:cloud', () => {
  const testApiKey = 'CmrB9kEilS1SQeHIDf3wtz';
  const defaultSession = {
    'apikey': testApiKey,
    'urls': {
      'fileApiUrl': 'https://www.filestackapi.com/api/file',
      'uploadApiUrl': 'https://upload.filestackapi.com',
      'cloudApiUrl': 'https://cloud.filestackapi.com',
      'cdnUrl': 'https://cdn.filestackcontent.com',
      'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
    },
  };
  const createCloudClient = (session = defaultSession, clientOptions = {}) => {
    return new CloudClient(session, clientOptions);
  };

  it('should properly instantiate CloudClient', () => {
    const cloudClient = createCloudClient();
    expect(cloudClient).toBeDefined();
    expect(cloudClient).toBeInstanceOf(CloudClient);
  });
  describe('prefetch', () => {
    it('should be able to prefetch', (done) => {
      const cloudClient = createCloudClient();
      const expectedReqParams = {
        'params': { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz' },
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
      'facebook': {
        'path': '/',
      },
      'instagram': {
        'path': '/',
      },
      'googledrive': {
        'path': '/',
      },
      'dropbox': {
        'path': '/',
      },
    };
    it('should make a proper req when list', (done) => {
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'dropbox': { 'path': '/' }, 'facebook': { 'path': '/' }, 'googledrive': { 'path': '/' }, 'instagram': { 'path': '/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(2);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams);
        done();
      });
    });
    it('should make a proper req when list with policy & signature', (done) => {
      const session = {
        'apikey': testApiKey,
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
        'policy': 'newPolicy',
        'signature': 'newSignature',
      };
      const cloudClient = createCloudClient(session);
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'dropbox': { 'path': '/' }, 'facebook': { 'path': '/' }, 'googledrive': { 'path': '/' }, 'instagram': { 'path': '/' } }, 'flow': 'web', 'policy': 'newPolicy', 'signature': 'newSignature', 'token': undefined };
      expect.assertions(2);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams);
        done();
      });
    });
    it('should be able to set token if provided in response', (done) => {
      const session = {
        'apikey': 'setNewTokenApiKey',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js',
        },
      };
      const cloudClient = createCloudClient(session);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');
      const expectedReqParams = { 'apikey': 'setNewTokenApiKey', 'clouds': { 'dropbox': { 'path': '/' }, 'facebook': { 'path': '/' }, 'googledrive': { 'path': '/' }, 'instagram': { 'path': '/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams);
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
  });
  describe('store', () => {
    it('should be able to store file from an url', (done) => {
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/', 'store': { 'location': 's3' } } }, 'flow': 'web', 'token': undefined };
      expect.assertions(2);
      return cloudClient.store(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams);
        done();
      });
    });
    it('should be able to store file from a custom source', (done) => {
      const name = 'customsource';
      const path = '';
      const customSource = {
        customSourcePath: '/images/image2.jpg',
        customSourceContainer: 'myTestBucket',
      };
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'customsource': { 'customSourceContainer': 'myTestBucket', 'customSourcePath': '/images/image2.jpg', 'path': '', 'store': { 'location': 's3' } } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.store(name, path, {}, customSource).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams);
        expect(data).toBe('test customSource');
        done();
      });
    });
    it('should be able to store file from an url, respecting custom signature & policy', (done) => {
      const session = {
        'apikey': testApiKey,
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
        'policy': 'newPolicy',
        'signature': 'newSignature',
      };
      const options = {
        location: 'instagram',
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session, options);
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/', 'store': { 'location': 'instagram' } } }, 'flow': 'web', 'policy': 'newPolicy', 'signature': 'newSignature', 'token': undefined };
      expect.assertions(2);
      return cloudClient.store(name, path, options).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams);
        done();
      });
    });
    it('should be able to set token if provided in response', (done) => {
      const session = {
        'apikey': 'setNewTokenApiKey',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js',
        },
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');
      const expectedReqParams = { 'apikey': 'setNewTokenApiKey', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/', 'store': { 'location': 's3' } } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.store(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/store/', expectedReqParams);
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
  });
  describe('link', () => {
    it('should be able to store file from an url', (done) => {
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(2);
      return cloudClient.link(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        done();
      });
    });
    it('should be able to store file from a custom source', (done) => {
      const name = 'customsource';
      const path = '';
      const customSource = {
        customSourcePath: '/images/image2.jpg',
        customSourceContainer: 'myTestBucket',
      };
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'customsource': { 'customSourceContainer': 'myTestBucket', 'customSourcePath': '/images/image2.jpg', 'path': '' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.link(name, path, customSource).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        expect(data).toBe('test customSource');
        done();
      });
    });
    it('should be able to store file from an url, respecting custom signature & policy', (done) => {
      const session = {
        'apikey': testApiKey,
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
        'policy': 'newPolicy',
        'signature': 'newSignature',
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session);
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/' } }, 'flow': 'web', 'policy': 'newPolicy', 'signature': 'newSignature', 'token': undefined };
      expect.assertions(2);
      return cloudClient.link(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        done();
      });
    });
    it('should be able to set token if provided in response', (done) => {
      const session = {
        'apikey': 'setNewTokenApiKey',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js',
        },
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');
      const expectedReqParams = { 'apikey': 'setNewTokenApiKey', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.link(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
    it('should be able to set token if provided in response and some exists in cache', (done) => {
      globalAny.localStorage = {
        getItem: jest.fn().mockReturnValue('eXaMpLeToken'),
        setItem: jest.fn(),
      };
      const session = {
        'apikey': 'setNewTokenApiKey',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js',
        },
      };
      const options = {
        sessionCache: {
          testKey: 'testValue',
        },
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session, options);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');
      const expectedReqParams = { 'apikey': 'setNewTokenApiKey', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/' } }, 'flow': 'web', 'token': 'eXaMpLeToken' };
      expect.assertions(3);
      return cloudClient.link(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
    it('should be able to set token if provided in response and does not exists in cache', (done) => {
      globalAny.localStorage = {
        getItem: jest.fn().mockReturnValue(undefined),
        setItem: jest.fn(),
      };
      const session = {
        'apikey': 'setNewTokenApiKey',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js',
        },
      };
      const options = {
        sessionCache: {
          testKey: 'testValue',
        },
      };
      const name = 'image.jpg';
      const path = 'http://test.pl/images/';
      const cloudClient = createCloudClient(session, options);
      const setToken = jest.spyOn(cloudClient, 'token', 'set');
      const expectedReqParams = { 'apikey': 'setNewTokenApiKey', 'clouds': { 'image.jpg': { 'path': 'http://test.pl/images/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.link(name, path).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/link/', expectedReqParams);
        expect(setToken).toBeCalledWith('newToken');
        done();
      });
    });
  });
  describe('logout', () => {
    it('should make a proper request', (done) => {
      const cloudClient = createCloudClient();
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'clouds': { 'dropbox': {} }, 'flow': 'web', 'token': undefined };
      expect.assertions(3);
      return cloudClient.logout('dropbox').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/auth/logout/', expectedReqParams);
        expect(data).toBe('test dropbox');
        done();
      });
    });
    it('should clear localStorage if a name is not provided', (done) => {
      // tslint:disable-next-line
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
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'flow': 'web', 'token': 'eXaMpLeToken' };
      expect.assertions(2);
      return cloudClient.logout().then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/auth/logout/', expectedReqParams);
        done();
      });
    });
  });
  describe('metadata', () => {
    it('should make a proper request', (done) => {
      const session = {
        'apikey': testApiKey,
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
        'policy': 'newPolicy',
        'signature': 'newSignature',
      };
      const cloudClient = createCloudClient(session);
      const expectedReqParams = { 'apikey': 'CmrB9kEilS1SQeHIDf3wtz', 'policy': 'newPolicy', 'signature': 'newSignature', 'url': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg' };
      expect.assertions(2);
      return cloudClient.metadata('https://upload.wikimedia.org/wikipedia/commons/0/0e/Tree_example_VIS.jpg').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/metadata/', expectedReqParams);
        done();
      });
    });
  });
  describe('tokInit', () => {
    it('should correctly init recording process', (done) => {
      const cloudClient = createCloudClient();
      expect.assertions(2);
      return cloudClient.tokInit('video').then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/init');
        done();
      });
    });
    it('should throw error when type is incorrect', () => {
      const cloudClient = createCloudClient();
      // tslint:disable-next-line
      expect(() => { cloudClient.tokInit('wrongType') }).toThrow('Type must be one of video or audio.');
    });
  });
  describe('tokStart', () => {
    const tokApiKey = '4g1h7yy32';
    const sessionId = '1_MX40NTExNzczMn5-MTU1MjQ4OTE4Nzk3M35QcnMrSTIxRG55VWVscEtwTFlNUzBUMXZ-fg';
    it('should correctly start recording process', () => {
      const cloudClient = createCloudClient();
      const payload = { 'apikey': tokApiKey, 'session_id': sessionId };
      // tslint:disable-next-line
      cloudClient.tokStart('video', tokApiKey, sessionId);
      expect(mockPost).toBeCalledTimes(1);
      expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/start', payload);
    });
    it('should throw error when type is incorrect', () => {
      const cloudClient = createCloudClient();
      // tslint:disable-next-line
      expect(() => { cloudClient.tokStart('wrongType', tokApiKey, sessionId) }).toThrow('Type must be one of video or audio.');
    });
  });
  describe('tokStop', () => {
    const tokApiKey = '4g1h7yy32';
    const sessionId = '1_MX40NTExNzczMn5-MTU1MjQ4OTE4Nzk3M35QcnMrSTIxRG55VWVscEtwTFlNUzBUMXZ-fg';
    const archiveId = 'c023fce3-6ea5-4d45-aa68-2251d8602118';
    it('should correctly start recording process', () => {
      const cloudClient = createCloudClient();
      const payload = { 'apikey': tokApiKey, 'session_id': sessionId, 'archive_id': archiveId };
      // tslint:disable-next-line
      cloudClient.tokStop('video', tokApiKey, sessionId, archiveId);
      expect(mockPost).toBeCalledTimes(1);
      expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/recording/video/stop', payload);
    });
    it('should throw error when type is incorrect', () => {
      const cloudClient = createCloudClient();
      // tslint:disable-next-line
      expect(() => { cloudClient.tokStop('wrongType', tokApiKey, sessionId, archiveId) }).toThrow('Type must be one of video or audio.');
    });
  });
});
