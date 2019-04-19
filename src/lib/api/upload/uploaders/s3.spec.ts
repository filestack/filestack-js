


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

import { S3Uploader } from './s3';
import { File } from './../file';

const testbuff = Buffer.from('test test');
const testFile = new File({
  buffer: testbuff,
  type: 'text/plain',
  size: testbuff.byteLength,
  name: 'test.txt',
});

describe('Api/Upload/Uploaders/S3', () => {
  it('should initialize class without errors', () => {
    expect(() => {
      const u = new S3Uploader({});
    }).not.toThrowError();
  });

  it('Should allow adding files', () => {
    const u = new S3Uploader({});
    u.addFile(testFile);
  });

  it('should allow set standart options', () => {

  });

  it('should upload regular file');
  it('should allow upload multiple file');
  it('should allow upload file in ii mode');
  it('should allow upload file in fallback mode');
});
