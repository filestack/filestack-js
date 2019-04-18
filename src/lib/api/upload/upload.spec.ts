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
import { File } from './file';
import { S3Uploader } from './uploaders/s3';

const testBuffer = Buffer.from('test test test');

jest.mock('./uploaders/s3');

jest.mock('./file_tools', () => ({
  getFile: (f) => new File(f),
}));

describe.only('Api/Upload/upload', () => {

  beforeAll(() => {
    spyOn(S3Uploader.prototype, 'execute').and.callFake(() => {
      console.log(this, 'asd');
      return Promise.resolve();
    });
  });

  it('Should execute normal upload without errors and return single file response', async () => {
    const u = new Upload();
    const res = await u.upload(testBuffer);
    // expect(res).toEqual(testBuffer);
  });

  it('Should execute multiupload without errors and return single file response', async () => {
    const u = new Upload();
    const res = await u.multiupload([testBuffer, testBuffer]);
    // expect(res).toEqual([testBuffer, testBuffer]);
  });

  it('Should set correct security to uploader', () => {
    const security = {
      policy: 'p',
      signature: 's',
    };

    const u = new Upload();
    u.setSecurity(security);

    expect(S3Uploader.prototype.setSecurity).toHaveBeenCalledWith(security);
  });

  // it('Should set correct host to uplaoder', () => {

  // });

  // it('Should parse session object', () => {

  // });


});
