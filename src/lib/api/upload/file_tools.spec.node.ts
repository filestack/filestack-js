
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
import { getFile } from './file_tools';
import * as fs from 'fs';

jest.mock('fs');

const mockedTestFile = Buffer.from('text text');
const base64Svg = 'PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0icmVkIiAvPgogIFNvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBpbmxpbmUgU1ZHLiAgCjwvc3ZnPiA=';

describe('Api/Upload/FileTools', () => {
  describe('getFileNode', () => {

    it('Should return file instance for nodejs loaded file from path', async () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(fs, 'readFile').and.callFake((path, cb) => {
        cb(null, mockedTestFile);
      });

      const file = await getFile('/testfile.txt');

      expect(file.name).toEqual('testfile.txt');
      expect(file.mimetype).toEqual('text/plain');
      expect(file.size).toEqual(9);

      const meta = file.getPartMetadata(0, 2);
      const slice = await file.getPartByMetadata(meta);

      expect(slice.size).toEqual(2);
    });

    it('Should reject if provided file cannot be read', () => {
      spyOn(fs, 'existsSync').and.returnValue(true);
      spyOn(fs, 'readFile').and.callFake((path, cb) => {
        cb('error');
      });

      return expect(getFile('/testfile.txt')).rejects.toEqual('error');
    });

    it('Should return correct mimetype', async () => {
      jest.unmock('fs');

      const file = await getFile('./package.json');
      expect(file.mimetype).toEqual('application/json');
    });

    it('Should return correct file instance from buffer', async () => {
      const file = await getFile(mockedTestFile);
      expect(file.size).toEqual(9);
      expect(file.mimetype).toEqual('text/plain');
    });

    it('Should handle base64 encoded string', async () => {
      const file = await getFile({
        name: 'test.svg',
        file: base64Svg,
      });

      expect(file.mimetype).toEqual('image/svg+xml');
    });

    it('Should detect text/plain mimetype', async () => {
      const file = await getFile({
        name: 'test.undefined',
        file: base64Svg,
      });
      expect(file.mimetype).toEqual('text/plain');
    });

    it('Should handle base64 encoded string with b64 prefix (svg)', async () => {
      // it is hard to detect svg mimetype for now using fallback to application/octet-stream
      return expect((await getFile(`data:image/svg+xml;base64,${base64Svg}`)).mimetype).toEqual('application/octet-stream');
    });

    it('Should get part of the buffer after slice', async () => {
      const file = await getFile(mockedTestFile);

      const meta = file.getPartMetadata(0, 2);
      const slice = await file.getPartByMetadata(meta);

      expect(slice.size).toEqual(2);
    });

    it('Should handle base64 encoded string', async () => {
      const file = await getFile({
        name: 'test.undefined',
        file: Buffer.of(12),
      });
      expect(file.mimetype).toEqual('text/plain');
    });

    it('Should throw error when random string is provided', async () => {
      return expect(getFile('asdasdfasdf')).rejects.toEqual(new Error('Unsupported input file type'));
    });

    it('Should pass sanitize options to file instance (buffer)', async () => {
      const fileRes = await getFile({
        file: mockedTestFile,
        name: 'test<.jpg',
      }, {
        replacement: '=',
      });

      expect(fileRes.name).toEqual('test=.jpg');
    });

    it('Should pass sanitize options to file instance path', async () => {
      const fileRes = await getFile({
        file: './package.json',
        name: 'test<.jpg',
      }, {
        replacement: '=',
      });

      expect(fileRes.name).toEqual('test=.jpg');
    });

    it('Should handle named file input', async () => {
      const file = await getFile({
        name: '123.jpg',
        file: mockedTestFile,
      });

      expect(file.name).toEqual('123.jpg');
      expect(file.size).toEqual(9);
      expect(file.mimetype).toEqual('image/jpeg');
    });

    it('Should reject on unsupported input file type', () => {
      // @ts-ignore
      return expect(getFile({})).rejects.toEqual(new Error('Unsupported input file type'));
    });
  });
});
