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
import { UploadMode, DEFAULT_STORE_LOCATION, INTELLIGENT_CHUNK_SIZE, DEFAULT_PART_SIZE, INTELLIGENT_MOBILE_CHUNK_SIZE } from './abstract';
import * as utils from '../../../utils';

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
    slice: (start, end) => Promise.resolve(testBuff.slice(start, end)),
    type: 'text/plain',
    // @ts-ignore
    size: testBuff.length,
    name: 'test.txt',
  });

const getSmallTestFile = () =>
  new File({
    slice: (start, end) => Promise.resolve(testBuff.slice(start, end)),
    type: 'text/plain',
    // @ts-ignore
    size: smallTestBuff.length,
    name: 'test.txt',
  });

const getNullSizeFile = () =>
  new File({
    slice: (start, end) => Promise.resolve(testBuff.slice(start, end)),
    type: 'text/plain',
    // @ts-ignore
    size: 0,
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

describe('Api/Upload/Uploaders/S3', () => {
  beforeEach(() => {
    scope = nock(testHost);
    // scope.defaultReplyHeaders({ 'access-control-allow-origin': '*', 'content-type': 'application/json' });
    scope.persist();

    interceptorStart = scope.post('/multipart/start');
    interceptorUpload = scope.post('/multipart/upload');
    interceptorCommit = scope.post('/multipart/commit');
    interceptorComplete = scope.post('/multipart/complete');
    interceptorS3 = scope.put('/fakes3');

    interceptorStart.reply(200, (_, data) => mockStart(data));
    interceptorUpload.twice().reply(200, (_, data) => mockUpload(data));
    interceptorCommit.reply(200, (_, data) => mockCommit(data));
    interceptorComplete.reply(200, (_, data) => mockComplete(data));
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
      upload_tags: { test: 123 },
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
        const uu = new S3Uploader({}, 10);
      }).not.toThrowError();
    });

    it('should allow adding files', () => {
      const u = new S3Uploader({});
      u.addFile(getTestFile());
    });

    it('should not allow to set min part size lower than defined', () => {
      const u = new S3Uploader({});
      expect(() => u.setPartSize(10)).toThrowError();
    });

    it('should throw an error when setting to small intelligent chunk size', () => {
      const u = new S3Uploader({});
      expect(() => u.setIntelligentChunkSize(10)).toThrowError();
    });

    it('should throw an error when trying to get host when it is undefined', () => {
      const u = new S3Uploader({});
      expect(() => u.getUrl()).toThrowError();
    });

    it('should set intelligent mobile chunk size on mobile devices', () => {
      spyOn(utils, 'isMobile').and.returnValue(true);
      const u = new S3Uploader({});
      return expect(u.getIntelligentChunkSize()).toEqual(INTELLIGENT_MOBILE_CHUNK_SIZE);
    });

    it('should allow to set part size on other mode thant regular', () => {
      const u = new S3Uploader({});
      u.setUploadMode(UploadMode.INTELLIGENT);

      const partSize = 1024 * 1024;
      u.setPartSize(partSize);

      expect(u.getPartSize()).toEqual(DEFAULT_PART_SIZE);
    });

    it('should retry complete request on 202 status code', async () => {
      const mock202 = jest
        .fn()
        .mockName('202 mock')
        .mockReturnValue('');

      nock.removeInterceptor(interceptorComplete);
      scope.persist(false);
      scope.post('/multipart/complete').reply(202, () => mock202());
      scope.post('/multipart/complete').reply(200, (_, data) => mockComplete(data));

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      expect(mock202).toHaveBeenCalledTimes(1);
      expect(mockComplete).toHaveBeenCalledTimes(1);
    });

    it('should respect provided store options', async () => {
      const storeOption = {
        container: 'test',
        location: DEFAULT_STORE_LOCATION,
        workflows: [{
          id: 'test',
        }],
      };

      const u = new S3Uploader(storeOption);
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      await u.execute();
      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining({ store: storeOption }));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining({ store: storeOption }));
    });

    it('should add https protocol to location_url', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost.replace('https://', ''),
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      expect(mockPut).toHaveBeenCalled();
    });

    it('should throw error on file size 0', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost.replace('https://', ''),
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getNullSizeFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');
      expect(mockStart).not.toHaveBeenCalled();
    });

    it('should throw error on wrong etag field', async (done) => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_url: testHost.replace('https://', ''),
      });

      interceptorS3.once().reply(200, s3Callback, {});

      const u = new S3Uploader({});

      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      u.on('error', (err) => {
        expect(err.message).toEqual('Cannot upload file, check S3 bucket settings');
        done();
      });

      await u.execute();
    });

    it('should add Filestack-Upload-Region header on location_region param', async () => {
      mockStart.mockReturnValue({
        uri: mockedUri,
        region: mockRegion,
        upload_id: mockUploadId,
        location_region: 'test',
        location_url: testHost.replace('https://', ''),
      });

      interceptorUpload.reply(200, function(_, data) {
        return mockUpload(data, this.req.headers);
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');

      const testFile = getSmallTestFile();

      const firstPartMetadata = testFile.getPartMetadata(0, DEFAULT_PART_SIZE);
      const firstPartChunk = await testFile.getPartByMetadata(firstPartMetadata);

      expect(mockUpload).toHaveBeenCalledWith(
        {
          md5: firstPartChunk.md5,
          size: testFile.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          upload_id: mockUploadId,
          part: 1,
        },
        expect.objectContaining({ 'filestack-upload-region': 'test' })
      );

      expect(mockPut).toHaveBeenCalled();
    });

    it('should respect pause() and resume() command', async () => {
      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      setImmediate(() => u.pause());
      setTimeout(() => u.resume(), 10);

      const res = await u.execute();

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');
    });

    it('should respect abort() command', (done) => {
      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getTestFile());

      setImmediate(() => u.abort());
      u.execute().then((res) => {
        expect(res[0].status).toEqual('Failed');
        done();
      }).catch(() => {
        done('Execution failed');
      });
    });

    it('should send correct security', async () => {
      const testSecurity = {
        policy: 'test_p',
        signature: 'test_s',
      };

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.setSecurity(testSecurity);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining(testSecurity));
      expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining(testSecurity));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(testSecurity));

    });

    it('should respect disableStorageKey option', async () => {
      const u = new S3Uploader({
        disableStorageKey: true,
        path: '/test/',
      });

      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      const storageKeyExpect = {
        store: {
          location: 's3',
          path: '/test/test.txt',
        },
      };

      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));

    });

    it('should respect disableStorageKey option when path is missing', async () => {
      const u = new S3Uploader({
        disableStorageKey: true,
      });

      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      const storageKeyExpect = {
        store: {
          location: 's3',
          path: '/test.txt',
        },
      };

      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));

    });

    it('should respect disableStorageKey option when path has missing /', async () => {
      const u = new S3Uploader({
        disableStorageKey: true,
        path: '/test',
      });

      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      const storageKeyExpect = {
        store: {
          location: 's3',
          path: '/test/test.txt',
        },
      };

      expect(mockStart).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockUpload).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(storageKeyExpect));
    });

  });

  describe('Tags', () => {
    it('Make correct request with upload tags', async () => {
      const u = new S3Uploader({
        disableStorageKey: true,
        path: '/test',
      });

      const tags = {
        test: '123',
        test2: 'test',
      };

      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());
      u.setUploadTags(tags);

      const res = await u.execute();
      expect(res[0].status).toEqual('test_status');

      const tagsExpected = {
        upload_tags: tags,
      };

      expect(res[0].uploadTags).toEqual({ test: 123 });
      expect(mockComplete).toHaveBeenCalledWith(expect.objectContaining(tagsExpected));
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
        u.setUrl(testHost);
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
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          apikey: testApikey,
          fii: true,
        });

        const firstPartOffset = 0;
        const firstPartMetadata = testFile.getPartMetadata(0, INTELLIGENT_CHUNK_SIZE);
        const firstPartChunk = await testFile.getChunkByMetadata(firstPartMetadata, firstPartOffset, chunkSize);

        expect(mockUpload).toHaveBeenCalledWith({
          md5: firstPartChunk.md5,
          size: firstPartChunk.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: firstPartOffset,
          fii: true,
          part: 1,
        });

        expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));

        const secondPartOffset = chunkSize;
        const firstPartSecondChunk = await testFile.getChunkByMetadata(firstPartMetadata, secondPartOffset, chunkSize);

        expect(mockUpload).toHaveBeenCalledWith({
          md5: firstPartSecondChunk.md5,
          size: firstPartSecondChunk.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: secondPartOffset,
          fii: true,
          part: 1,
        });

        expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));

        expect(mockCommit).toHaveBeenCalledWith({
          apikey: testApikey,
          part: 1,
          size: testFile.size,
          region: mockRegion,
          uri: mockedUri,
          upload_id: mockUploadId,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
        });

        expect(mockComplete).toHaveBeenCalledWith({
          apikey: testApikey,
          filename: testFile.name,
          mimetype: testFile.mimetype,
          size: testFile.size,
          region: mockRegion,
          upload_id: mockUploadId,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          fii: true,
          uri: mockedUri,
        });
      });

      it('should lower chunk size on network error', async () => {
        const putRequestTimeout = 300;
        let delayApplied = false;

        interceptorS3.reply(
          function(url, _, cb) {
            if (!delayApplied) {
              delayApplied = true;
              setTimeout(() => {
                cb(504);
              }, 3000);
            } else {
              cb(null, mockPut(url, this.req.headers));
            }
          },
          {
            etag: 'test',
          }
        );

        const u = new S3Uploader({});
        u.setUrl(testHost);
        u.setApikey(testApikey);
        u.setTimeout(putRequestTimeout);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();

        expect(res[0].handle).toEqual('test_handle');
        expect(res[0].status).toEqual('test_status');

        const testFile = getSmallTestFile();
        const firstPartMetadata = testFile.getPartMetadata(0, INTELLIGENT_CHUNK_SIZE);
        const firstPartChunk = await testFile.getChunkByMetadata(firstPartMetadata, 0, INTELLIGENT_CHUNK_SIZE);

        // this request will be aborted but called on mock upload
        expect(mockUpload).toHaveBeenNthCalledWith(1, {
          md5: firstPartChunk.md5,
          size: firstPartChunk.size,
          apikey: testApikey,
          region: mockRegion,
          fii: true,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: 0,
          part: 1,
        });

        // split part size by a half and retry request (thats give us 2 chunks so 2 upload requests needed)
        const chunkSize = Math.min(INTELLIGENT_CHUNK_SIZE, testFile.size) / 2;
        const chunk1 = await testFile.getChunkByMetadata(firstPartMetadata, 0, chunkSize);

        expect(mockUpload).toHaveBeenNthCalledWith(2, {
          md5: chunk1.md5,
          size: chunk1.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          fii: true,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: 0,
          part: 1,
        });

        const chunk2 = await testFile.getChunkByMetadata(firstPartMetadata, chunkSize / 2, chunkSize);

        expect(mockUpload).toHaveBeenNthCalledWith(3, {
          md5: chunk2.md5,
          size: chunk2.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          fii: true,
          uri: mockedUri,
          upload_id: mockUploadId,
          offset: chunkSize,
          part: 1,
        });
      });

      it('should exit when chunk size reaches min chunk size', async () => {
        interceptorS3.reply((url, _, cb) => cb('Error'));

        const u = new S3Uploader({});
        u.setUrl(testHost);
        u.setApikey(testApikey);
        u.setTimeout(100);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();
        expect(res[0].status).toEqual('Failed');
      });

      it('should exit on 4xx errors', async () => {
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
        u.setUrl(testHost);
        u.setApikey(testApikey);
        u.setTimeout(100);
        u.setUploadMode(UploadMode.INTELLIGENT);

        u.addFile(getSmallTestFile());
        const res = await u.execute();
        expect(res[0].status).toEqual('Failed');
      });

      it('should nor process upload on multipart/upload network error', async () => {
        interceptorUpload.reply(400, {
          message: 'something awful happened',
          code: 'bad_request',
        });

        const u = new S3Uploader({});
        u.setUrl(testHost);
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
      it('should switch to fallback mode if regular upload fails', async () => {
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
        u.setUrl(testHost);
        u.setApikey(testApikey);
        u.setUploadMode(UploadMode.FALLBACK);
        u.addFile(getSmallTestFile());

        const res = await u.execute();

        expect(res[0].handle).toEqual('test_handle');
        expect(res[0].status).toEqual('test_status');

        const testFile = getSmallTestFile();
        const firstPartMeta = testFile.getPartMetadata(0, DEFAULT_PART_SIZE);
        const firstPart = await testFile.getPartByMetadata(firstPartMeta);

        expect(mockUpload).toHaveBeenNthCalledWith(1, {
          md5: firstPart.md5,
          size: firstPart.size,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          upload_id: mockUploadId,
          part: 1,
        });

        expect(mockUpload).toHaveBeenNthCalledWith(2, {
          md5: firstPart.md5,
          size: firstPart.size,
          fii: true,
          apikey: testApikey,
          region: mockRegion,
          store: {
            location: DEFAULT_STORE_LOCATION,
          },
          uri: mockedUri,
          offset: 0,
          upload_id: mockUploadId,
          part: 1,
        });
      });

      it('should exit if intelligent ingestion is not enabled in account settings', async () => {
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
        u.setUrl(testHost);
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
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.setPartSize(partSize);
      u.addFile(getTestFile());

      const res = await u.execute();

      const testFile = getTestFile();

      expect(mockStart).toHaveBeenCalledWith({
        filename: testFile.name,
        mimetype: testFile.mimetype,
        size: testFile.size,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        apikey: testApikey,
      });

      const firstPartMeta = testFile.getPartMetadata(0, partSize);
      const firstPart = await testFile.getPartByMetadata(firstPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(1, {
        md5: firstPart.md5,
        size: firstPart.size,
        apikey: testApikey,
        region: mockRegion,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        uri: mockedUri,
        upload_id: mockUploadId,
        part: 1,
      });

      const secondPartMeta = testFile.getPartMetadata(1, partSize);
      const secondPart = await testFile.getPartByMetadata(secondPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(2, {
        md5: secondPart.md5,
        size: secondPart.size,
        apikey: testApikey,
        region: mockRegion,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
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
        parts: [{ part_number: 1, etag: 'test' }, { part_number: 2, etag: 'test' }],
        region: mockRegion,
        upload_id: mockUploadId,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        uri: mockedUri,
      });

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');
    });

    it('should upload file with disable integrity check enabled', async () => {
      const partSize = 1024 * 1024 * 7;

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.setPartSize(partSize);
      u.addFile(getTestFile());
      u.setIntegrityCheck(false);

      const res = await u.execute();

      const testFile = getTestFile();

      expect(mockStart).toHaveBeenCalledWith({
        filename: testFile.name,
        mimetype: testFile.mimetype,
        size: testFile.size,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        apikey: testApikey,
      });

      const firstPartMeta = testFile.getPartMetadata(0, partSize);
      const firstPart = await testFile.getPartByMetadata(firstPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(1, {
        size: firstPart.size,
        apikey: testApikey,
        region: mockRegion,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        uri: mockedUri,
        upload_id: mockUploadId,
        part: 1,
      });

      const secondPartMeta = testFile.getPartMetadata(1, partSize);
      const secondPart = await testFile.getPartByMetadata(secondPartMeta);

      expect(mockUpload).toHaveBeenNthCalledWith(2, {
        size: secondPart.size,
        apikey: testApikey,
        region: mockRegion,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
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
        parts: [{ part_number: 1, etag: 'test' }, { part_number: 2, etag: 'test' }],
        region: mockRegion,
        upload_id: mockUploadId,
        store: {
          location: DEFAULT_STORE_LOCATION,
        },
        uri: mockedUri,
      });

      expect(res[0].handle).toEqual('test_handle');
      expect(res[0].status).toEqual('test_status');
    });

    it('should not process upload on multipart/upload network error', async () => {
      interceptorUpload.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockStart).toHaveBeenCalled();
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('should repsect retry config', async () => {
      // simulate first request network fail
      let networkFail = true;

      nock.removeInterceptor(interceptorS3);
      scope.persist(false);

      interceptorS3.twice().reply(
        function(url, _, cb) {
          if (networkFail) {
            networkFail = false;
            return cb(Error('error'));
          }

          cb(null, mockPut(url, this.req.headers));
        },
        { etag: 'test' }
      );

      const u = new S3Uploader({});
      u.setUrl(testHost);
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
    it('should not process upload on wrong start response', async () => {
      mockStart.mockReset();
      mockStart.mockReturnValue({
        test: 123,
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockUpload).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('should not process upload on start error', async () => {
      interceptorStart.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockPut).not.toHaveBeenCalled();
      expect(mockUpload).not.toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('should nor process upload on multipart/complete network error', async () => {
      interceptorComplete.reply(400, {
        message: 'something awful happened',
        code: 'bad_request',
      });

      const u = new S3Uploader({});
      u.setUrl(testHost);
      u.setApikey(testApikey);
      u.addFile(getSmallTestFile());

      const res = await u.execute();

      expect(res[0].status).toEqual('Failed');

      expect(mockStart).toHaveBeenCalled();
      expect(mockPut).toHaveBeenCalled();
      expect(mockCommit).not.toHaveBeenCalled();
    });
  });
});
