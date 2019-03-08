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

import { start, getS3PartData, uploadToS3 } from './network';
import { Status, FileObj } from './types';
import { multipart, request } from '../request';

jest.mock('../request');

describe('Network', () => {
  afterEach(() => {
    // @ts-ignore
    multipart.mockClear();
  });

  const partObj = {
    buffer: Buffer.from('test'),
    chunks: [],
    chunkSize: 1,
    intelligentOverride: false,
    loaded: 1,
    number: 1,
    request: null,
    size: 1,
  };

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

  describe('start', () => {
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
        { timeout: 120000 }
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
        { timeout: 120000 }
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
        { timeout: 120000 }
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
        { timeout: 120000 }
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
        { timeout: 120000 }
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
        { timeout: 120000 }
      );
    });
  });

  describe('getS3PartData', () => {
    it('Should make correct request to get s3 data part', async () => {
      await getS3PartData(partObj, {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_url: 'fakeHost',
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        'https://fakeHost/multipart/upload',
        { apikey: 'fakeApikey', md5: undefined, part: 2, size: 1, location_url: 'fakeHost' },
        { headers: {}, timeout: 120000 }
      );
    });

    it('Should make correct request to get s3 data part and location provided', async () => {
      await getS3PartData(partObj, {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_region: 'test',
          location_url: 'fakeHost',
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        'https://fakeHost/multipart/upload',
        { apikey: 'fakeApikey', md5: undefined, part: 2, size: 1, location_region: 'test', location_url: 'fakeHost' },
        {
          headers: {
            'Filestack-Upload-Region': 'test',
          },
          timeout: 120000,
        }
      );
    });

    it('Should make correct request with part offset (inteligent ingesion)', async () => {
      await getS3PartData(Object.assign({}, partObj, { offset: 0 }), {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_url: 'fakeHost',
          location_region: 'test',
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        'https://fakeHost/multipart/upload',
        { apikey: 'fakeApikey', md5: undefined, part: 2, size: 1, multipart: true, offset: 0, location_region: 'test', location_url: 'fakeHost' },
        {
          headers: {
            'Filestack-Upload-Region': 'test',
          },
          timeout: 120000,
        }
      );
    });
  });

  describe('uploadToS3', () => {
    it('should make correct put request to given host', async () => {
      const prog = jest.fn();
      const file = new ArrayBuffer(1);

      await uploadToS3(file, { url: 'fakeHost', headers: { test: 1 } }, prog, uploadConfig);

      expect(request.put).toHaveBeenCalledWith(
        'fakeHost',
        file,
        {
          headers: { test: 1 },
          timeout: uploadConfig.timeout,
          onUploadProgress: prog,
        }
      );
    });

    it('should set timeout based on file size if', async () => {
      const prog = jest.fn();
      const file = new ArrayBuffer(1);

      await uploadToS3(file, { url: 'fakeHost', headers: { test: 1 } }, prog, Object.assign({}, uploadConfig, { timeout: null }));

      expect(request.put).toHaveBeenCalledWith(
        'fakeHost',
        file,
        {
          headers: { test: 1 },
          timeout: 1000,
          onUploadProgress: prog,
        }
      );
    });
  });

  describe('complete', () => {});
});
