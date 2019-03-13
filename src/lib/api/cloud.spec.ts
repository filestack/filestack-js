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

import { CloudClient } from './cloud';
import { requestWithSource as request } from './../api/request';

const mockGet = jest.fn(() => {
  return new Promise((resolve) => {
    resolve({ data: 'test' });
  });
});

const mockPost = jest.fn(() => {
  return new Promise((resolve) => {
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
  describe('CloudClient', () => {
    const createCloudClient = (clientOptions = {}) => {
      const session = {
        'apikey': 'AJrB9kEilS1SQeHIDf3wtz',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
      };
      return new CloudClient(session, clientOptions);
    };

    it('should properly instantiate CloudClient', () => {
      const cloudClient = createCloudClient();
      expect(cloudClient).toBeDefined();
      expect(cloudClient).toBeInstanceOf(CloudClient);
    });
    it('should be able to prefetch', (done) => {
      const cloudClient = createCloudClient();
      const expectedReqParams = {
        'params': { 'apikey': 'AJrB9kEilS1SQeHIDf3wtz' },
      };
      expect.assertions(2);
      return cloudClient.prefetch().then(data => {
        expect(mockGet).toBeCalledTimes(1);
        expect(mockGet).toBeCalledWith('https://cloud.filestackapi.com/prefetch', expectedReqParams);
        done();
      });
    });
    it('should be able to list different clouds', (done) => {
      const cloudClient = createCloudClient();
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
      const expectedReqParams = { 'apikey': 'AJrB9kEilS1SQeHIDf3wtz', 'clouds': { 'dropbox': { 'path': '/' }, 'facebook': { 'path': '/' }, 'googledrive': { 'path': '/' }, 'instagram': { 'path': '/' } }, 'flow': 'web', 'token': undefined };
      expect.assertions(2);
      return cloudClient.list(clouds).then(data => {
        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith('https://cloud.filestackapi.com/folder/list', expectedReqParams);
        done();
      });
    });
  });
});
