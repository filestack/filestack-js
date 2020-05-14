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
import { Prefetch, PrefetchEvents } from './prefetch';
import { Session, Security } from './../client';
import { FsRequestErrorCode } from '../request';

const testApiKey = 'AHv2222222222444444uez';
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
  processUrl: '',
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
        fromSources: ['googledrive', 'test'],
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
      apikey: testApiKey,
      settings: ['inapp_browser'],
      security: {
        signature: testSecurity.signature,
        policy: testSecurity.policy,
      },
    });

    scope.done();
  });

  it('should always add inapp browser setting to request', async () => {
    const mockPref = jest.fn() .mockImplementation(() => ({}));
    scope.post('/prefetch').once().reply(200, (_, data) => mockPref(data));

    const prefetch = new Prefetch({ ...testSession });
    await prefetch.getConfig({});

    expect(mockPref).toHaveBeenCalledWith({
      apikey: testApiKey,
      settings: ['inapp_browser'],
    });

    scope.done();
  });

  it('should always add inapp browser setting to request event if some settings are provided', async () => {
    const mockPref = jest.fn() .mockImplementation(() => ({}));
    scope.post('/prefetch').once().reply(200, (_, data) => mockPref(data));

    const prefetch = new Prefetch({ ...testSession });
    await prefetch.getConfig({ settings: ['inapp_browser'] });

    expect(mockPref).toHaveBeenCalledWith({
      apikey: testApiKey,
      settings: ['inapp_browser'],
    });

    scope.done();
  });

  it('should return old config when updated_config is missing in response', async () => {
    const sessionCopy =  {
      ...testSession,
      signature: testSecurity.signature,
      policy: testSecurity.policy,
    };

    scope.post('/prefetch').once().reply(200, {
      blocked: true,
    });

    const pickerOptions = {
      uploadInBackground: true,
      onUploadDone: () => console.log,
      storeTo: {
        location: 'asd',
      },
    };

    const prefetch = new Prefetch(sessionCopy);
    const res = await prefetch.getConfig({ pickerOptions });

    expect(res.pickerOptions).toEqual(pickerOptions);

    scope.done();
  });
});
