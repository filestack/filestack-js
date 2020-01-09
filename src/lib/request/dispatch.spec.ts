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

import * as nock from 'nock';
import { Dispatch } from './dispatch';
import { HttpAdapter } from './adapters/http';
import { FsHttpMethod } from './types';
import { FsRequestError, FsRequestErrorCode } from './error';

jest.mock('./adapters/http');

describe('Request/Dispatch', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const adapter = new HttpAdapter();
  const url = 'https://filestack.com';
  const configBase = {
    url: url,
    method: FsHttpMethod.GET,
  };
  let fsResponseBase = {
    status: 400,
    statusText: 'error',
    headers: null,
    data: null,
    config: configBase,
  };

  describe('dispatch request', () => {
    it('should return req', async () => {
      spyOn(adapter, 'request').and.callFake(() => Promise.resolve());
      const dispatch = new Dispatch(adapter);
      const req = { url, method: FsHttpMethod.GET, headers: {} };
      await dispatch.request(req);
      expect(adapter.request).toHaveBeenCalledWith(req);
    });
  });

  describe('dispatch request catch', () => {
    it('should return config base', async () => {
      const error = new FsRequestError('error msg', configBase, fsResponseBase);
      spyOn(adapter, 'request').and.callFake(() => Promise.reject(error));
      const dispatch = new Dispatch(adapter);
      const request = await dispatch.request(configBase).catch(err => err);
      expect(adapter.request).toHaveBeenCalledWith(configBase);
    });

    it('should return config base', async () => {
      fsResponseBase.status = 500;
      const error = new FsRequestError('error msg', configBase, fsResponseBase, FsRequestErrorCode.NETWORK);
      spyOn(adapter, 'request').and.callFake(() => Promise.reject(error));
      const dispatch = new Dispatch(adapter);
      await dispatch.request(configBase).catch(err => err);
      expect(adapter.request).toHaveBeenCalledWith(configBase);
    });

    it('should return config', async () => {
      const config = {
        url: url,
        method: FsHttpMethod.GET,
        headers: {},
        retry: {
          retry: 3,
        },
      };
      fsResponseBase.status = 500;
      const error = new FsRequestError('error msg', config, fsResponseBase, FsRequestErrorCode.NETWORK);
      spyOn(adapter, 'request').and.callFake(() => Promise.reject(error));
      const dispatch = new Dispatch(adapter);
      await dispatch.request(config).catch(err => err);
      expect(adapter.request).toHaveBeenCalledWith(config);
    });
  });
});
