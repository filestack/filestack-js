/*
 * Copyright (c) 2019 by Filestack.
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

import { S3Uploader } from './s3';
import { File } from './../file';
import * as nock from 'nock';
import axios from 'axios';
import * as request from './../../request';
import { UploadMode, DEFAULT_STORE_LOCATION, INTELLIGENT_CHUNK_SIZE, DEFAULT_PART_SIZE } from './abstract';

const testBufferSize = 1024 * 1024 * 9;
const testSmallBufferSize = 1024 * 1024 * 2;
let testBuff = Buffer.alloc(testBufferSize).fill('t', 0, testBufferSize);
let smallTestBuff = Buffer.alloc(testSmallBufferSize).fill('t', 0, testSmallBufferSize);

let scope;
let interceptorS3;
let interceptorStart;
let interceptorCommit;
let interceptorUpload;
let interceptorComplete;

const getTestFile = () =>
  new File({
    buffer: testBuff,
    type: 'text/plain',
    // @ts-ignore
    size: testBuff.length,
    name: 'test.txt',
  });

const getSmallTestFile = () =>
  new File({
    buffer: smallTestBuff,
    type: 'text/plain',
    // @ts-ignore
    size: smallTestBuff.length,
    name: 'test.txt',
  });

const testApikey = 'testapikey';
const testHost = 'https://filestack-test.com';
const mockUploadId = '123132123';
const mockRegion = 'test-region';
const mockedUri = '/sometest';
const s3Url = testHost + '/fakes3';

const mockStart = jest.fn().mockName('multipart/start');
const mockUpload = jest.fn().mockName('multipart/upload');
const mockPut = jest.fn().mockName('s3/put');
const mockCommit = jest.fn().mockName('multipart/commit');
const mockComplete = jest.fn().mockName('multipart/complete');

const s3Callback = function(url) {
  return mockPut(url, this.req.headers);
};

let complete202 = false;

describe.only('Api/Upload/Uploaders/S3', () => {
  beforeAll(() => {
    // @todo remove after multipart will be updated
    spyOn(request, 'multipart').and.callFake((url, fields, config, retryConfig) => {
      let instance = axios.create();

      if (retryConfig) {
        request.useRetryPolicy(instance, retryConfig);
      }

      return instance.post(url, fields, config);
    });
  });

  beforeEach(() => {
    scope = nock(testHost);
    scope.persist();

    interceptorStart = scope.post('/multipart/start');
    interceptorUpload = scope.post('/multipart/upload');
    interceptorCommit = scope.post('/multipart/commit');
    interceptorComplete = scope.post('/multipart/complete');
    interceptorS3 = scope.put('/fakes3');

    interceptorStart.reply(200, (_, data) => mockStart(JSON.parse(data)));
    interceptorUpload.twice().reply(200, (_, data) => mockUpload(JSON.parse(data)));
    interceptorCommit.reply(200, (_, data) => mockCommit(JSON.parse(data)));
    interceptorComplete.reply(200, (_, data) => mockComplete(JSON.parse(data)));
    interceptorS3.twice().reply(201, s3Callback, { etag: 'test' });

    mockStart.mockReturnValue({
      uri: mockedUri,
      region: mockRegion,
      upload_id: mockUploadId,
      location_url: testHost,
    });

    mockUpload.mockReturnValue({
      url: s3Url,
      headers: {
        test: 'test',
      },
      location_url: testHost,
    });

    mockPut.mockReturnValue({});
    mockCommit.mockReturnValue({});

    mockComplete.mockReturnValue({
      handle: 'test_handle',
      url: 'test_url',
      filename: 'test_filename',
      size: 123,
      mimetype: 'test_mimetype',
      status: 'test_status',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    jest.clearAllMocks();
  });

  describe('Standart tests', () => {
    it('should initialize class without errors', () => {
      expect(() => {
        const u = new S3Uploader({});
      }).not.toThrowError();
    });

    it('Should allow adding files', () => {
      const u = new S3Uploader({});
      u.addFile(getTestFile());
    });

    it('Should retry complete request on 202 status code', async () => {
      const mock202 = jest
        .fn()
        .mockName('202 mock')
        .mockReturnValue('');

      nock.removeInterceptor(interceptorComplete);
      scope.persist(false);
      scope.post('/multipart/complete').reply(202, () => mock202());
      scope.post('/multipart/complete').reply(200, (_, data) => mockComplete(JSON.parse(data)));

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      expect(mock202).toHaveBeenCalledTimes(1);
      expect(mockComplete).toHaveBeenCalledTimes(1);
    });

    it('Should respect provided store options and add prefix to them', async () => {
      const storeOption = {
        container: 'test',
      };

      const u = new S3Uploader(storeOption);
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      const testFile = getSmallTestFile();
      expect(mockStart).toHaveBeenCalledWith({
        filename: testFile.name,
        mimetype: testFile.mimetype,
        size: testFile.size,
        store_container: storeOption.container,
        store_location: DEFAULT_STORE_LOCATION,
        apikey: testApikey,
      });
    });

    it('Should add https protocol to location_url', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost.replace('https://', ''),
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      expect(mockPut).toHaveBeenCalled();
    });

    it('Should add Filestack-Upload-Region header on location_region param', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_region: 'test',
        location_url: testHost.replace('https://', ''),
      });

      interceptorUpload.reply(200, function(_, data) {
        return mockUpload(JSON.parse(data), this.req.headers);
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      const testFile = getSmallTestFile();
      expect(mockUpload).toHaveBeenCalledWith(
        {
          md5: testFile.md5,
          size: testFile.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          part: 1,
        },
        expect.objectContaining({ 'filestack-upload-region': 'test' })
      );

      expect(mockPut).toHaveBeenCalled();
    });

    it('Should respect pause() and resume() command', async () => {
      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      setImmediate(() => u.pause());
      setTimeout(() => u.resume(), 10);

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');
    });


    it('Should respect abort() command', (done) => {
      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      setImmediate(() => u.abort());
      u.execute().then((res) => {
        expect(res[0].status).toEqual('Failed');
        done();
      });
    });

    it('Should send correct security', async () => {
      const testSecurity = {
        policy: 'test_p',
        signature: 'test_s',
      };

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.setSecurity(testSecurity);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining(testSecurity));
      expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining(testSecurity));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(testSecurity));

    });
  });

  describe('Upload modes', () => {

    describe('Intelligent ingession', () => {
      beforeEach(() => {
        mockStart.mockReturnValue({
          uri: mockedUri,
          region: mockRegion,
          upload_id: mockUploadId,
          location_url: testHost,
          upload_type: 'intelligent_ingestion',
        });
      });

      it('should upload file', async () => {
        const chunkSize = 1024 * 1024;

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setUploadMode(UploadMode.INTELLIGENT);
        u.setIntelligentChunkSize(chunkSize);
        u.addFile(getSmallTestFile());

        const res = await u.execute();
        expect(res[0].handle).toEqual('test_handle');

        const testFile = getSmallTestFile();
        expect(mockStart).toHaveBeenCalledWith({
          filename: testFile.name,
          mimetype: testFile.mimetype,
          size: testFile.size,
          store_location: DEFAULT_STORE_LOCATION,
          apikey: testApikey,
          multipart: 'true',
        });

        const firstPartOffset = 0;
        const firstPartMetadata = testFile.getPartMetadata(0, INTELLIGENT_CHUNK_SIZE);
        const firstPartChunk = testFile.getChunkByMetadata(firstPartMetadata, firstPartOffset, chunkSize);

        expect(mockUpload).toHaveBeenCalledWith({
          md5: firstPartChunk.md5,
          size: firstPartChunk.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: firstPartOffset,
          part: 1,
        });

        expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));

        const secondPartOffset = chunkSize;
        const firstPartSecondChunk = testFile.getChunkByMetadata(firstPartMetadata, secondPartOffset, chunkSize);

        expect(mockUpload).toHaveBeenCalledWith({
          md5: firstPartSecondChunk.md5,
          size: firstPartSecondChunk.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: secondPartOffset,
          part: 1,
        });

        expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));

        expect(mockCommit).toHaveBeenCalledWith({
          apikey: testApikey,
          part: 1,
          size: testFile.size,
          region: mockRegion,
          upload_id: mockUploadId,
          store_location: DEFAULT_STORE_LOCATION,
        });

        expect(mockComplete).toHaveBeenCalledWith({
          apikey: testApikey,
          filename: testFile.name,
          mimetype: testFile.mimetype,
          size: testFile.size,
          region: mockRegion,
          upload_id: mockUploadId,
          store_location: DEFAULT_STORE_LOCATION,
          multipart: 'true',
          uri: mockedUri,
        });
      });

      it('Should lower chunk size on network error', async () => {
        const putRequestTimeout = 300;

        let delayApplied = false;
        interceptorS3.reply(
          function(url, _, cb) {
            if (!delayApplied) {
              delayApplied = true;
              setTimeout(() => {
                cb();
              }, putRequestTimeout + 10);
            } else {
              cb(null, mockPut(url, this.req.headers));
            }
          },
          {
            etag: 'test',
          }
        );

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setTimeout(putRequestTimeout);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();
        expect(res[0].handle).toEqual('test_handle');
        expect(res[0].status).toEqual('test_status');

        const testFile = getSmallTestFile();
        const firstPartMetadata = testFile.getPartMetadata(0, INTELLIGENT_CHUNK_SIZE);
        const firstPartChunk = testFile.getChunkByMetadata(firstPartMetadata, 0, INTELLIGENT_CHUNK_SIZE);

        // this request will be aborted but called on mock upload
        expect(mockUpload).toHaveBeenNthCalledWith(1, {
          md5: firstPartChunk.md5,
          size: firstPartChunk.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: 0,
          part: 1,
        });

        // split part size by a half and retry request (thats give us 2 chunks so 2 upload requests needed)
        const chunkSize = Math.min(INTELLIGENT_CHUNK_SIZE, testFile.size) / 2;
        const chunk1 = testFile.getChunkByMetadata(firstPartMetadata, 0, chunkSize);

        expect(mockUpload).toHaveBeenNthCalledWith(2, {
          md5: chunk1.md5,
          size: chunk1.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: 0,
          part: 1,
        });

        const chunk2 = testFile.getChunkByMetadata(firstPartMetadata, chunkSize / 2, chunkSize);

        expect(mockUpload).toHaveBeenNthCalledWith(3, {
          md5: chunk2.md5,
          size: chunk2.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: chunkSize,
          part: 1,
        });
      });

      it('Should exit when chunk size reaches min chunk size', async () => {
        interceptorS3.reply((url, _, cb) => cb('Error'));

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setTimeout(100);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();
        expect(res[0].status).toEqual('Failed');
      });

      it('Should exit on 4xx errors', async () => {
        mockStart.mockReturnValue({
          uri: mockedUri,
          region: mockRegion,
          upload_id: mockUploadId,
          location_url: testHost,
          upload_type: 'intelligent_ingestion',
        });

        interceptorS3.reply(400, {
          message: 'something awful happened',
          code: 'bad_request',
        });

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setTimeout(100);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();
        expect(res[0].status).toEqual('Failed');
      });

      it('Should nor process upload on multipart/upload network error', async () => {
        interceptorUpload.reply(400, {
          message: 'something awful happened',
          code: 'bad_request',
        });

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setUploadMode(UploadMode.INTELLIGENT);
        u.addFile(getSmallTestFile());

        const res = await u.execute();

        expect(res[0].status).toEqual('Failed');

        expect(mockStart).toHaveBeenCalled();
        expect(mockPut).not.toHaveBeenCalled();
        expect(mockCommit).not.toHaveBeenCalled();
        expect(mockComplete).not.toHaveBeenCalled();
      });
    });

    describe('Fallback mode', () => {
      it('Should switch to fallback mode if regular upload fails', async () => {
        mockStart.mockReturnValue({
          uri: mockedUri,
          region: mockRegion,
          upload_id: mockUploadId,
          location_url: testHost,
          upload_type: 'intelligent_ingestion',
        });

        let networkFail = true;
        interceptorS3.reply(
          function(url, _, cb) {
            if (networkFail) {
              networkFail = false;
              return cb('Error');
            }

            cb(null, mockPut(url, this.req.headers));
          },
          {
            etag: 'test',
          }
        );

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setUploadMode(UploadMode.FALLBACK);
        u.addFile(getSmallTestFile());

        const res = await u.execute();

        expect(res[0].handle).toEqual('test_handle');
        expect(res[0].status).toEqual('test_status');

        const testFile = getSmallTestFile();
        const firstPartMeta = testFile.getPartMetadata(0, DEFAULT_PART_SIZE);
        const firstPart = testFile.getPartByMetadata(firstPartMeta);

        expect(mockUpload).toHaveBeenNthCalledWith(1, {
          md5: firstPart.md5,
          size: firstPart.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          upload_id: mockUploadId,
          part: 1,
        });

        expect(mockUpload).toHaveBeenNthCalledWith(2, {
          md5: firstPart.md5,
          size: firstPart.size,
          apikey: testApikey,
          region: mockRegion,
          store_location: DEFAULT_STORE_LOCATION,
          uri: mockedUri,
          offset: 0,
          upload_id: mockUploadId,
          part: 1,
        });
      });

      it('Should exit if intelligent ingestion is not enabled in account settings', async () => {
        mockStart.mockReturnValue({
          uri: mockedUri,
          region: mockRegion,
          upload_id: mockUploadId,
          location_url: testHost,
        });

        let networkFail = true;
        interceptorS3.reply(
          function(url, _, cb) {
            if (networkFail) {
              networkFail = false;
              return cb({
                message: 'ConnectionError',
                code: 'ETIMEDOUT',
              });
            }

            cb(null, mockPut(url, this.req.headers));
          },
          {
            etag: 'test',
          }
        );

        const u = new S3Uploader({});
        u.setHost(testHost);
        u.setApikey(testApikey);
        u.setUploadMode(UploadMode.FALLBACK);
        u.addFile(getSmallTestFile());

        const res = await u.execute();

        expect(res[0].status).toEqual('Failed');
        expect(mockCommit).not.toHaveBeenCalled();
        expect(mockComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('Regular upload', () => {
    it('should upload file', async () => {
      const partSize = 1024 * 1024 * 7;

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.setPartSize(partSize);
      u.addFile(getTestFile());

      const res = await u.execute();

      const testFile = getTestFile();

      expect(mockStart).toHaveBeenCalledWith({
        filename: testFile.name,
        mimetype: testFile.mimetype,
        size: testFile.size,
        store_location: DEFAULT_STORE_LOCATION,
        apikey: testApikey,
      });

      const firstPartMeta = testFile.getPartMetadata(0, partSize);
      const firstPart = testFile.getPartByMetadata(firstPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(1, {
        md5: firstPart.md5,
        size: firstPart.size,
        apikey: testApikey,
        region: mockRegion,
        store_location: DEFAULT_STORE_LOCATION,
        uri: mockedUri,
        upload_id: mockUploadId,
        part: 1,
      });

      const secondPartMeta = testFile.getPartMetadata(1, partSize);
      const secondPart = testFile.getPartByMetadata(secondPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(2, {
        md5: secondPart.md5,
        size: secondPart.size,
        apikey: testApikey,
        region: mockRegion,
        store_location: DEFAULT_STORE_LOCATION,
        uri: mockedUri,
        upload_id: mockUploadId,
        part: 2,
      });

      expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));
      expect(mockComplete).toHaveBeenCalledWith({
        apikey: testApikey,
        filename: testFile.name,
        mimetype: testFile.mimetype,
        size: testFile.size,
        parts: '1:test;2:test',
        region: mockRegion,
        upload_id: mockUploadId,
        store_location: DEFAULT_STORE_LOCATION,
        uri: mockedUri,
      });

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');
    });

    it('Should not process upload on multipart/upload network error', async () => {
      interceptorUpload.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockStart).toHaveBeenCalled();
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('Should repsect retry config', async () => {
      // simulate first request network fail
      let networkFail = true;
      nock.removeInterceptor(interceptorS3);
      scope.persist(false);

      interceptorS3.twice().reply(
        function(url, _, cb) {
          if (networkFail) {
            networkFail = false;
            return cb('Error');
          }

          cb(null, mockPut(url, this.req.headers));
        },
        {
          etag: 'test',
        }
      );

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());
      u.setRetryConfig({
        retry: 1,
        retryFactor: 2,
        retryMaxTime: 10,
      });

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');
    });
  });

  describe('Common network errors', () => {
    it('Should not process upload on wrong start response', async () => {
      mockStart.mockReset();
      mockStart.mockReturnValue({
        test: 123,
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('Failed');

      expect(mockPut).not.toHaveBeenCalled();
      expect(mockUpload).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('Should not process upload on start error', async () => {
      interceptorStart.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockPut).not.toHaveBeenCalled();
      expect(mockUpload).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('Should nor process upload on multipart/complete network error', async () => {
      interceptorComplete.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockStart).toHaveBeenCalled();
      expect(mockPut).toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
    });

    it('Should call retry function on network error', async () => {});
  });
});
