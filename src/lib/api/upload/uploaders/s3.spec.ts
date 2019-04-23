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
import { readFileSync } from 'fs';
import * as Path from 'path';
import { UploadMode, DEFAULT_STORE_LOCATION } from './abstract';

const testBuff = readFileSync(Path.join(process.cwd(), 'filestack-logo.png'));

const getTestFile = () =>
  new File({
    buffer: testBuff,
    type: 'text/plain',
    // @ts-ignore
    size: testBuff.length,
    name: 'test.txt',
  });

const testApikey = 'testapikey';
const testHost = 'https://test.com';
const mockUploadId = '123132123';
const mockRegion = 'test-region';
const mockedUri = '/sometest';
const s3Url = testHost + '/fakes3';

const mockStart = jest.fn();
const mockUpload = jest.fn();
const mockPut = jest.fn();
const mockCommit = jest.fn();
const mockComplete = jest.fn();

describe('Api/Upload/Uploaders/S3', () => {
  beforeAll(() => {
    // @todo remove after multipart will be updated
    spyOn(request, 'multipart').and.callFake((url, fields, config) => {
      return axios.post(url, fields, config);
    });

    nock(testHost)
      .post('/multipart/start')
      .reply(200, (_, data) => mockStart(JSON.parse(data)))
      .post('/multipart/upload')
      .reply(200, (_, data) => mockUpload(JSON.parse(data)))
      .put('/fakes3')
      .reply(
        201,
        function(url) {
          return mockPut(url, this.req.headers);
        },
        { etag: 'test' }
      )
      .post('/multipart/commit')
      .reply(200, (_, data) => mockCommit(JSON.parse(data)))
      .post('/multipart/complete')
      .reply(200, (_, data) => mockComplete(JSON.parse(data)));
  });

  beforeEach(() => {
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
  });

  it('should initialize class without errors', () => {
    expect(() => {
      const u = new S3Uploader({});
    }).not.toThrowError();
  });

  it('Should allow adding files', () => {
    const u = new S3Uploader({});
    u.addFile(getTestFile());
  });

  it.only('should upload regular file', async () => {
    const u = new S3Uploader({});
    u.setHost(testHost);
    u.setApikey(testApikey);
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

    expect(mockUpload).toHaveBeenCalledWith({
      md5: testFile.md5,
      size: testFile.size,
      apikey: testApikey,
      region: mockRegion,
      store_location: DEFAULT_STORE_LOCATION,
      uri: mockedUri,
      upload_id: mockUploadId,
      location_url: testHost,
      part: 1,
    });

    expect(mockPut).toHaveBeenCalledWith('/fakes3', expect.any(Object));
    expect(mockComplete).toHaveBeenCalledWith({
      apikey: testApikey,
      filename: testFile.name,
      mimetype: testFile.mimetype,
      size: testFile.size,
      location_url: testHost,
      parts: '1:test',
      region: mockRegion,
      upload_id: mockUploadId,
      store_location: DEFAULT_STORE_LOCATION,
      uri: mockedUri,
    });

    expect(res[0].handle).toEqual('test_handle');
  });

  it('should allow upload file in ii mode', async () => {
    mockStart.mockReturnValue({
      uri: mockedUri,
      region: mockRegion,
      upload_id: mockUploadId,
      location_url: testHost,
      upload_type: 'intelligent_ingestion',
    });

    const u = new S3Uploader({});
    u.setHost(testHost);
    u.setApikey(testApikey);
    u.setUploadMode(UploadMode.INTELLIGENT);
    u.addFile(getTestFile());

    const res = await u.execute();
    expect(res[0].handle).toEqual('test_handle');

    const testFile = getTestFile();
    expect(mockStart).toHaveBeenCalledWith({
      filename: testFile.name,
      mimetype: testFile.mimetype,
      size: testFile.size,
      store_location: DEFAULT_STORE_LOCATION,
      apikey: testApikey,
      multipart: true,
    });

  });

  // it('should allow upload multiple file');

  // it('should allow upload file in fallback mode');
});
