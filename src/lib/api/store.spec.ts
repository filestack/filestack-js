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
import { FilestackError } from './../../filestack_error';

import { config } from './../../config';
import { FsRequest } from './../request';
import { Filelink } from './../filelink';

jest.mock('./../filelink');
jest.mock('./../request');

const mockedSession: Session = {
  apikey: 'fakeApikey',
  urls: config.urls,
};

const storeTaskDef = [{ name: 'store', params: {} }];
const sourceToStore = 'urlToStore';

describe('StoreURL', () => {

  beforeEach(() => {
    // @ts-ignore
    FsRequest.post.mockImplementation((_, options) => {
      let toReturn = {
        data: {
          handle: 'test',
        },
      };

      if (options && options.upload_tags) {
        // @ts-ignore
        toReturn.data.upload_tags = options.upload_tags;
      }

      return Promise.resolve(toReturn);
    });

    // @ts-ignore
    Filelink.prototype.getTasks.mockImplementation(() => storeTaskDef);
  });

  it('should call correct store method', async () => {
    await storeURL({ session: mockedSession, url: sourceToStore });

    expect(FsRequest.post).toHaveBeenCalledWith(`${mockedSession.urls.processUrl}/process`, {
      apikey: mockedSession.apikey,
      sources: [ sourceToStore ],
      tasks: storeTaskDef,
      upload_tags: undefined,
    }, {});
  });

  it('should respect passed security and policy', async () => {
    const fakeSecurity = {
      signature: 'fakeS',
      policy: 'fakeP',
    };

    await storeURL({ session: mockedSession, url: sourceToStore, security: fakeSecurity });

    expect(Filelink.prototype.security).toHaveBeenCalledWith(fakeSecurity);

    expect(FsRequest.post).toHaveBeenCalledWith(`${mockedSession.urls.processUrl}/process`, {
      apikey: mockedSession.apikey,
      sources: [ sourceToStore ],
      tasks: storeTaskDef,
      upload_tags: undefined,
    }, {});
  });

  it('should throw error on wrong store params', () => {
    return expect(storeURL({
      session: mockedSession,
      url: sourceToStore,
      storeParams: {
        // @ts-ignore
        test: 123,
      },
    })).rejects.toEqual(expect.any(FilestackError));
  });

  it('should respect token cancel', async () => {
    // simulate old token
    const token = {
      cancel: () => {
        console.log('cancel method');
      },
    };

    await storeURL({
      session: mockedSession,
      url: sourceToStore,
      token,
    });

    expect(FsRequest.post).toHaveBeenCalledWith(`${mockedSession.urls.processUrl}/process`, {
      apikey: mockedSession.apikey,
      sources: [ sourceToStore ],
      tasks: storeTaskDef,
      upload_tags: undefined,

      // expect.any(FsCancelToken) is not working correctly with mocked functions
    }, { cancelToken: expect.any(Object) });
  });

  it('should pass upload tags to request', async () => {
    const uploadTags = { test: '123' };

    const res = await storeURL({
      session: mockedSession,
      url: sourceToStore,
      uploadTags,
    });

    expect(FsRequest.post).toHaveBeenCalledWith(`${mockedSession.urls.processUrl}/process`, {
      apikey: mockedSession.apikey,
      sources: [ sourceToStore ],
      tasks: storeTaskDef,
      upload_tags: uploadTags,
    }, {});

    expect(res.uploadTags).toEqual(uploadTags);
  });

  it('should throw an error when missing url', () => {
    return expect(storeURL({ session: mockedSession })).rejects.toEqual(expect.any(FilestackError));
  });

  it('should throw on missing handle in response', () => {

    // @ts-ignore
    FsRequest.post.mockImplementation(() => Promise.resolve({
      data: {},
    }));

    return expect(storeURL({
      session: mockedSession,
      url: sourceToStore,
    })).rejects.toEqual(expect.any(FilestackError));
  });

});
