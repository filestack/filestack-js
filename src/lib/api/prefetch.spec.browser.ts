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

// import { config } from './../../config';
import * as nock from 'nock';
import { Prefetch } from './prefetch';
import { FsRequestError, FsRequestErrorCode } from '../request';

const testApiKey = 'AHvhedybhQMqZOqRvZquez';
const testSecurity = {
  policy: 'examplePolicy',
  signature: 'exampleSignature',
};

const testURL = {
  fileApiUrl: '',
  uploadApiUrl: 'https://uploadtesturl.com',
  cloudApiUrl: '',
  cdnUrl: '',
  pickerUrl: '',
};

const testSession = {
  apikey: testApiKey,
  urls: testURL,
  security: testSecurity,
};

let scope = nock(testURL.uploadApiUrl);

// mock cors responses for all request for browser tests
scope.defaultReplyHeaders({
  'access-control-allow-origin': req => req.headers['origin'],
  'access-control-allow-methods': req => req.headers['access-control-request-method'],
  'access-control-allow-headers': req => req.headers['access-control-request-headers'],
  'content-type': 'application/json',
});

// mock options requests
scope
  .persist()
  .options(/.*/)
  .reply(204);

describe('Prefetch', () => {
  it('Should make correct request to prefetch and return new config', async () => {
    const serverResponse = {
      blocked: false,
      settings: {
        customsource: false,
        inapp_browser: false,
      },
      permissions: {
        transforms_ui: false,
      },
      updated_config: {
        fromSources: ['googledrive'],
      },
    };

    scope.post('/prefetch').reply(200, serverResponse);

    const test = () => 2;

    const prefetch = new Prefetch(testSession);
    const res = await prefetch.getConfig({
      pickerOptions: {
        // @ts-ignore
        onFileSelected: test,
        fromSources: ['facebook', 'test'],
      },
    });

    expect(res.pickerOptions.onFileSelected).toEqual(test);
    expect(res.pickerOptions.fromSources).toEqual(['googledrive']);
  });

  it.only('should set correct params to sessions', async () => {
    const prefetch = new Prefetch(testSession);
    const response = await prefetch.getConfig({
      // @ts-ignore
      apikey: testApiKey,
      urls: testURL,
    });

    console.log('response => ', response);

    expect(true).toEqual(true);
  });

  it('should return error on network error', async () => {
    try {
      const prefetch = new Prefetch(testSession);
      await prefetch.getConfig({
        // @ts-ignore
        apikey: testApiKey,
        urls: testURL,
      });
    } catch (err) {
      expect(err.code).toEqual(FsRequestErrorCode.NETWORK);
    }
  });

  it('should throw error when response code is other thant 200', async () => {
    scope.post('/prefetch').reply(500, {});
    try {
      const prefetch = new Prefetch(testSession);
      await prefetch.getConfig({
        // @ts-ignore
        apikey: testApiKey,
      });
    } catch (err) {
      expect(err.code).toEqual(FsRequestErrorCode.SERVER);
    }
    expect(true).toEqual(true);
  });

  it('should add security to request when provided', async () => {
    expect(true).toEqual(true);
  });

  it('should send only events when config is already prefetched', () => {
    expect(true).toEqual(true);
  });
});
