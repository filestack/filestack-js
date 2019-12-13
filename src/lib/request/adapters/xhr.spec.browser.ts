/*
 * Copyright (c) 2018 by Filestack
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
import * as utils from '../utils';
import { XhrAdapter } from './xhr';
import { FsHttpMethod } from '../types';
import { FsCancelToken } from '../token';

describe('Request/Adapters/xhr', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  beforeAll(() => {
    spyOn(utils, 'isNode').and.returnValue(false);
  });

  const url = 'https://filestack.com';
  const scope = nock(url);

  describe('request basic', () => {
    it('should return req', async () => {
      const options = {
        url: url,
        method: FsHttpMethod.GET,
      };
      scope.get('/').reply(200, 'ok', { 'access-control-allow-origin': '*' });
      const adapter = new XhrAdapter();
      const res = await adapter.request(options);
      expect(res.status).toEqual(200);
      scope.done();
    });
  });

  describe('request auth', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe('request form', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        data: new FormData(),
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe('request FsCancelToken', () => {
    it('should return req', async () => {
      const auth = {
        username: 'test',
        password: 'test',
      };

      const options = {
        url: url,
        method: FsHttpMethod.GET,
        cancelToken: new FsCancelToken(),
        auth,
      };

      scope.options('/').reply(200, 'ok', {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization',
      });

      scope
        .get('/')
        .basicAuth({ user: auth.username, pass: auth.password })
        .reply(200, 'ok');

      const adapter = new XhrAdapter();
      const res = await adapter.request(options);

      expect(res.status).toEqual(200);

      scope.done();
    });
  });

  describe.only('request delay', () => {
    it('should return req', async () => {
      const options = {
        url: url,
        method: FsHttpMethod.GET,
      };
      scope.get('/').replyWithError(200, 'ok', { 'access-control-allow-origin': '*' });
      const adapter = new XhrAdapter();
      const res = await adapter.request(options);
      expect(res.status).toEqual(200);
      scope.done();
    });
  });

});
