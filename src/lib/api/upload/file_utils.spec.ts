/*
 * Copyright (c) 2019 by Filestack.
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

import { getPart, getFile } from './file_utils';
import { Status } from './types';

jest.mock('fs', () => {
  return {
    readFile: jest.fn().mockImplementation((path, cb) => {
      if (path === './../logo_png.png') {
        cb(null, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 20, 0, 0, 0, 20, 8, 6, 0, 0, 0, 141, 137, 29, 13, 0, 0, 0, 6, 98, 75, 71, 68, 0, 255, 0, 255, 0, 255, 160, 189, 167, 147, 0, 0, 0, 248, 73, 68, 65, 84, 56, 203, 99, 248, 255, 255, 63, 75, 252, 186, 235, 137, 102, 243, 46, 188, 208, 156, 117, 238, 63, 57, 24, 164, 23, 100, 6, 200, 44, 134, 180, 141, 55, 211, 200, 53, 8, 29, 131, 12, 101, 160, 196, 101, 216, 92, 202, 64, 45, 195, 96, 24, 175, 129, 53, 187, 238, 254, 95, 116, 246, 57, 28, 251, 175, 184, 74, 158, 129, 246, 11, 46, 254, 191, 251, 246, 219, 127, 116, 144, 183, 229, 22, 97, 3, 101, 103, 156, 197, 16, 92, 119, 249, 213, 127, 108, 128, 144, 129, 32, 179, 24, 24, 138, 118, 255, 103, 168, 63, 248, 159, 161, 251, 248, 127, 190, 169, 103, 192, 18, 232, 174, 59, 250, 224, 3, 78, 47, 131, 244, 128, 244, 130, 205, 0, 153, 5, 38, 144, 113, 233, 30, 12, 151, 49, 180, 29, 65, 197, 141, 135, 255, 51, 212, 28, 0, 171, 197, 208, 15, 103, 244, 158, 248, 191, 255, 238, 59, 48, 70, 7, 48, 113, 144, 26, 12, 3, 112, 25, 40, 52, 237, 204, 127, 66, 0, 164, 102, 224, 12, 100, 168, 62, 0, 214, 128, 205, 96, 152, 56, 72, 13, 241, 6, 34, 97, 140, 72, 33, 100, 200, 168, 129, 247, 169, 104, 224, 125, 144, 129, 1, 84, 52, 48, 128, 1, 12, 32, 134, 238, 135, 97, 44, 6, 238, 199, 131, 223, 67, 125, 9, 54, 12, 0, 87, 126, 31, 109, 180, 228, 26, 37, 0, 0, 0, 25, 116, 69, 88, 116, 83, 111, 102, 116, 119, 97, 114, 101, 0, 65, 100, 111, 98, 101, 32, 73, 109, 97, 103, 101, 82, 101, 97, 100, 121, 113, 201, 101, 60, 0, 0, 0, 18, 116, 69, 88, 116, 69, 88, 73, 70, 58, 79, 114, 105, 101, 110, 116, 97, 116, 105, 111, 110, 0, 49, 132, 88, 236, 239, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]));
      } else if (path === './../logo_png.1.png') {
        cb({ 'errno': -2, 'code': 'ENOENT', 'syscall': 'open', 'path': '/Users/andrzej/workspace/filestack-js/src/lib/api/upload/file_utils_test_files/logo_png.1.png' }, null);
      }
    }),
    statSync: jest.fn().mockImplementation(inputFile => {
      return {
        size: 200,
      };
    }),
  };
});

describe('api:upload:file_utils', () => {
  describe('getPart', () => {
    it('should properly get a part of file', (done) => {
      const newFile = {
        buffer: Buffer.from('This is a buffer example.'),
        lastModified: 1551712133314,
        lastModifiedDate: new Date(1551712133314),
        name: 'apple.jpg',
        size: 9225,
        type: 'image/jpeg',
        webkitRelativePath: '',
        msClose: jest.fn(),
        msDetachStream: jest.fn(),
        slice: jest.fn(),
      };
      const part = {
        'buffer': new ArrayBuffer(8),
        'chunks': [{
          'buffer': {},
          'offset': 0,
          'size': 9225,
          'number': 0,
          'md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
        }],
        'chunkSize': 8388608,
        'intelligentOverride': false,
        'loaded': 0,
        'number': 0,
        'request': null,
        'size': 9225,
        'md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
      };
      const ctx = {
        'file': newFile,
        'config': {
          'host': 'https://upload.filestackapi.com',
          'apikey': 'A0NTRSxHcR66kmTku9Gcsz',
          'partSize': 8388608,
          'concurrency': 3,
          'progressInterval': 10,
          'retry': 10,
          'retryFactor': 2,
          'retryMaxTime': 15000,
          'customName': 'apple.jpg',
          'store': {
            'store_location': 's3',
          },
          'timeout': 120000,
          'intelligent': true,
        },
        'state': {
          'parts': {
            '0': {
              'buffer': {},
              'chunks': [{
                'buffer': {},
                'offset': 0,
                'size': 9225,
                'number': 0,
                'md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
              }],
              'chunkSize': 8388608,
              'intelligentOverride': false,
              'loaded': 0,
              'number': 0,
              'request': null,
              'size': 9225,
              'md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
            },
          },
          'progressTick': 136,
          'previousPayload': null,
          'retries': {},
          'status': Status.RUNNING,
        },
        'params': {
          'uri': '/filestack-uploads-production-eu-west-1/A0NTRSxHcR66kmTku9Gcsz/OSkZKSsLSezALuw0qCnA_apple.jpg',
          'region': 'eu-west-1',
          'upload_id': 'pnbdyj306s5EgA5kzhQseuAXrKVvwZaWz88YpWvX1LIEUSZsSOSwCxztuii_nRv0_07AwRIQS_nYZC01Lwz_edaiY6ie79ey4CA79EVjH7bYWwDzxEs6jwahKYMCCrE5',
          'location_url': 'upload-eu-west-1.filestackapi.com',
          'upload_type': 'intelligent_ingestion',
        },
      };
      const expected = {
        buffer: Buffer.from('This is a buffer example.'),
        chunks:
          [{
            buffer: {},
            offset: 0,
            size: 9225,
            number: 0,
            md5: 'lnkAXF0iK/msEWB5CCG5Dg=='
          }],
        chunkSize: 8388608,
        intelligentOverride: false,
        loaded: 0,
        number: 0,
        request: null,
        size: 25,
        md5: 'XbWxBKtt/pwXwyTrpVVHwQ=='
      }
      expect.assertions(1);
      return getPart(part, ctx).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
  });
  describe('getFile', () => {
    it('should properly get a file as buffer', (done) => {
      const buffer = Buffer.from('This is a buffer example.');
      expect.assertions(1);
      const expected = {
        buffer,
        'name': undefined,
        'size': 25,
        'type': 'text/plain',
      };
      return getFile(buffer).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
    it('should properly get a file from a local by provided path', (done) => {
      const fakeFilePath = './../logo_png.png';
      expect.assertions(1);
      const expected = {
        'buffer': Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 20, 0, 0, 0, 20, 8, 6, 0, 0, 0, 141, 137, 29, 13, 0, 0, 0, 6, 98, 75, 71, 68, 0, 255, 0, 255, 0, 255, 160, 189, 167, 147, 0, 0, 0, 248, 73, 68, 65, 84, 56, 203, 99, 248, 255, 255, 63, 75, 252, 186, 235, 137, 102, 243, 46, 188, 208, 156, 117, 238, 63, 57, 24, 164, 23, 100, 6, 200, 44, 134, 180, 141, 55, 211, 200, 53, 8, 29, 131, 12, 101, 160, 196, 101, 216, 92, 202, 64, 45, 195, 96, 24, 175, 129, 53, 187, 238, 254, 95, 116, 246, 57, 28, 251, 175, 184, 74, 158, 129, 246, 11, 46, 254, 191, 251, 246, 219, 127, 116, 144, 183, 229, 22, 97, 3, 101, 103, 156, 197, 16, 92, 119, 249, 213, 127, 108, 128, 144, 129, 32, 179, 24, 24, 138, 118, 255, 103, 168, 63, 248, 159, 161, 251, 248, 127, 190, 169, 103, 192, 18, 232, 174, 59, 250, 224, 3, 78, 47, 131, 244, 128, 244, 130, 205, 0, 153, 5, 38, 144, 113, 233, 30, 12, 151, 49, 180, 29, 65, 197, 141, 135, 255, 51, 212, 28, 0, 171, 197, 208, 15, 103, 244, 158, 248, 191, 255, 238, 59, 48, 70, 7, 48, 113, 144, 26, 12, 3, 112, 25, 40, 52, 237, 204, 127, 66, 0, 164, 102, 224, 12, 100, 168, 62, 0, 214, 128, 205, 96, 152, 56, 72, 13, 241, 6, 34, 97, 140, 72, 33, 100, 200, 168, 129, 247, 169, 104, 224, 125, 144, 129, 1, 84, 52, 48, 128, 1, 12, 32, 134, 238, 135, 97, 44, 6, 238, 199, 131, 223, 67, 125, 9, 54, 12, 0, 87, 126, 31, 109, 180, 228, 26, 37, 0, 0, 0, 25, 116, 69, 88, 116, 83, 111, 102, 116, 119, 97, 114, 101, 0, 65, 100, 111, 98, 101, 32, 73, 109, 97, 103, 101, 82, 101, 97, 100, 121, 113, 201, 101, 60, 0, 0, 0, 18, 116, 69, 88, 116, 69, 88, 73, 70, 58, 79, 114, 105, 101, 110, 116, 97, 116, 105, 111, 110, 0, 49, 132, 88, 236, 239, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]),
        'name': 'logo_png.png',
        'size': 200,
        'type': 'image/png',
      };
      return getFile(fakeFilePath).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
    it('should properly reject when unable to read a file', (done) => {
      const fakeFilePath = './../logo_png.1.png';
      expect.assertions(1);
      const expected = { 'errno': -2, 'code': 'ENOENT', 'syscall': 'open', 'path': '/Users/andrzej/workspace/filestack-js/src/lib/api/upload/file_utils_test_files/logo_png.1.png' }
      return getFile(fakeFilePath).catch(err => {
        expect(err).toEqual(expected);
        done();
      });
    });
    it('should set application/octet-stream if mimetype not found', (done) => {
      const buffer = Buffer.from('qweqweqewqeqewqweqweqweqweq', 'base64');
      expect.assertions(1);
      const expected = {
        buffer,
        'name': undefined,
        'size': 20,
        'type': 'application/octet-stream',
      };
      return getFile(buffer).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
  });
});
