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

import { start } from './network';
import { Status, FileObj } from './types';
import { multipart } from '../request';

jest.mock('../request');

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
    // @ts-ignore
    multipart.mockClear();
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
      await start({
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        {
          apikey: 'fakeApikey',
          filename: 'test',
          mimetype: 'text/plain',
          size: 1,
        },
        { headers: undefined, timeout: 120000 }
      );
    });

    it('should add multipart param on config inteligent', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          intelligent: true,
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        {
          apikey: 'fakeApikey',
          filename: 'test',
          mimetype: 'text/plain',
          multipart: true,
          size: 1,
        },
        { headers: undefined, timeout: 120000 }
      );
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

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        {
          apikey: 'fakeApikey',
          filename: 'test',
          mimetype: 'text/plain',
          policy: 'policy',
          signature: 'signature',
          size: 1,
        },
        { headers: undefined, timeout: 120000 }
      );
    });

    it('should respect customName provided in config', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          customName: 'customName',
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        {
          apikey: 'fakeApikey',
          filename: 'customName',
          mimetype: 'text/plain',
          size: 1,
        },
        { headers: undefined, timeout: 120000 }
      );
    });

    it('should respect overwrite of mimetype', async () => {
      await start({
        config: Object.assign({}, uploadConfig, {
          mimetype: 'mimetype',
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        {
          apikey: 'fakeApikey',
          filename: 'test',
          mimetype: 'mimetype',
          size: 1,
        },
        { headers: undefined, timeout: 120000 }
      );
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

      expect(multipart).toHaveBeenCalledWith(
        'fakeHost/multipart/start',
        { apikey: 'fakeApikey', filename: 'test', mimetype: 'application/octet-stream', size: 1 },
        { headers: undefined, timeout: 120000 }
      );
    });
  });

  describe('getS3PartData', () => {
    it('Should make correct request to get s3 data part', async () => {
      console.log(123);
    });
  });

  describe('uploadToS3', () => {});

  describe('complete', () => {});
});
