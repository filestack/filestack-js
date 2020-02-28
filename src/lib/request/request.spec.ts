/*
 * Copyright (c) 2019 by Filestack.
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

import { FsRequest } from './request';
import { FsHttpMethod } from './types';
import { Dispatch } from './dispatch';

jest.mock('./dispatch');

const dispatchSpy = jest.fn(() => Promise.resolve('response'));
// @ts-ignore
Dispatch.prototype.request.mockImplementation(dispatchSpy);

describe('Request/Request', () => {
  const url = 'https://filestack.com';

  describe('dispatch', () => {
    it('should return response', async () => {
      const fsRequest = new FsRequest();
      const response = await fsRequest.dispatch({ method: FsHttpMethod.GET });

      expect(dispatchSpy).toHaveBeenCalledWith({ method: FsHttpMethod.GET });

      expect(response).toBe('response');
    });
  });

  describe('dispatch with url', () => {
    it('should return response', async () => {
      const response = await FsRequest.dispatch(url, { url: url });

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.GET,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('dispatch static method', () => {
    it('should return response', async () => {
      const response = await FsRequest.dispatch(url, { method: FsHttpMethod.GET });

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.GET,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static get method', () => {
    it('should return response', async () => {
      const response = await FsRequest.get(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.GET,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static head method', () => {
    it('should return response', async () => {
      const response = await FsRequest.head(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.HEAD,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static options method', () => {
    it('should return response', async () => {
      const response = await FsRequest.options(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.OPTIONS,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static purge method', () => {
    it('should return response', async () => {
      const response = await FsRequest.purge(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.PURGE,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static delete method', () => {
    it('should return response', async () => {
      const response = await FsRequest.delete(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.DELETE,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static post method', () => {
    it('should return response', async () => {
      const response = await FsRequest.post(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.POST,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static put method', () => {
    it('should return response', async () => {
      const response = await FsRequest.put(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.PUT,
        url: url,
      });

      expect(response).toBe('response');
    });
  });

  describe('static path method', () => {
    it('should return response', async () => {
      const response = await FsRequest.path(url);

      expect(dispatchSpy).toHaveBeenCalledWith({
        method: FsHttpMethod.PATH,
        url: url,
      });

      expect(response).toBe('response');
    });
  });
});
