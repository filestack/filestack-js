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

import { storeURL } from './store';
import { Session } from '../client';
import { Filelink } from './../filelink';
import * as nock from 'nock';

const testHost = 'https://test.com';
const testUrl = 'testurl';
const mockGet = jest.fn().mockName('mockGet');
const mockHandle = 'mockHandle';

jest.mock('./../filelink');

const mockedSession: Session = {
  apikey: 'fakeApikey',
  urls: {
    cdnUrl: testHost,
    fileApiUrl: 'fakeApiUrl',
    uploadApiUrl: 'fakeUploadApiUrl',
    cloudApiUrl: 'fakeCloudApiUrl',
    pickerUrl: 'fakePickerUrl',
  },
};

const responseObj = {
  filename: 'testFilename',
  handle: 'testHandle',
  url: 'testUrl',
  type: 'testMimetype',
  mimetype: 'testMimetype',
  size: 1,
};

describe('StoreURL', () => {
  beforeAll(() => {
    spyOn(Filelink.prototype, 'toString').and.returnValue(`${testHost}/${testUrl}`);
    mockGet.mockReturnValue(responseObj);

    nock(testHost)
      .persist()
      .get(`/${testUrl}`)
      .reply(200, mockGet);
  });

  it('should call correct store method', async () => {
    expect(await storeURL(mockedSession, 'http://test.com')).toEqual(responseObj);
  });

  it('should respect passed security and policy', async () => {
    const fakeSecurity = {
      signature: 'fakeS',
      policy: 'fakeP',
    };

    const res = await storeURL(mockedSession, mockHandle, {}, null, fakeSecurity);

    expect(Filelink.prototype.security).toBeCalledWith(fakeSecurity);
    expect(res).toEqual(responseObj);
  });

  it('should respect token cancel', () => {
    const token = {
      cancel: () => jest.fn(),
    };

    setImmediate(() => token.cancel());
    return expect(storeURL(mockedSession, mockHandle, {}, token)).rejects.toEqual({});
  });

  it('should throw an error when missing url', async () => {
    expect(() => {
      storeURL(mockedSession);
    }).toThrowError();
  });

  it('should rejects on request error', () => {
    // @ts-ignore
    Filelink.prototype.toString.and.returnValue(`${testHost}/${testUrl}/404`);

    nock(testHost)
      .get(`/${testUrl}/404`)
      .reply(404);

    return expect(storeURL(mockedSession, mockHandle, {})).rejects.toEqual(expect.any(Error));
  });

  it('should rejects on wrong body structure', async () => {
    // @ts-ignore
    Filelink.prototype.toString.and.returnValue(`${testHost}/${testUrl}/body`);

    mockGet.mockReturnValue({
      test: 123,
    });

    nock(testHost)
      .get(`/${testUrl}/body`)
      .reply(200, mockGet);

    return expect(storeURL(mockedSession, mockHandle, {})).rejects.toEqual(expect.any(Error));
  });
});
