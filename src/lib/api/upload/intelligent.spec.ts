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

import { slicePartIntoChunks, uploadChunk, commitPart } from './intelligent';
import { Status } from './types';

jest.mock('./../request', () => {
  return {
    multipart: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve('multipart response object');
      });
    }),
  };
});
jest.mock('./network', () => {
  return {
    getLocationURL: jest.fn(() => {
      return "https://upload-eu-west-1.filestackapi.com";
    }),
    getS3PartData: jest.fn(() => {
      return {
        'url': 'https://s3-eu-west-1.amazonaws.com/filestack-uploads-production-eu-west-1/ii/A0NTRSxHcR66kmTku9Gcsz/Pfpg9VuNnT30JiFrnqaaAZQXb3aWkPsELYTrzS16jTIPzBu1oTfjTLxK2lVBcrZaNkJ9FczQTlDzttVnaa7Gd7xJZCiMZak1XtrXXdy5fUzXHcdShWlxpM2TA4Yvw_.g/1/0?',
        'headers': {
          'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAIZPVO2IP3EGGABFA/20190315/eu-west-1/s3/aws4_request, SignedHeaders=content-length;content-md5;host;x-amz-date, Signature=aa014b2ef2c6f4e3f994e1865a9581a30a9ea0ea4beedbbdede8bb4d5afb5b48',
          'Content-Md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
          'x-amz-date': '20190315T132434Z'
        },
        'location_url': 'upload-eu-west-1.filestackapi.com'
      };
    }),
    uploadToS3: jest.fn(() => {
      return [2, {
        'method': 'PUT',
        'url': 'https://s3-eu-west-1.amazonaws.com/filestack-uploads-production-eu-west-1/ii/A0NTRSxHcR66kmTku9Gcsz/Pfpg9VuNnT30JiFrnqaaAZQXb3aWkPsELYTrzS16jTIPzBu1oTfjTLxK2lVBcrZaNkJ9FczQTlDzttVnaa7Gd7xJZCiMZak1XtrXXdy5fUzXHcdShWlxpM2TA4Yvw_.g/1/0?',
        'data': {},
        'headers': {
          'authorization': 'AWS4-HMAC-SHA256 Credential=AKIAIZPVO2IP3EGGABFA/20190315/eu-west-1/s3/aws4_request, SignedHeaders=content-length;content-md5;host;x-amz-date, Signature=aa014b2ef2c6f4e3f994e1865a9581a30a9ea0ea4beedbbdede8bb4d5afb5b48',
          'content-md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
          'x-amz-date': '20190315T132434Z'
        }
      }]
    }),
  };
});

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

describe('api:upload:intelligent', () => {
  describe('slicePartIntoChunks', () => {
    it('should slice file part into smaller chunks', () => {
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
      const size = 2000;
      const result = slicePartIntoChunks(part, size);
      const expected = [{ 'buffer': new ArrayBuffer(8), 'md5': 'feo2Kz+sjgCVaklSo9T0dA==', 'number': 0, 'offset': 0, 'size': 8 }, { 'buffer': new ArrayBuffer(8), 'md5': '1B2M2Y8AsgTpgAmY7PhCfg==', 'number': 0, 'offset': 2000, 'size': 0 }, { 'buffer': new ArrayBuffer(8), 'md5': '1B2M2Y8AsgTpgAmY7PhCfg==', 'number': 0, 'offset': 4000, 'size': 0 }, { 'buffer': new ArrayBuffer(8), 'md5': '1B2M2Y8AsgTpgAmY7PhCfg==', 'number': 0, 'offset': 6000, 'size': 0 }, { 'buffer': new ArrayBuffer(8), 'md5': '1B2M2Y8AsgTpgAmY7PhCfg==', 'number': 0, 'offset': 8000, 'size': 0 }]
      expect(result).toEqual(expected);
    });
  });
  describe('uploadChunk', () => {
    it('should properly upload a chunk of part', (done) => {
      const chunk = {
        'buffer': {},
        'offset': 0,
        'size': 9225,
        'number': 0,
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
      const expected = [2, {
        'data': {},
        'headers': {
          'authorization': 'AWS4-HMAC-SHA256 Credential=AKIAIZPVO2IP3EGGABFA/20190315/eu-west-1/s3/aws4_request, SignedHeaders=content-length;content-md5;host;x-amz-date, Signature=aa014b2ef2c6f4e3f994e1865a9581a30a9ea0ea4beedbbdede8bb4d5afb5b48',
          'content-md5': 'lnkAXF0iK/msEWB5CCG5Dg==',
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
          'x-amz-date': '20190315T132434Z'
        },
        'method': 'PUT',
        'url': 'https://s3-eu-west-1.amazonaws.com/filestack-uploads-production-eu-west-1/ii/A0NTRSxHcR66kmTku9Gcsz/Pfpg9VuNnT30JiFrnqaaAZQXb3aWkPsELYTrzS16jTIPzBu1oTfjTLxK2lVBcrZaNkJ9FczQTlDzttVnaa7Gd7xJZCiMZak1XtrXXdy5fUzXHcdShWlxpM2TA4Yvw_.g/1/0?'
      }];
      expect.assertions(1);
      return uploadChunk(chunk, ctx).then(data => {
        expect(data).toEqual(expected);
        done();
      });
    });
  });
  describe('commitPart', () => {
    it('should properly commit a part of file', (done) => {
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
      expect.assertions(1);
      return commitPart(part, ctx).then(data => {
        expect(data).toEqual('multipart response object');
        done();
      });
    });
  });
});
