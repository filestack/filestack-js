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

const mockPickerOpen = jest.fn(() => Promise.resolve());

const mockPickerCrop = jest.fn(() => Promise.resolve());
const mockPickerClose = jest.fn(() => Promise.resolve());
const mockPickerCancel = jest.fn(() => Promise.resolve());

jest.mock('filestack-loader', () => {
  return {
    loadModule: jest.fn(() => {
      return new Promise((resolve) => {
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

let pickerInstance;
let client;

describe('picker', () => {
  beforeAll(() => {
    const defaultApikey = 'DEFAULT_API_KEY';
    client = filestack.init(defaultApikey);
  });

  beforeEach(() => {
    pickerInstance = picker(client, {});
  });

  it('should properly open picker', async () => {
    await pickerInstance.open();
    expect(mockPickerOpen).toHaveBeenCalledTimes(1);
  });

  it('should properly crop picker', async () => {
    const files = ['file1.txt', 'file2.txt'];

    await pickerInstance.crop(files);
    expect.assertions(2);
    expect(mockPickerCrop).toHaveBeenCalledTimes(1);
    expect(mockPickerCrop).toHaveBeenCalledWith(files);
  });

  it('should properly close picker', async () => {
    await pickerInstance.close();
    expect(mockPickerClose).toHaveBeenCalledTimes(1);
  });

  it('should properly cancel picker', async () => {
    await pickerInstance.cancel();
    expect(mockPickerCancel).toHaveBeenCalledTimes(1);
  });
});
