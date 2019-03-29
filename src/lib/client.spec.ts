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

import { Client } from './client';

const mockCloudLogout = jest.fn(() => {
  return new Promise((resolve, reject) => {
    resolve();
  });
});
jest.mock('./api/cloud', () => {
  return {
    CloudClient: jest.fn().mockImplementation(() => {
      return {
        logout: mockCloudLogout,
      };
    }),
  };
});

const mockMetadata = jest.fn();
const mockRemove = jest.fn();
const mockRetrieve = jest.fn();
jest.mock('./api/file', () => {
  return {
    metadata: (session, handle, options, security) => {
      return new Promise((resolve, reject) => {
        mockMetadata(session, handle, options, security);
        resolve();
      });
    },
    remove: (session, handle, skipStorage, security) => {
      return new Promise((resolve, reject) => {
        mockRemove(session, handle, skipStorage, security);
        resolve();
      });
    },
    retrieve: (session, handle, options, security) => {
      return new Promise((resolve, reject) => {
        mockRetrieve(session, handle, options, security);
        resolve();
      });
    },
  };
});

const mockStoreURL = jest.fn();
jest.mock('./api/store', () => {
  return {
    storeURL: (session, url, options, token, security) => {
      return new Promise((resolve, reject) => {
        mockStoreURL(session, url, options, token, security);
        resolve();
      });
    },
  };
});

const mockUpload = jest.fn();
jest.mock('./api/upload', () => {
  return {
    upload: (session, file, options, storeOptions, token, security) => {
      return new Promise((resolve, reject) => {
        mockUpload(session, file, options, storeOptions, token, security);
        resolve();
      });
    },
  };
});

const mockPicker = jest.fn();
jest.mock('./picker', () => {
  return {
    picker: (thisArg, options) => {
      return mockPicker(thisArg, options);
    },
  };
});

const mockPreview = jest.fn();
jest.mock('./api/preview', () => {
  return {
    preview: (session, handle, options) => {
      return mockPreview(session, handle, options);
    },
  };
});

const mockTransform = jest.fn();
jest.mock('./api/transform', () => {
  return {
    transform: (session, url, options, b64) => {
      return mockTransform(session, url, options, b64);
    },
  };
});

describe('client', () => {
  const defaultApikey = 'EXAMPLE_API_KEY';
  const defaultHandle = 'EXAMPLE_HANDLE';
  const defaultSecurity = {
    policy: 'examplePolicy',
    signature: 'exampleSignature',
  };
  it('should properly instantiate Client', () => {
    const client = new Client(defaultApikey);
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Client);
  });
  it('should throw an error if api key not provided', () => {
    expect(() => { return new Client(''); }).toThrow('An apikey is required to initialize the Filestack client');
  });
  it('should throw an error if provided security without signature', () => {
    const options = {
      security: {
        policy: 'examplePolicy',
        signature: '',
      },
    };
    expect(() => { return new Client(defaultApikey, options); }).toThrow('Both policy and signature are required for client security');
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
  it('should be able to logout for provied cloud', (done) => {
    const client = new Client(defaultApikey);
    const cloudName = 'dropboxx';
    return client.logout(cloudName).then(() => {
      expect.assertions(2);
      expect(mockCloudLogout).toHaveBeenCalledTimes(1);
      expect(mockCloudLogout).toHaveBeenCalledWith(cloudName);
      done();
    });
  });
  it('should get metadata for a provided handle', (done) => {
    const client = new Client(defaultApikey);
    const options = {
      sha224: true,
    };
    return client.metadata(defaultHandle, options, defaultSecurity).then(() => {
      expect.assertions(2);
      expect(mockMetadata).toHaveBeenCalledTimes(1);
      expect(mockMetadata).toHaveBeenCalledWith(client.session, defaultHandle, options, defaultSecurity);
      done();
    });
  });
  it('should be able to open picker', () => {
    const client = new Client(defaultApikey);
    const pickerOptions = {
      lang: 'de',
    };
    client.picker(pickerOptions);
    expect(mockPicker).toBeCalled();
    expect(mockPicker).toBeCalledWith(expect.any(Object), pickerOptions);
  });
  it('should be able to open preview', () => {
    const client = new Client(defaultApikey);
    const previewOptions = {
      id: 'testElement',
    };
    client.preview(defaultHandle, previewOptions);
    expect(mockPreview).toBeCalled();
    expect(mockPreview).toBeCalledWith(expect.any(Object), defaultHandle, previewOptions);
  });
  it('should be able to remove handle', (done) => {
    const client = new Client(defaultApikey);
    return client.remove(defaultHandle, defaultSecurity).then(() => {
      expect.assertions(2);
      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith(client.session, defaultHandle, false, defaultSecurity);
      done();
    });
  });
  it('should be able to remove metadata', (done) => {
    const client = new Client(defaultApikey);
    return client.removeMetadata(defaultHandle, defaultSecurity).then(() => {
      expect.assertions(2);
      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith(client.session, defaultHandle, true, defaultSecurity);
      done();
    });
  });
  it('should be able to store url', (done) => {
    const client = new Client(defaultApikey);
    const url = 'http://example.com/img3.jpg';
    const options  = {};
    const token = '2r313r23r23';
    return client.storeURL(url, options, token, defaultSecurity).then(() => {
      expect.assertions(2);
      expect(mockStoreURL).toHaveBeenCalledTimes(1);
      expect(mockStoreURL).toHaveBeenCalledWith(client.session, url, options, token, defaultSecurity);
      done();
    });
  });
  it('should be able to retrieve handle', (done) => {
    const client = new Client(defaultApikey);
    const retrieveOptions = {};
    const security = {
      policy: 'examplePolicy',
      signature: 'exampleSignature',
    };
    return client.retrieve(defaultHandle, retrieveOptions, security).then(() => {
      expect.assertions(2);
      expect(mockRetrieve).toHaveBeenCalledTimes(1);
      expect(mockRetrieve).toHaveBeenCalledWith(client.session, defaultHandle, retrieveOptions, security);
      done();
    });
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
    expect(mockTransform).toBeCalled();
    expect(mockTransform).toBeCalledWith(client.session, defaultHandle, transformOptions, b64);
  });
  it('should be able to transform url without b64', () => {
    const client = new Client(defaultApikey);
    const transformOptions = {
      blur: {
        amount: 5,
      },
    };
    client.transform(defaultHandle, transformOptions);
    expect(mockTransform).toBeCalled();
    expect(mockTransform).toBeCalledWith(client.session, defaultHandle, transformOptions, false);
  });
  it('should be able to upload file', (done) => {
    const client = new Client(defaultApikey);
    const file = 'anyFile';
    const uploadOptions = {};
    const storeOptions = {};
    const token = 'exampleSignature';
    return client.upload(file, uploadOptions, storeOptions, token, defaultSecurity).then(() => {
      expect.assertions(2);
      expect(mockUpload).toHaveBeenCalledTimes(1);
      expect(mockUpload).toHaveBeenCalledWith(client.session, file, uploadOptions, storeOptions, token, defaultSecurity);
      done();
    });
  });
});
