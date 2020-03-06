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
import { FilestackError } from './../filestack_error';
import { config } from './../config';
import { Client } from './client';
import { CloudClient } from './api/cloud';
import { Upload } from './api/upload/upload';
import { picker } from './picker';
import { preview } from './api/preview';
import { metadata, remove, retrieve } from './api/file';
import { storeURL } from './api/store';
import { transform } from './api/transform';

jest.mock('./api/upload/upload');
jest.mock('./api/cloud');
jest.mock('./api/file');
jest.mock('./api/store');
jest.mock('./picker');
jest.mock('./api/preview');
jest.mock('./api/transform');

describe('client', () => {
  const defaultApikey = 'EXAMPLE_API_KEY';
  const defaultHandle = 'EXAMPLE_HANDLE';
  const defaultSecurity = {
    policy: 'examplePolicy',
    signature: 'exampleSignature',
  };

  const sessionURls = config.urls;
  const defaultSession = {
    apikey: defaultApikey,
    urls: sessionURls,
  };

  it('should properly instantiate Client', () => {
    const client = new Client(defaultApikey);
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Client);
  });

  it('should throw an error if api key not provided', () => {
    expect(() => {
      return new Client('');
    }).toThrow('An apikey is required to initialize the Filestack client');
  });

  it('should throw an error if provided security without signature', () => {
    const options = {
      security: {
        policy: 'examplePolicy',
        signature: '',
      },
    };
    expect(() => {
      return new Client(defaultApikey, options);
    }).toThrow('Both policy and signature are required for client security');
  });

  it('should pass policy & signature to the session', () => {
    const options = {
      security: defaultSecurity,
    };
    const client = new Client(defaultApikey, options);
    expect(client.session.policy).toBe(options.security.policy);
    expect(client.session.signature).toBe(options.security.signature);
  });

  it('should pass cname to the session', () => {
    const options = {
      cname: 'testCname.com',
    };
    const client = new Client(defaultApikey, options);
    expect(client.session.cname).toBe(options.cname);
  });

  it('should be able to logout for provied cloud', async () => {
    const client = new Client(defaultApikey);
    const cloudName = 'dropbox';
    await client.logout(cloudName);

    expect(CloudClient.prototype.logout).toHaveBeenCalledWith(cloudName);
  });

  it('should get metadata for a provided handle', async () => {
    const client = new Client(defaultApikey);
    const options = {
      sha224: true,
    };

    await client.metadata(defaultHandle, options, defaultSecurity);
    expect(metadata).toHaveBeenCalledWith(defaultSession, defaultHandle, options, defaultSecurity);
  });

  it('should be able to open picker', () => {
    const client = new Client(defaultApikey);
    const pickerOptions = {
      lang: 'de',
    };
    client.picker(pickerOptions);

    expect(picker).toHaveBeenCalledWith(client, pickerOptions);
  });

  it('should be able to open preview', () => {
    const client = new Client(defaultApikey);
    const previewOptions = {
      id: 'testElement',
    };
    client.preview(defaultHandle, previewOptions);

    expect(preview).toHaveBeenCalledWith(defaultSession, defaultHandle, previewOptions);
  });

  it('should be able to remove handle', async () => {
    const client = new Client(defaultApikey);
    await client.remove(defaultHandle, defaultSecurity);
    expect(remove).toHaveBeenCalledWith(defaultSession, defaultHandle, false, defaultSecurity);
  });

  it('should be able to remove metadata', async () => {
    const client = new Client(defaultApikey);
    await client.removeMetadata(defaultHandle, defaultSecurity);

    expect(remove).toHaveBeenCalledWith(defaultSession, defaultHandle, true, defaultSecurity);
  });

  it('should be able to store url', async () => {
    const client = new Client(defaultApikey);
    const url = 'http://example.com/img3.jpg';
    const options = {};
    const token = {};
    const uploadTags = { test: '123' };
    await client.storeURL(url, options, token, defaultSecurity, uploadTags);

    expect(storeURL).toHaveBeenCalledWith({
      session: defaultSession,
      url,
      storeParams: options,
      token,
      security: defaultSecurity,
      uploadTags,
    });
  });

  it('should be able to retrieve handle', async () => {
    const client = new Client(defaultApikey);
    const retrieveOptions = {};

    await client.retrieve(defaultHandle, retrieveOptions, defaultSecurity);
    expect(retrieve).toHaveBeenCalledWith(defaultSession, defaultHandle, retrieveOptions, defaultSecurity);
  });

  it('should be able to transform url with b64', () => {
    const client = new Client(defaultApikey);
    const transformOptions = {
      blur: {
        amount: 5,
      },
    };
    const b64 = true;
    client.transform(defaultHandle, transformOptions, b64);
    expect(transform).toHaveBeenCalledWith(defaultSession, defaultHandle, transformOptions, b64);
  });

  it('should be able to transform url without b64', () => {
    const client = new Client(defaultApikey);
    const transformOptions = {
      blur: {
        amount: 5,
      },
    };
    client.transform(defaultHandle, transformOptions);
    expect(transform).toHaveBeenCalledWith(defaultSession, defaultHandle, transformOptions, false);
  });

  it('should be able to upload file', async () => {
    const client = new Client(defaultApikey);
    const file = 'anyFile';
    const uploadOptions = {};
    const storeOptions = {};
    const token = {};

    spyOn(Upload.prototype, 'upload').and.returnValue(Promise.resolve());

    await client.upload(file, uploadOptions, storeOptions, token, defaultSecurity);

    expect(Upload.prototype.setSession).toHaveBeenCalledWith({
      apikey: defaultApikey,
      urls: sessionURls,
    });

    expect(Upload.prototype.setToken).toHaveBeenCalledWith(token);
    expect(Upload.prototype.setSecurity).toHaveBeenCalledWith(defaultSecurity);
    expect(Upload.prototype.upload).toHaveBeenCalledWith(file);
  });

  it('should be able to upload file without token and security', async () => {
    const client = new Client(defaultApikey);
    const file = 'anyFile';
    const uploadOptions = {};
    const storeOptions = {};

    spyOn(Upload.prototype, 'upload').and.returnValue(Promise.resolve());

    await client.upload(file, uploadOptions, storeOptions);

    expect(Upload.prototype.setSession).toHaveBeenCalledWith({
      apikey: defaultApikey,
      urls: sessionURls,
    });

    expect(Upload.prototype.upload).toHaveBeenCalledWith(file);
  });

  it('should emit error', async () => {
    const client = new Client(defaultApikey);
    const file = 'anyFile';
    const uploadOptions = {};
    const storeOptions = {};
    const token = {};
    const mockOnError = jest.fn().mockName('mockOnError');

    const test = new FilestackError('test');

    client.on('upload.error', mockOnError);

    jest.spyOn(Upload.prototype, 'on').mockImplementation((name, cb, ctx): any => cb(test));

    await client.upload(file, uploadOptions, storeOptions, token, defaultSecurity);

    expect(mockOnError).toHaveBeenCalledWith(test);
  });

  it('should be able to multiupload file', async () => {
    const client = new Client(defaultApikey);
    const files = ['anyFile'];
    const uploadOptions = {};
    const storeOptions = {};
    const token = {};

    spyOn(Upload.prototype, 'multiupload').and.returnValue(Promise.resolve());

    await client.multiupload(files, uploadOptions, storeOptions, token, defaultSecurity);

    expect(Upload.prototype.setSession).toHaveBeenCalledWith({
      apikey: defaultApikey,
      urls: sessionURls,
    });

    expect(Upload.prototype.setToken).toHaveBeenCalledWith(token);
    expect(Upload.prototype.setSecurity).toHaveBeenCalledWith(defaultSecurity);
    expect(Upload.prototype.multiupload).toHaveBeenCalledWith(files);
  });

  it('should call multiupload without security or token', async () => {
    const client = new Client(defaultApikey);
    const files = ['anyFile'];
    const uploadOptions = {};
    const storeOptions = {};

    spyOn(Upload.prototype, 'multiupload').and.returnValue(Promise.resolve());

    await client.multiupload(files, uploadOptions, storeOptions);

    expect(Upload.prototype.setSession).toHaveBeenCalledWith({
      apikey: defaultApikey,
      urls: sessionURls,
    });

    expect(Upload.prototype.multiupload).toHaveBeenCalledWith(files);
  });

  it('should emit error for multiupload', async () => {
    const client = new Client(defaultApikey);
    const files = ['anyFile'];
    const uploadOptions = {};
    const storeOptions = {};
    const token = {};

    spyOn(Upload.prototype, 'multiupload').and.returnValue(Promise.resolve());

    const mockOnError = jest.fn().mockName('mockOnError');

    const test = new FilestackError('test');

    client.on('upload.error', mockOnError);

    jest.spyOn(Upload.prototype, 'on').mockImplementation((name, cb, ctx): any => cb(test));

    await client.multiupload(files, uploadOptions, storeOptions, token, defaultSecurity);

    expect(mockOnError).toHaveBeenCalledWith(test);
  });
});
