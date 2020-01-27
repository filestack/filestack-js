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
import * as utils from './../../utils';

const createFile = (size = 44320, name = 'test.png', type = 'image/png') => new File([new ArrayBuffer(size)], name , { type: type });

const sanitizeOptions = jest.fn().mockName('sanitizeOptions');

const base64Svg = 'PHN2ZyBoZWlnaHQ9IjEwMCIgd2lkdGg9IjEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0icmVkIiAvPgogIFNvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBpbmxpbmUgU1ZHLiAgCjwvc3ZnPiA=';
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const base64Gif = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

describe('Api/Upload/FileTools', () => {
  beforeAll(() => {
    spyOn(utils, 'sanitizeName').and.callFake((val, opts) => {
      sanitizeOptions(opts);
      return val;
    });
  });

  describe('getFileBrowser', () => {

    it('Should handle base64 encoded string (svg)', async () => {
      return expect((await getFile({
        file: base64Svg,
        name: 'test.svg',
      })).mimetype).toEqual('image/svg+xml');
    });

    it('Should handle base64 encoded string (png)', async () => {
      return expect((await getFile(base64Png)).mimetype).toEqual('image/png');
    });

    it('Should handle base64 encoded string (gif)', async () => {
      return expect((await getFile(base64Gif)).mimetype).toEqual('image/gif');
    });

    it('Should handle base64 encoded string with b64 prefix (gif)', async () => {
      return expect((await getFile(`data:image/gif;base64,${base64Gif}`)).mimetype).toEqual('image/gif');
    });

    it('Should pass sanitize options to file instance', async () => {
      const soptions = {
        replacement: '=',
      };

      const fileRes = await getFile({
        file: base64Png,
        name: 'test<.jpg',
      }, soptions);

      expect(sanitizeOptions).toHaveBeenCalledWith(soptions);
    });

    it('Should throw error when random string is provided', () => {
      return expect(getFile('asdasdfasdf')).rejects.toEqual(new Error('Unsupported input file type'));
    });

    it('Should handle base64 named file (gif)', async () => {
      const file = await getFile({
        file: base64Gif,
        name: 'test.gif',
      });
      expect(file.mimetype).toEqual('image/gif');
      expect(file.name).toEqual('test.gif');
    });

    it('Should handle File input type', async () => {
      const file = await getFile(createFile());
      expect(file.mimetype).toEqual('image/png');
      expect(file.name).toEqual('test.png');
      expect(file.size).toEqual(44320);
    });

    it('Should handle blob input type', async () => {
      const file = await getFile(new Blob([new ArrayBuffer(100)], {
        type: 'image/jpg',
      }));

      expect(file.mimetype).toEqual('image/jpg');
      expect(file.name).toEqual(undefined);
      expect(file.size).toEqual(100);
    });
  });
});
