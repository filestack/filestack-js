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

import { picker } from './picker';
import * as filestack from './../index';

const mockPickerOpen = jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  });
});
const mockPickerCrop = jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  });
});
const mockPickerClose = jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  });
});
const mockPickerCancel = jest.fn(() => {
  return new Promise((resolve) => {
    resolve();
  });
});
jest.mock('filestack-loader', () => {
  return {
    loadModule: jest.fn((url, pickerModuleId) => {
      return new Promise((resolve, reject) => {
        resolve(jest.fn().mockImplementation(() => {
          return {
            open: mockPickerOpen,
            crop: mockPickerCrop,
            close: mockPickerClose,
            cancel: mockPickerCancel,
          };
        }));
      });
    }),
    knownModuleIds: {
      picker: '__filestack-picker-module',
    },
  };
});

describe('picker', () => {
  const defaultApikey = 'DEFAULT_API_KEY';
  const client = filestack.init(defaultApikey);
  const pickerOptions = {};
  let pickerInstance = picker(client, pickerOptions);
  afterEach(() => {
    pickerInstance = picker(client, pickerOptions);
  });
  it('should properly open picker', (done) => {
    return pickerInstance.open().then(() => {
      expect.assertions(1);
      expect(mockPickerOpen).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it('should properly crop picker', (done) => {
    const pickerOptions = {};
    const pickerInstance = picker(client, pickerOptions);
    const files = ['file1.txt', 'file2.txt'];
    return pickerInstance.crop(files).then(() => {
      expect.assertions(2);
      expect(mockPickerCrop).toHaveBeenCalledTimes(1);
      expect(mockPickerCrop).toHaveBeenCalledWith(files);
      done();
    });
  });
  it('should properly close picker', (done) => {
    return pickerInstance.close().then(() => {
      expect.assertions(1);
      expect(mockPickerClose).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it('should properly cancel picker', (done) => {
    return pickerInstance.cancel().then(() => {
      expect.assertions(1);
      expect(mockPickerCancel).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
