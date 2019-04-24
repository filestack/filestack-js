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
import { UploadMode, DEFAULT_STORE_LOCATION, INTELLIGENT_CHUNK_SIZE } from './abstract';

const testBufferSize = 1024 * 1024 * 9;
const testSmallBufferSize = 1024 * 1024 * 2;
let testBuff = Buffer.alloc(testBufferSize).fill('t', 0, testBufferSize);
let smallTestBuff = Buffer.alloc(testSmallBufferSize).fill('t', 0, testSmallBufferSize);

let interceptorS3;

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
    nock(testHost)
      .persist()
      .post('/multipart/start')
      .reply(200, (_, data) => mockStart(JSON.parse(data)))
      .post('/multipart/upload')
      .reply(200, (_, data) => mockUpload(JSON.parse(data)))
      .post('/multipart/commit')
      .reply(200, (_, data) => mockCommit(JSON.parse(data)))
      .post('/multipart/complete')
      .reply(200, (_, data) => mockComplete(JSON.parse(data)));

    interceptorS3 = nock(testHost)
      .persist()
      .put('/fakes3');
    interceptorS3.reply(201, s3Callback, { etag: 'test' });

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
    });
  });

  describe.only('Intelligent ingession', () => {
    it('should upload file', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost,
        upload_type: 'intelligent_ingestion',
      });

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
      mockStart.mockClear();
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost,
        upload_type: 'intelligent_ingestion',
      });

      const putRequestTimeout = 300;

      let delayApplied = false;
      interceptorS3.reply(function(url, _, cb) {
        if (!delayApplied) {
          delayApplied = true;
          setTimeout(() => {
            cb();
          }, putRequestTimeout + 10);
        } else {
          cb(null, mockPut(url, this.req.headers));
        }
      }, {
        etag: 'test',
      });

      const u = new S3Uploader({});
      u.setHost(testHost);
      u.setApikey(testApikey);
      u.setTimeout(putRequestTimeout);
      u.setUploadMode(UploadMode.INTELLIGENT);

      u.addFile(getSmallTestFile());
      const res = await u.execute();
      expect(res[0].handle).toEqual('test_handle');

      const testFile = getSmallTestFile();
      const firstPartMetadata = testFile.getPartMetadata(0, INTELLIGENT_CHUNK_SIZE);
      const firstPartChunk = testFile.getChunkByMetadata(firstPartMetadata, 0, INTELLIGENT_CHUNK_SIZE);

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
  });

  // describe.skip('Fallback mode', () => {});

  // it('should allow upload multiple file');

  // it('should allow upload file in fallback mode');
});
