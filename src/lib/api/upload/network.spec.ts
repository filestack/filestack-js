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

import { getFormData, start } from './network';

import * as FormData from 'form-data';
import { Status, FileObj } from './types';
import { requestWithSource } from '../request';

jest.mock('../request');
jest.mock('form-data');

const testUploadConfig = {
  apikey: 'testkey',
  store: {
    testStore: 1,
  },
  concurrency: 1,
  partSize: 100,
  retryFactor: 0,
  retryMaxTime: 100,
  progressInterval: 100,
};

describe('Network', () => {
  afterEach(() => {
    FormData.mockClear();
  });

  describe('getFormData', () => {
    it('should parse correct basic params', () => {
      const fields = {
        apikey: 'test',
        part: 1,
      };

      getFormData(fields, testUploadConfig);
      expect(FormData.prototype.append).toHaveBeenCalledWith('apikey', 'test');
      expect(FormData.prototype.append).toHaveBeenCalledWith('part', 1);
      expect(FormData.prototype.append).toHaveBeenCalledWith('testStore', 1);

      expect(FormData.prototype.append).toHaveBeenCalledTimes(3);
    });

    it('should parse correct complex params', () => {
      const fields = {
        apikey: 'test',
        part: 1,
        workflowsUi: ['test', 'test2'],
      };

      getFormData(fields, Object.assign({}, testUploadConfig, {
        store: {
          test: { test1: 1 },
        },
      }));

      expect(FormData.prototype.append).toHaveBeenCalledWith('apikey', 'test');
      expect(FormData.prototype.append).toHaveBeenCalledWith('part', 1);
      expect(FormData.prototype.append).toHaveBeenCalledWith('workflowsUi', JSON.stringify(['test', 'test2']));
      expect(FormData.prototype.append).toHaveBeenCalledWith('test', JSON.stringify({ test1: 1 }));

      expect(FormData.prototype.append).toHaveBeenCalledTimes(4);
    });
  });

  describe('start', () => {
    const uploadConfig = {
      host: 'fakeHost',
      apikey: 'fakeApikey',
      partSize: 6 * 1024 * 1024,
      concurrency: 3,
      progressInterval: 1000,
      retry: 10,
      retryFactor: 2,
      retryMaxTime: 15000,
      customName: null,
      mimetype: null,
      store: {},
      timeout: 120000,
    };

    const initialState = {
      parts: {},
      progressTick: null,
      previousPayload: null,
      retries: {},
      status: Status.INIT,
    };

    const testFileObj = {
      buffer: Buffer.from('asd'),
      name: 'test',
      size: 1,
      type: 'text/plain',
    } as FileObj;

    it('should make correct start request', async () => {
      const mockedMethod = jest.fn(() => Promise.resolve({ data: {} }));
      // @ts-ignore
      requestWithSource.mockImplementation(() => {
        return {
          post: mockedMethod,
        };
      });

      await start({
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('size', 1);
      expect(FormData.prototype.append).toHaveBeenCalledWith('apikey', 'fakeApikey');
      expect(FormData.prototype.append).toHaveBeenCalledWith('mimetype', 'text/plain');
      expect(FormData.prototype.append).toHaveBeenCalledWith('filename', 'test');

      expect(FormData.prototype.append).toHaveBeenCalledTimes(4);

      expect(mockedMethod).toHaveBeenCalledWith('fakeHost/multipart/start', expect.any(FormData), { headers: undefined, timeout: 120000 });
    });

    it('should add multipart param on config inteligent', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          intelligent: true,
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('multipart', true);
    });

    it('should respect config policy and signature and add it to formData', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          policy: 'policy',
          signature: 'signature',
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('signature', 'signature');
      expect(FormData.prototype.append).toHaveBeenCalledWith('policy', 'policy');
    });

    it('should respect customName provided in config', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          customName: 'customName',
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('filename', 'customName');
    });

    it('should respect overwrite of mimetype', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          mimetype: 'mimetype',
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('mimetype', 'mimetype');
    });

    it('should set mimetype to "application/octet-stream" when no mimetype is provided', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          mimetype: null,
        }),
        state: initialState,
        file: Object.assign({}, testFileObj, {
          type: null,
        }),
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('mimetype', 'application/octet-stream');
    });

  });

  describe('getS3PartData', () => {

  });

  describe('uploadToS3', () => {

  });

  describe('complete', () => {

  });
});
