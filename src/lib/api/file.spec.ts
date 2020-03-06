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

import { retrieve, remove, metadata } from './file';
import { FsRequest } from './../request';
import { Session } from '../client';
import { config } from './../../config';

jest.mock('./../request');
jest.mock('./../filelink');

const mockedSession: Session = {
  apikey: 'fakeApikey',
  urls: Object.assign({}, config.urls, {
    cdnUrl: 'fakeUrl',
    fileApiUrl: 'fakeApiUrl',
    uploadApiUrl: 'fakeUploadApiUrl',
    cloudApiUrl: 'fakeCloudApiUrl',
    pickerUrl: 'fakePickerUrl',
  }),
};

describe('FileAPI', () => {
  describe('Metadata', () => {
    it('should call correct metadata without options', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));
      // @ts-ignore
      FsRequest.get.mockImplementation(methodMocked);
      const resp = await metadata(mockedSession, 'fakeHandle');

      expect(resp).toEqual({ handle: 'fakeHandle' });
      expect(methodMocked).toHaveBeenLastCalledWith('fakeApiUrl/fakeHandle/metadata', { params: {}, filestackHeaders: false });
    });

    it('should call correct metadata with options', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));
      // @ts-ignore
      FsRequest.get.mockImplementation(methodMocked);
      const resp = await metadata(mockedSession, 'fakeHandle', { size: true });

      expect(resp).toEqual({ handle: 'fakeHandle' });
      expect(methodMocked).toHaveBeenLastCalledWith('fakeApiUrl/fakeHandle/metadata', { params: { size: true }, filestackHeaders: false });
    });

    it('should throw on wrong option', async () => {
      // @ts-ignore
      return expect(() => metadata(mockedSession, 'fakekey', { bla: 123 })).toThrowError('Invalid metadata params');
    });

    it('should throw an error on empty handle', () => {
      return expect(() => metadata(mockedSession)).toThrowError();
    });

    it('should respect provided security options', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      FsRequest.get.mockImplementation(() => Promise.resolve({ data: {} }));
      const resp = await metadata(mockedSession, 'fakeHandle', {}, fakeSecurity);

      expect(resp).toEqual({ handle: 'fakeHandle' });
    });
  });

  describe('Remove', () => {
    it('should call remove', async () => {
      const deleteMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      FsRequest.delete.mockImplementation(deleteMocked);
      const resp = await remove(
        Object.assign({}, mockedSession, {
          signature: 'fakeS',
          policy: 'fakeP',
        }),
        'fakeHandle'
      );

      expect(resp).toEqual({ data: {} });
      expect(deleteMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS' }, filestackHeaders: false });
    });

    it('should respect skip storage option', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      FsRequest.delete.mockImplementation(methodMocked);
      const resp = await remove(
        Object.assign({}, mockedSession, {
          signature: 'fakeS',
          policy: 'fakeP',
        }),
        'fakeHandle',
        true
      );

      expect(resp).toEqual({ data: {} });
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS', skip_storage: true }, filestackHeaders: false });
    });

    it('should throw on empty handle', () => {
      expect(() => remove(mockedSession)).toThrowError();
    });

    it('should call remove with provided session', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      FsRequest.delete.mockImplementation(() => Promise.resolve({ data: {} }));
      const resp = await remove(mockedSession, 'fakeHandle', false, fakeSecurity);

      expect(resp).toEqual({ data: {} });
    });

    it('should throw on empty signature', async () => {
      const fakeSecurity = {
        signature: null,
        policy: 'fakeP',
      };

      expect(() => remove(mockedSession, 'fakeHandle', false, fakeSecurity)).toThrowError();
    });

    it('should throw on empty policy', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: null,
      };

      expect(() => remove(mockedSession, 'fakeHandle', false, fakeSecurity)).toThrowError();
    });

    it('should throw on empty policy on session', async () => {
      return expect(() => remove(mockedSession, 'fakeHandle')).toThrowError();
    });
  });

  describe('Retrieve', () => {
    it('should make correct retrieve request (GET)', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      FsRequest.dispatch.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle');

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { method: 'GET', params: { key: 'fakeApikey' }, filestackHeaders: false });
    });

    it('should make correct retrieve request (HEAD)', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {}, headers: { type: 'test' } }));

      // @ts-ignore
      FsRequest.dispatch.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        head: true,
      });

      expect(resp).toEqual({ type: 'test' });
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { method: 'HEAD', params: { key: 'fakeApikey' }, filestackHeaders: false });
    });

    it('should make correct retrieve request with provided security', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      FsRequest.dispatch.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {}, fakeSecurity);

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', {
        method: 'GET',
        params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS' },
        filestackHeaders: false,
      });
    });

    it('should make correct retrieve request with extension', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      FsRequest.dispatch.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        extension: 'txt',
      });

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle+txt', { method: 'GET', params: { key: 'fakeApikey' }, filestackHeaders: false });
    });

    it('should make correct retrieve request with metadata', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      FsRequest.dispatch.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        metadata: true,
      });

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle/metadata', { method: 'GET', params: { key: 'fakeApikey' }, filestackHeaders: false });
    });

    it('should throw an error on empty handle', () => {
      return expect(() => retrieve(mockedSession, '')).toThrowError();
    });

    it('should throw an error worng options provided', () => {
      return expect(() =>
        retrieve(mockedSession, 'fakeHandle', {
          // @ts-ignore
          test: 123,
        })
      ).toThrowError('Invalid retrieve params');
    });

    it('should not throw an error worng options provided', () => {
      return expect(() =>
        retrieve(mockedSession, 'fakeHandle', {
          metadata: true,
        })
      ).not.toThrowError('Invalid retrieve params');
    });

    it('should throw an error when metadata and head is provided', () => {
      return expect(() =>
        retrieve(mockedSession, 'fakeHandle', {
          metadata: true,
          head: true,
        })
      ).toThrowError();
    });
  });
});
