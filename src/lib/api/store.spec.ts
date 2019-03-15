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
import * as axios from 'axios';

jest.mock('axios');

const storeResponseBody = {
  url: 'testUrl/testHandle',
  type: 'testMimetype',
};

jest.mock('./../filelink');

const mockedSession: Session = {
  apikey: 'fakeApikey',
  urls: {
    cdnUrl: 'fakeUrl',
    fileApiUrl: 'fakeApiUrl',
    uploadApiUrl: 'fakeUploadApiUrl',
    cloudApiUrl: 'fakeCloudApiUrl',
    pickerUrl: 'fakePickerUrl',
  },
};

const responseObj = {
  url: 'testUrl/testHandle',
  type: 'testMimetype',
};

describe('StoreURL', () => {

  it('should call correct store method', async () => {
    // @ts-ignore
    axios.get.mockImplementation(() => Promise.resolve({ data: responseObj }));
    const res = await storeURL(mockedSession, 'http://test.com');

    expect(res).toEqual({
      url: 'testUrl/testHandle',
      type: 'testMimetype',
      handle: 'testHandle',
      mimetype: 'testMimetype',
    });
  });

  it('should respect passed security and policy', async () => {
    const fakeSecurity = {
      signature: 'fakeS',
      policy: 'fakeP',
    };

    // @ts-ignore
    axios.get.mockImplementation(() => Promise.resolve({ data: responseObj }));
    const res = await storeURL(mockedSession, 'fakeUrl', {}, null, fakeSecurity);

    expect(Filelink.prototype.security).toBeCalledWith(fakeSecurity);
    expect(res.url).toEqual(storeResponseBody.url);
    expect(res.handle).toEqual('testHandle');
    expect(res.mimetype).toEqual(storeResponseBody.type);
  });

  it('should respect token cancel', () => {
    const token = {
      cancel: () => jest.fn(),
    };

    // @ts-ignore
    axios.get.mockImplementation(() => new Promise((res) => {
      setTimeout(() => {
        return { data: responseObj };
      }, 100);
    }));

    expect(storeURL(mockedSession, 'fakeUrl', {}, token)).rejects.toThrowError();
    token.cancel();
  });

  it('should throw error when missing url', async () => {
    expect(() => {
      storeURL(mockedSession);
    }).toThrowError();
  });

  it('should rejects on request error', (done) => {
    // @ts-ignore
    jest.spyOn(axios, 'get').mockImplementation(() => new Promise((res, rej) => {
      rej();
    }));

    storeURL(mockedSession, 'fakehandle').then(done).catch((e) => {
      done();
    });
  });

  it('should rejects on wrong body structure', (done) => {
    // @ts-ignore
    jest.spyOn(axios, 'get').mockImplementation(() => new Promise((res) => {
      // @ts-ignore
      res({
        body: 'somebody',
      });
    }));

    storeURL(mockedSession, 'fakehandle').then(done).catch((e) => {
      done();
    });
  });

});
