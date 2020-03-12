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
import { Prefetch, PrefetchOptionsEvents } from './prefetch';
import { Session, Security } from './../client';
import { FsRequestErrorCode } from '../request';

const testApiKey = 'AHvhedybhQMqZOqRvZquez';
const testSecurity: Security = {
  policy: 'examplePolicy',
  signature: 'exampleSignature',
};

const testURL = {
  fileApiUrl: '',
  uploadApiUrl: 'https://uploadtesturl-fs.com',
  cloudApiUrl: '',
  cdnUrl: '',
  pickerUrl: '',
};

const testSession: Session = {
  apikey: testApiKey,
  urls: testURL,
};

let scope = nock(testURL.uploadApiUrl);

// mock cors responses for all request for browser tests
scope.defaultReplyHeaders({
  'access-control-allow-origin': req => req.headers['origin'],
  'access-control-allow-methods': req => req.headers['access-control-request-method'],
  'access-control-allow-headers': req => req.headers['access-control-request-headers'],
  'content-type': 'application/json',
});

describe('Prefetch', () => {
  beforeEach(() => {
    scope
    .options(/.*/)
    .reply(204);
  });

  it('Should make correct request to prefetch and return new config', async () => {
    const sessionCopy =  { ...testSession };

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

    scope.post('/prefetch').once().reply(200, serverResponse);

    const test = () => 2;

    const prefetch = new Prefetch(sessionCopy);
    const res = await prefetch.getConfig({
      pickerOptions: {
        // @ts-ignore
        onFileSelected: test,
        fromSources: ['facebook', 'test'],
      },
    });

    expect(res.pickerOptions.onFileSelected).toEqual(test);
    expect(res.pickerOptions.fromSources).toEqual(['googledrive']);

    scope.done();
  });

  it('should set correct params to sessions (prefetch)', async () => {
    const sessionCopy =  { ...testSession };
    const serverResponse = {
      blocked: false,
      settings: {
        customsource: false,
        inapp_browser: true,
      },
      permissions: {
        transforms_ui: true,
      },
      updated_config: {
        fromSources: ['googledrive'],
      },
    };

    scope.post('/prefetch').once().reply(200, serverResponse);

    const prefetch = new Prefetch(sessionCopy);
    const res = await prefetch.getConfig({
      pickerOptions: {
        fromSources: ['facebook', 'test'],
      },
    });

    expect(sessionCopy.prefetch).toEqual(expect.any(Object));
    expect(sessionCopy.prefetch.settings.inapp_browser).toEqual(true);
    expect(sessionCopy.prefetch.permissions.transforms_ui).toEqual(true);

    scope.done();
  });

  it('should throw error when response code is other thant 200', async () => {
    try {
      const sessionCopy =  { ...testSession };
      const prefetch = new Prefetch(sessionCopy);

      scope.post('/prefetch').once().reply(500);

      await prefetch.getConfig({});
    } catch (err) {
      expect(err.code).toEqual(FsRequestErrorCode.SERVER);
    }

    scope.done();
  });

  it('should add security to request when provided', async () => {
    const sessionCopy =  {
      ...testSession,
      signature: testSecurity.signature,
      policy: testSecurity.policy,
    };

    const mockPref = jest.fn() .mockImplementation(() => ({}));

    scope.post('/prefetch').once().reply(200, (_, data) => mockPref(data));

    const prefetch = new Prefetch(sessionCopy);
    const res = await prefetch.getConfig({
      pickerOptions: {},
    });

    expect(mockPref).toHaveBeenCalledWith({
      apikey: 'AHvhedybhQMqZOqRvZquez',
      security: {
        signature: testSecurity.signature,
        policy: testSecurity.policy,
      },
    });

    scope.done();
  });

  it('should send only events when config is already prefetched', async () => {
    const sessionCopy =  { ...testSession };
    const mockPref = jest.fn() .mockImplementation(() => ({}));

    scope.post('/prefetch').twice().reply(200, (_, data) => mockPref(data));

    const prefetch = new Prefetch(sessionCopy);
    const toSend = {
      events: [PrefetchOptionsEvents.PICKER],
      pickerOptions: {
        uploadInBackground: true,
      },
    };

    await prefetch.getConfig(toSend);

    // add one more options request for second request
    scope
    .options(/.*/)
    .reply(204);

    await prefetch.getConfig(toSend);

    expect(mockPref).toHaveBeenCalledTimes(2);
    expect(mockPref).toHaveBeenCalledWith({
      apikey: 'AHvhedybhQMqZOqRvZquez',
      events: [PrefetchOptionsEvents.PICKER],
      picker_config: {
        uploadInBackground: true,
      },
    });

    expect(mockPref).toHaveBeenCalledWith({
      apikey: 'AHvhedybhQMqZOqRvZquez',
      events: [PrefetchOptionsEvents.PICKER],
    });

    scope.done();
  });
});
