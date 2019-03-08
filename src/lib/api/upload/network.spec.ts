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
        `${uploadConfig.host}/multipart/start`,
        {
          apikey: uploadConfig.apikey,
          filename: testFileObj.name,
          mimetype: testFileObj.type,
          size: testFileObj.size,
        },
        { timeout: uploadConfig.timeout }
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
        `${uploadConfig.host}/multipart/start`,
        {
          apikey: uploadConfig.apikey,
          filename: testFileObj.name,
          mimetype: testFileObj.type,
          multipart: true,
          size: testFileObj.size,
        },
        { timeout: uploadConfig.timeout }
      );
    });

    it('should respect config policy and signature and add it to formData', async () => {
      const security = {
        policy: 'policy',
        signature: 'signature',
      };

      await start({
        config: Object.assign({}, uploadConfig, security),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        `${uploadConfig.host}/multipart/start`,
        {
          apikey: uploadConfig.apikey,
          filename: testFileObj.name,
          mimetype: testFileObj.type,
          size: testFileObj.size,
          ...security,
        },
        { timeout: uploadConfig.timeout }
      );
    });

    it('should respect customName provided in config', async () => {
      const customName = 'customName';

      await start({
        config: Object.assign({}, uploadConfig, {
          customName,
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        `${uploadConfig.host}/multipart/start`,
        {
          apikey: uploadConfig.apikey,
          filename: customName,
          mimetype: testFileObj.type,
          size: testFileObj.size,
        },
        { timeout: uploadConfig.timeout }
      );
    });

    it('should respect overwrite of mimetype', async () => {
      const mimetype = 'test/mimetype';

      await start({
        config: Object.assign({}, uploadConfig, {
          mimetype,
        }),
        state: initialState,
        file: testFileObj,
      });

      expect(multipart).toHaveBeenCalledWith(
        `${uploadConfig.host}/multipart/start`,
        {
          apikey: uploadConfig.apikey,
          filename: testFileObj.name,
          mimetype: mimetype,
          size: testFileObj.size,
        },
        { timeout: uploadConfig.timeout }
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
        `${uploadConfig.host}/multipart/start`,
        { apikey: uploadConfig.apikey, filename: testFileObj.name, mimetype: 'application/octet-stream', size: testFileObj.size },
        { timeout: uploadConfig.timeout }
      );
    });
  });

  describe('getS3PartData', () => {
    it('Should make correct request to get s3 data part', async () => {
      const fakeHost = 'fakeHost';

      await getS3PartData(partObj, {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_url: fakeHost,
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        `https://${fakeHost}/multipart/upload`,
        { apikey: uploadConfig.apikey, part: 2, size: 1, location_url: fakeHost },
        { headers: {}, timeout: uploadConfig.timeout }
      );
    });

    it('Should make correct request to get s3 data part and location provided', async () => {
      const fakeHost = 'fakeHost';
      const fakeRegion = 'fakeRegion';

      await getS3PartData(partObj, {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_region: fakeRegion,
          location_url: fakeHost,
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        `https://${uploadConfig.host}/multipart/upload`,
        { apikey: uploadConfig.apikey, part: partObj.number + 1, size: partObj.size, location_region: fakeRegion, location_url: fakeHost },
        {
          headers: {
            'Filestack-Upload-Region': fakeRegion,
          },
          timeout: uploadConfig.timeout,
        }
      );
    });

    it('Should make correct request with part offset (inteligent ingession)', async () => {
      const fakeHost = 'fakeHost';
      const fakeRegion = 'fakeRegion';
      const offset = 0;

      await getS3PartData(Object.assign({}, partObj, { offset }), {
        config: uploadConfig,
        state: initialState,
        file: testFileObj,
        params: {
          location_url: fakeHost,
          location_region: fakeRegion,
        },
      });

      expect(multipart).toHaveBeenCalledWith(
        `https://${fakeHost}/multipart/upload`,
        { apikey: uploadConfig.apikey, part: partObj.number + 1, size: partObj.size, multipart: true, offset: offset, location_region: fakeRegion, location_url: fakeHost },
        {
          headers: {
            'Filestack-Upload-Region': fakeRegion,
          },
          timeout: uploadConfig.timeout,
        }
      );
    });
  });

  describe('uploadToS3', () => {
    it('should make correct put request to given host', async () => {
      const prog = jest.fn();
      const file = new ArrayBuffer(1);

      const fakeHost = 'fakeHost';
      const fakeHeaders = { test: 1 };

      await uploadToS3(file, { url: fakeHost, headers: fakeHeaders }, prog, uploadConfig);

      expect(request.put).toHaveBeenCalledWith(fakeHost, file, {
        headers: fakeHeaders,
        timeout: uploadConfig.timeout,
        onUploadProgress: prog,
      });
    });

    it('should set timeout based on file size if', async () => {
      const prog = jest.fn();
      const file = new ArrayBuffer(1);

      const fakeHost = 'fakeHost';
      const fakeHeaders = { test: 1 };

      await uploadToS3(file, { url: fakeHost, headers: fakeHeaders }, prog, Object.assign({}, uploadConfig, { timeout: null }));

      expect(request.put).toHaveBeenCalledWith(fakeHost, file, {
        headers: fakeHeaders,
        timeout: 1000,
        onUploadProgress: prog,
      });
    });
  });

  describe('complete', () => {});
});
