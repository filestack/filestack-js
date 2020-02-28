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

import { config } from './../../config';
import * as nock from 'nock';
import * as utils from './../utils';
import { Prefetch, PrefetchOptionsEvents } from './prefetch';

const testApiKey = 'AHvhedybhQMqZOqRvZquez';
const testSecurity = {
  policy: 'examplePolicy',
  signature: 'exampleSignature',
};

const testURL = {
  fileApiUrl: '',
  uploadApiUrl: 'https://upload.fs.stg.filestack.org',
  cloudApiUrl: 'https://cloud.fs.stg.filestack.org',
  cdnUrl: 'https://cdn.filestackcontent.com',
  pickerUrl: '',
};

const sessionURls = config.urls;

const testSession = {
  apikey: testApiKey,
  urls: testURL,
};

const PrefetchRequest = {
  settings: {
    inapp_browser: false,
    customsource: false,
  },
  permissions: {
    transforms_ui: false,
    gmail: true,
    facebook: true,
  },
  events: [PrefetchOptionsEvents.PICKER],
  pickerOptions: {
    fromSources: ['googledrive', 'dropbox'],
  },
};

let scope = nock(testURL.uploadApiUrl);
// let scope = nock(sessionURls.uploadApiUrl);

const mockPrefetch = jest
  .fn()
  .mockName('prefetch')
  .mockReturnValue('prefetch');

describe('Prefetch', () => {
  beforeAll(() => {
    // @ts-ignore
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  beforeEach(() => {
    console.log('testURL.uploadApiUrl => ', testURL.uploadApiUrl);

    scope
      .persist()
      .options(/.*/)
      .reply(204, '', {
        'access-control-allow-headers': 'filestack-source,filestack-trace-id,filestack-trace-span',
        'access-control-allow-methods': '*',
        'access-control-allow-origin': '*',
      });

    scope.post('/prefetch').reply(200, {
      prefetchUrl: testURL.uploadApiUrl,
      session: {
        apikey: testApiKey,
        urls: testURL,
      },
    });
  });

  it('should return correct session', async () => {
    const prefetchRequest = new Prefetch(testSession);
    const prefetchResponse = {
      prefetchUrl: testURL.uploadApiUrl,
      session: {
        apikey: testApiKey,
        urls: testURL,
      },
    };

    expect(prefetchRequest).toEqual(prefetchResponse);
  });

  it('should return correct security', () => {
    Object.assign(testSession, { ...testSecurity });
    const prefetchRequest = new Prefetch(testSession);

    scope.post('/prefetch').reply(200, (_, data) => {
      console.log('aaa => ', data);
    });

    const prefetchResponse = {
      prefetchUrl: testURL.uploadApiUrl,
      session: {
        apikey: testApiKey,
        ...testSecurity,
        urls: testURL,
      },
    };

    expect(prefetchRequest).toEqual(prefetchResponse);
  });

  it('should return correct config', async () => {
    const prefetch = new Prefetch(testSession);
    const prefetchResponse = await prefetch.getConfig(PrefetchRequest);
    const expectationsResponse = {
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

    expect(prefetchResponse).toEqual(expectationsResponse);
  });
});
