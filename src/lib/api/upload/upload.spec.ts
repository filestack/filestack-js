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

import { Upload } from './upload';
import { FileState } from './file';
import { S3Uploader } from './uploaders/s3';
import { config } from './../../../config';
import { StoreUploadOptions } from './types';
import { UploadMode } from './uploaders/abstract';

const testBuffer = Buffer.from('test test test');

const customNameMocked = jest.fn();

const mockedFsFile = {};
Object.defineProperty(mockedFsFile, 'customName', {
  set: customNameMocked,
});

jest.useFakeTimers();

jest.mock('./uploaders/s3');
jest.mock('./file_tools', () => ({
  getFile: jest.fn().mockImplementation(() => mockedFsFile),
}));

const mockedFileResponse = {
  status: 'stored',
};

const sessionURls = config.urls;
const defaultSession = {
  apikey: 'test',
  policy: 'p',
  signature: 's',
  urls: sessionURls,
};

const mockExecute = jest.fn();

describe('Api/Upload/upload', () => {
  beforeAll(() => {
    spyOn(S3Uploader.prototype, 'execute').and.callFake(mockExecute);
  });

  describe('Settings', () => {
    it('should handle constructor options', () => {
      const u = new Upload({
        partSize: 5 * 1024 * 1024,
        intelligentChunkSize: 5 * 1024 * 1024,
      });

      expect(S3Uploader.prototype.setPartSize).toHaveBeenCalledWith(5 * 1024 * 1024);
      expect(S3Uploader.prototype.setIntelligentChunkSize).toHaveBeenCalledWith(5 * 1024 * 1024);
    });

    it('should throw error on wrong upload options', () => {
      // @ts-ignore
      expect(() => new Upload({ intelligent1: true })).toThrowError('Invalid upload params');
    });

    it('should accept sanitizer settings', () => {
      expect(() => new Upload({}, {
        // @ts-ignore
        sanitizer: false,
      })).not.toThrowError('Invalid upload params');

      expect(() => new Upload({}, {
        // @ts-ignore
        sanitizer: {
          exclude: ['1'],
          replacement: '-',
        },
      })).not.toThrowError('Invalid upload params');
    });

    it('should throw error on wrong store options', () => {
      // @ts-ignore
      expect(() => new Upload({ intelligent: true }, { test: 123 })).toThrowError('Invalid store upload params');
    });

    it('should set intelligent upload mode', () => {
      const u = new Upload({ intelligent: true });
      expect(S3Uploader.prototype.setUploadMode).toHaveBeenCalledWith(UploadMode.INTELLIGENT);
    });

    it('should set respect disableIntegrityCheck param', () => {
      const u = new Upload({ disableIntegrityCheck: true });
      expect(S3Uploader.prototype.setIntegrityCheck).toHaveBeenCalledWith(false);
    });

    it('should fallback upload mode', () => {
      const u = new Upload({ intelligent: 'fallback' });
      expect(S3Uploader.prototype.setUploadMode).toHaveBeenCalledWith(UploadMode.FALLBACK);
    });

    it('should set upload tasks to uploader', () => {
      const tags = { test: '123' };
      const u = new Upload({ tags: tags });
      expect(S3Uploader.prototype.setUploadTags).toHaveBeenCalledWith(tags);
    });

    it('should pass store options to uploader class', () => {
      const storeOptions: StoreUploadOptions = {
        location: 's3',
      };

      const u = new Upload({}, storeOptions);
      expect(S3Uploader.prototype.constructor).toHaveBeenCalledWith(storeOptions, undefined);
    });

    it('should respect concurrency param in upload options', () => {
      const uploadOptions = {
        concurrency: 4,
      };

      const u = new Upload(uploadOptions);
      expect(S3Uploader.prototype.constructor).toHaveBeenCalledWith({}, 4);
    });

    it('should set correct security to uploader', () => {
      const security = {
        policy: 'p',
        signature: 's',
      };

      const u = new Upload();
      u.setSecurity(security);

      expect(S3Uploader.prototype.setSecurity).toHaveBeenCalledWith(security);
    });

    it('should pass session variable to uploader', () => {
      const u = new Upload();
      u.setSession(defaultSession);

      expect(S3Uploader.prototype.setUrl).toHaveBeenCalledWith(defaultSession.urls.uploadApiUrl);
      expect(S3Uploader.prototype.setApikey).toHaveBeenCalledWith(defaultSession.apikey);
      expect(S3Uploader.prototype.setSecurity).toHaveBeenCalledWith({ policy: defaultSession.policy, signature: defaultSession.signature });
    });

    it('should set storeOption filename to class', async () => {
      mockExecute.mockReturnValue(Promise.resolve([mockedFileResponse]));
      const filenameFn = () => 'test';

      const u = new Upload(
        {},
        {
          filename: filenameFn,
        }
      );

      await u.upload(testBuffer);
      expect(customNameMocked).toHaveBeenCalledWith(filenameFn);
    });

    it('should assign methods to user provided token', () => {
      let token = {};

      const u = new Upload();
      u.setToken(token);

      expect(token['cancel']).toBeTruthy();
      expect(token['resume']).toBeTruthy();
      expect(token['pause']).toBeTruthy();

      token['cancel']();
      token['pause']();
      token['resume']();
    });

    it('should set token with methods that pause,cancel or resume uploads', () => {
      let token = {};

      const u = new Upload();
      u.setToken(token);

      token['cancel']();
      token['pause']();
      token['resume']();

      expect(S3Uploader.prototype.abort).toHaveBeenCalled();
      expect(S3Uploader.prototype.pause).toHaveBeenCalled();
      expect(S3Uploader.prototype.resume).toHaveBeenCalled();
    });

    it('should throw an error if token is not an object', () => {
      const token = '123123';

      const u = new Upload();
      expect(() => {
        u.setToken(token);
      }).toThrowError();
    });

  });

  describe('Upload', () => {
    beforeEach(() => {
      mockExecute.mockReturnValue(Promise.resolve([mockedFileResponse, mockedFileResponse]));
    });

    it('should execute normal upload without errors and return single file response', async () => {
      const u = new Upload();
      const res = await u.upload(testBuffer);
      expect(res).toEqual(mockedFileResponse);
    });

    it('should execute normal upload with errors and return rejected promise', () => {
      const u = new Upload();

      mockExecute.mockReturnValue(
        Promise.resolve([
          {
            status: FileState.FAILED,
          },
        ])
      );

      return expect(u.upload(testBuffer)).rejects.toEqual({
        status: FileState.FAILED,
      });
    });

    it('should execute multiupload without errors and return single file response', async () => {
      const u = new Upload();
      const res = await u.multiupload([testBuffer, testBuffer]);
      expect(res).toEqual([mockedFileResponse, mockedFileResponse]);
    });
  });

  describe('Progress', () => {
    const progress1 = {
      totalBytes: 1,
      totalPercent: 1,
      files: [
        {
          totalBytes: 1,
          totalPercent: 1,
        },
      ],
    };

    const progress50 = {
      totalBytes: 5,
      totalPercent: 50,
      files: [
        {
          totalBytes: 50,
          totalPercent: 50,
        },
      ],
    };

    const progress100 = {
      totalBytes: 100,
      totalPercent: 100,
      files: [
        {
          totalBytes: 100,
          totalPercent: 100,
        },
      ],
    };

    it('should handle correct progress event', async () => {
      spyOn(S3Uploader.prototype, 'on').and.callFake((ev, cb) => {
        cb(progress1);
        cb(progress100);
      });

      const progressMock = jest.fn();

      const u = new Upload({
        onProgress: progressMock,
      });

      await u.upload(testBuffer);

      expect(progressMock).toHaveBeenCalledWith(progress100);
      expect(progressMock).toHaveBeenCalledTimes(1);
    });

    it('should call progress event on given interval', async () => {
      let progressCb;

      mockExecute.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => progressCb(progress1), 1);
          setTimeout(() => progressCb(progress50), 2);
          setTimeout(() => progressCb(progress100), 3);
          setTimeout(() => resolve([]), 4);

          jest.advanceTimersByTime(4);
        });
      });

      spyOn(S3Uploader.prototype, 'on').and.callFake((ev, cb) => {
        progressCb = cb;
      });

      const progressMock = jest.fn();

      const u = new Upload({
        progressInterval: 1,
        onProgress: progressMock,
      });

      await u.multiupload([testBuffer]);

      expect(progressMock).toHaveBeenCalledWith(progress1);
      expect(progressMock).toHaveBeenCalledWith(progress50);
      expect(progressMock).toHaveBeenCalledWith(progress100);
    });

    it('should stay at the same progress when uploader goes back with file progress', async () => {
      let progressCb;

      mockExecute.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => progressCb(progress50), 1);
          setTimeout(() => progressCb(progress1), 2);
          setTimeout(() => progressCb(progress100), 3);
          setTimeout(() => resolve([]), 4);

          jest.advanceTimersByTime(4);
        });
      });

      spyOn(S3Uploader.prototype, 'on').and.callFake((ev, cb) => {
        progressCb = cb;
      });

      const progressMock = jest.fn();

      const u = new Upload({
        progressInterval: 1,
        onProgress: progressMock,
      });

      await u.multiupload([testBuffer]);

      expect(progressMock).toHaveBeenCalledWith(progress50);
      expect(progressMock).toHaveBeenCalledWith(progress50);
      expect(progressMock).toHaveBeenCalledWith(progress100);
    });
  });
});
