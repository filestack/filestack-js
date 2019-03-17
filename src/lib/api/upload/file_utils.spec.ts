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

import { getPart, getFile, getMimetype } from './file_utils';
import { Status } from './types';

jest.mock('fs', () => {
  return {
    readFile: jest.fn().mockImplementation((path, cb) => {
      cb(null, Buffer.from('This is a buffer example.'))
    }),
    statSync: jest.fn().mockImplementation(inputFile => {
      return {
        size: 987
      }
    })
  }
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
        "name": undefined,
        "size": 25,
        "type": "text/plain"
      };
      return getFile(buffer).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
    it('should properly get a file from a local by provided path', (done) => {
      const fakeFilePath = './../images.test.jpg';
      expect.assertions(1);
      const expected = {
        'buffer': Buffer.from('This is a buffer example.'),
        "name": 'images.test.jpg',
        "size": 987,
        "type": "text/plain"
      };
      return getFile(fakeFilePath).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
  });
  describe('getMimetype', () => {
    it('should properly read a mimetype', () => {
      const fileBuffer = Buffer.from('This is a buffer example.')
      const result = getMimetype(fileBuffer);
      expect(result).toBe('');
    });
  });
});
