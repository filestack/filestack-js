/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { preview, getUrl } from './preview';

(global as any).window = {
  open: jest.fn(),
};

const mockAppendChild = jest.fn();
(global as any).document = {
  createElement: jest.fn(() => {
    return {
      src: '',
      width: '',
      height: '',
    };
  }),
  getElementById: jest.fn((id) => {
    let obj;
    if (id === 'testId') {
      obj = {
        appendChild: mockAppendChild,
      };
    }
    return obj;
  }),
};

describe('api:upload:preview', () => {
  const defaultSession = {
    'apikey': 'TEST_API_KEY',
    'urls': {
      'fileApiUrl': 'https://www.filestackapi.com/api/file',
      'uploadApiUrl': 'https://upload.filestackapi.com',
      'cloudApiUrl': 'https://cloud.filestackapi.com',
      'cdnUrl': 'https://cdn.filestackcontent.com',
      'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
    },
  };
  describe('preview', () => {
    it('should open a proper url with preview of a file', () => {
      const handle = 'testHandle';
      preview(defaultSession, handle);
      expect(window.open).toBeCalledTimes(1);
      expect(window.open).toBeCalledWith('https://cdn.filestackcontent.com/preview/testHandle', 'testHandle');
    });
    it('should open a proper url with preview of a file with src handle', () => {
      const handle = 'src://test123/test.jpg';
      preview(defaultSession, handle);

      expect(window.open).toBeCalledTimes(1);
      expect(window.open).toBeCalledWith('https://cdn.filestackcontent.com/TEST_API_KEY/preview/src://test123/test.jpg', 'src://test123/test.jpg');
    });
    it('should open iframe inside provided options.id', () => {
      const handle = 'src://test123/test.jpg';
      const options = {
        id: 'testId',
        css: 'customCss',
      };
      preview(defaultSession, handle, options);
      const expected = { 'height': '100%', 'width': '100%', 'src': 'https://cdn.filestackcontent.com/TEST_API_KEY/preview=css:%22customCss%22/src://test123/test.jpg' };
      expect(mockAppendChild).toBeCalledTimes(1);
      expect(mockAppendChild).toBeCalledWith(expected);
    });
    it('should throw an error when handle is not provided', () => {
      expect(() => { preview(defaultSession); }).toThrow('A valid Filestack handle or storage alias is required for preview');
    });
    it('should throw an error when id provided and dom element not found', () => {
      const defaultSession = {
        'apikey': 'TEST_API_KEY',
        'urls': {
          'fileApiUrl': 'https://www.filestackapi.com/api/file',
          'uploadApiUrl': 'https://upload.filestackapi.com',
          'cloudApiUrl': 'https://cloud.filestackapi.com',
          'cdnUrl': 'https://cdn.filestackcontent.com',
          'pickerUrl': 'https://static.filestackapi.com/picker/1.4.4/picker.js'
        },
      };
      const handle = 'src://test123/test.jpg';
      const options = {
        id: 'testId2',
      };
      expect(() => { preview(defaultSession, handle, options); }).toThrow('DOM Element with id "testId2" not found.');
    });
  });
  describe('getUrl', () => {
    it('should be able to get url with security', () => {
      const handle = 'TEST_HANDLE';
      const options = {
        id: 'testId2',
      };
      const security = {
        policy: 'eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYmZUTkNpZ1JMcTBRTU9yc0ZLemIifQ==',
        signature: 'ab1624c9f219ca0118f1af43d21ee87a09a07645c15c9fdbb7447818739c2b8b',
      };
      const result = getUrl(defaultSession, handle, options, security);
      const expected = 'https://cdn.filestackcontent.com/preview/security=policy:eyJleHBpcnkiOjE1MjM1OTU2MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYmZUTkNpZ1JMcTBRTU9yc0ZLemIifQ==,signature:ab1624c9f219ca0118f1af43d21ee87a09a07645c15c9fdbb7447818739c2b8b/TEST_HANDLE';
      expect(result).toBe(expected);
    });
  });
});
