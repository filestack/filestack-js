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

// const mockPrefetch = jest
//   .fn()
//   .mockName('prefetch')
//   .mockReturnValue('prefetch');

scope.defaultReplyHeaders({
  'access-control-allow-origin': req => req.headers['origin'],
  'access-control-allow-methods': req => req.headers['access-control-request-method'],
  'access-control-allow-headers': req => req.headers['access-control-request-headers'],
  'content-type': 'application/json',
});

scope
  .persist()
  .options(/.*/)
  .reply(204);

describe.only('Prefetch', () => {

  // apikey: string;
  // security?: {
  //   policy?: string;
  //   signature?: string;
  // };
  // permissions?: string[];
  // settings?: string[];
  // events?: PrefetchOptionsEvents[];
  // picker_config?: PickerOptions;

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
    const res = await prefetch.getConfig({ pickerOptions : {
      // @ts-ignore
      onFileSelected: test,
      fromSources: ['facebook', 'test'],
    }});

    expect(res.picker_config.onFileSelected).toEqual(test);
    expect(res.picker_config.fromSources).toEqual(['googleDrive']);
  });

  // beforeEach(() => {
  //   scope
  //     .persist()
  //     .options(/.*/)
  //     .reply(204, '', {
  //       'access-control-allow-headers': 'filestack-source,filestack-trace-id,filestack-trace-span',
  //       'access-control-allow-methods': '*',
  //       'access-control-allow-origin': '*',
  //     });

  //   // scope.post('/prefetch').reply(200, {
  //   //   prefetchUrl: testURL.uploadApiUrl,
  //   //   session: {
  //   //     apikey: testApiKey,
  //   //     urls: testURL,
  //   //   },
  //   // });

  // });

  // it('should return correct session', async () => {
  //   const prefetchRequest = new Prefetch(testSession);
  //   const prefetchResponse = {
  //     prefetchUrl: testURL.uploadApiUrl,
  //     session: {
  //       apikey: testApiKey,
  //       urls: testURL,
  //     },
  //   };

  //   expect(prefetchRequest).toEqual(prefetchResponse);
  // });

  // it('should return correct security', () => {
  //   Object.assign(testSession, { ...testSecurity });
  //   const prefetchRequest = new Prefetch(testSession);

  //   scope.post('/prefetch').reply(200, (_, data) => {
  //     console.log('aaa => ', data);
  //   });

  //   const prefetchResponse = {
  //     prefetchUrl: testURL.uploadApiUrl,
  //     session: {
  //       apikey: testApiKey,
  //       ...testSecurity,
  //       urls: testURL,
  //     },
  //   };

  //   expect(prefetchRequest).toEqual(prefetchResponse);
  // });

  // it('should return correct config', async () => {
  //   const prefetch = new Prefetch(testSession);
  //   const prefetchResponse = await prefetch.getConfig(PrefetchRequest);
  //   const expectationsResponse = {
  //     blocked: false,
  //     settings: {
  //       customsource: false,
  //       inapp_browser: false,
  //     },
  //     permissions: {
  //       transforms_ui: false,
  //     },
  //     updated_config: {
  //       fromSources: ['googledrive'],
  //     },
  //   };

  //   expect(prefetchResponse).toEqual(expectationsResponse);
  // });
});
