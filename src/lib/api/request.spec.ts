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

import { requestWithSource, multipart } from './request';
import axios from 'axios';
import * as FormData from 'form-data';

jest.mock('axios');
jest.mock('form-data');

describe('Request', () => {
  afterEach(() => {
    FormData.mockClear();
  });

  it('should set correct source', () => {
    requestWithSource();
    expect(axios.create).toHaveBeenCalledWith({ headers: { 'Filestack-Source': 'JS-@{VERSION}' } });
  });

  describe('multipart', () => {
    it('should make correct request with multipart data', () => {
      multipart('test', {
        test: 1,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('test', 1);
      expect(axios.post).toHaveBeenCalledWith('test', expect.any(FormData), {
        headers: { 'Filestack-Source': 'JS-@{VERSION}' },
      });
    });

    it('should make correct request with json data fields', () => {
      multipart('test', {
        test: { test: 1 },
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('test', JSON.stringify({ test: 1 }));
      expect(axios.post).toHaveBeenCalledWith('test', expect.any(FormData), {
        headers: { 'Filestack-Source': 'JS-@{VERSION}' },
      });
    });

    it('should skip undefined fields', () => {
      multipart('test', {
        test: 1,
        test2: undefined,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('test', 1);
      expect(FormData.prototype.append).not.toHaveBeenCalledWith('test2', 2);
      expect(axios.post).toHaveBeenCalledWith('test', expect.any(FormData), {
        headers: { 'Filestack-Source': 'JS-@{VERSION}' },
      });
    });

    it('should respect user defined headers', () => {
      multipart('test', {
        test: 1,
      }, {
        headers: {
          test: 1,
        },
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('test', 1);
      expect(axios.post).toHaveBeenCalledWith('test', expect.any(FormData), {
        headers: { 'Filestack-Source': 'JS-@{VERSION}', test: 1 },
      });
    });

    it('should set 0 and false values to fd', () => {
      multipart('test', {
        test: 0,
        test1: false,
      });

      expect(FormData.prototype.append).toHaveBeenCalledWith('test', 0);
      expect(FormData.prototype.append).toHaveBeenCalledWith('test1', false);

      expect(axios.post).toHaveBeenCalledWith('test', expect.any(FormData), {
        headers: { 'Filestack-Source': 'JS-@{VERSION}' },
      });
    });
  });
});
