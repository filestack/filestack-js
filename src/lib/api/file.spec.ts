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
import * as axios from 'axios';
import { Session } from '../client';

jest.mock('axios');
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

describe('FileAPI', () => {
  describe('Metadata', () => {
    it('should call correct metadata without options', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));
      // @ts-ignore
      axios.get.mockImplementation(methodMocked);
      const resp = await metadata(mockedSession, 'fakeHandle');

      expect(resp).toEqual({ handle: 'fakeHandle' });
      expect(methodMocked).toHaveBeenLastCalledWith('fakeApiUrl/fakeHandle/metadata', { params: {} });
    });

    it('should call correct metadata with options', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));
      // @ts-ignore
      axios.get.mockImplementation(methodMocked);
      const resp = await metadata(mockedSession, 'fakeHandle', { size: true });

      expect(resp).toEqual({ handle: 'fakeHandle' });
      expect(methodMocked).toHaveBeenLastCalledWith('fakeApiUrl/fakeHandle/metadata', { params: { size: true } });
    });

    it('should throw on wrong option', async () => {
      expect(() => {
        // @ts-ignore
        metadata(mockedSession, 'fakekey', { bla: 123 });
      }).toThrowError();
    });

    it('should throw an error on empty handle', () => {
      expect(() => {
        metadata(mockedSession);
      }).toThrowError();
    });

    it('should respect provided security options', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      axios.get.mockImplementation(() => Promise.resolve({ data: {} }));
      const resp = await metadata(mockedSession, 'fakeHandle', {}, fakeSecurity);

      expect(resp).toEqual({ handle: 'fakeHandle' });
    });
  });

  describe('Remove', () => {
    it('should call remove', async () => {
      const deleteMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      axios.delete.mockImplementation(deleteMocked);
      const resp = await remove(
        Object.assign({}, mockedSession, {
          signature: 'fakeS',
          policy: 'fakeP',
        }),
        'fakeHandle'
      );

      expect(resp).toEqual({ data: {} });
      expect(deleteMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS' } });
    });

    it('should respect skip storage option', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      axios.delete.mockImplementation(methodMocked);
      const resp = await remove(
        Object.assign({}, mockedSession, {
          signature: 'fakeS',
          policy: 'fakeP',
        }),
        'fakeHandle',
        true
      );

      expect(resp).toEqual({ data: {} });
      expect(methodMocked).toHaveBeenCalledWith('fakeApiUrl/fakeHandle', { params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS', skip_storage: true } });
    });

    it('should throw on empty handle', () => {
      expect(() => {
        remove(mockedSession);
      }).toThrowError();
    });

    it('should call remove with provided session', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      axios.delete.mockImplementation(() => Promise.resolve({ data: {} }));
      const resp = await remove(mockedSession, 'fakeHandle', false, fakeSecurity);

      expect(resp).toEqual({ data: {} });
    });

    it('should throw on empty signature', async () => {
      const fakeSecurity = {
        signature: null,
        policy: 'fakeP',
      };

      expect(() => {
        remove(mockedSession, 'fakeHandle', false, fakeSecurity);
      }).toThrowError();
    });

    it('should throw on empty policy', async () => {
      const fakeSecurity = {
        signature: 'fakeS',
        policy: null,
      };

      expect(() => {
        remove(mockedSession, 'fakeHandle', false, fakeSecurity);
      }).toThrowError();
    });

    it('should throw on empty policy on session', async () => {
      expect(() => {
        remove(mockedSession, 'fakeHandle');
      }).toThrowError();
    });
  });

  describe('Retrieve', () => {
    it('should make correct retrieve request (GET)', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      axios.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle');

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith({ method: 'get', params: { key: 'fakeApikey' }, url: 'fakeApiUrl/fakeHandle' });
    });

    it('should make correct retrieve request (HEAD)', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {}, headers: { type: 'test' } }));

      // @ts-ignore
      axios.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        head: true,
      });

      expect(resp).toEqual({ type: 'test' });
      expect(methodMocked).toHaveBeenCalledWith({ method: 'head', params: { key: 'fakeApikey' }, url: 'fakeApiUrl/fakeHandle' });
    });

    it('should make correct retrieve request with provided security', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      const fakeSecurity = {
        signature: 'fakeS',
        policy: 'fakeP',
      };

      // @ts-ignore
      axios.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {}, fakeSecurity);

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith({
        method: 'get',
        params: { key: 'fakeApikey', policy: 'fakeP', signature: 'fakeS' },
        url: 'fakeApiUrl/fakeHandle',
      });
    });

    it('should make correct retrieve request with extension', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      axios.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        extension: 'txt',
      });

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith({ method: 'get', params: { key: 'fakeApikey' }, url: 'fakeApiUrl/fakeHandle+txt' });
    });

    it('should make correct retrieve request with metadata', async () => {
      const methodMocked = jest.fn(() => Promise.resolve({ data: {} }));

      // @ts-ignore
      axios.mockImplementation(methodMocked);
      const resp = await retrieve(mockedSession, 'fakeHandle', {
        metadata: true,
      });

      expect(resp).toEqual({});
      expect(methodMocked).toHaveBeenCalledWith({ method: 'get', params: { key: 'fakeApikey' }, url: 'fakeApiUrl/fakeHandle/metadata' });
    });

    it('should throw an error on empty handle', async () => {
      expect(() => {
        retrieve(mockedSession, '');
      }).toThrowError();
    });

    it('should throw an error when metadata and head is provided', async () => {
      expect(() => {
        retrieve(mockedSession, 'fakeHandle', {
          metadata: true,
          head: true,
        });
      }).toThrowError();
    });
  });
});
