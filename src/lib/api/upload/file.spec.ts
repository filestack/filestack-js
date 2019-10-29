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
import { FileInstance, File } from './file';

describe('Api/Upload/File', () => {
  const testBuff = Buffer.from('test');
  const fileName = 'text.txt';
  const type = 'text/plain';

  const fi: FileInstance = {
    name: fileName,
    type,
    size: testBuff.byteLength,
    slice: (start, end) => Promise.resolve(testBuff.slice(start, end)),
  };

  let file;

  beforeEach(() => {
    file = new File(Object.assign({}, fi));
  });

  it('Should load correct file without errors', () => {
    expect(file.filename).toEqual(fileName);
    expect(file.name).toEqual(fileName);

    expect(file.type).toEqual(type);
    expect(file.mimetype).toEqual(type);

    expect(file.size).toEqual(testBuff.byteLength);
  });

  it('should allow to set new name with with sanitization', () => {
    file.name = 'test123//.txt';

    expect(file.name).toEqual('test123//.txt');
  });

  it('should set custom name by string and sanitize it', () => {
    file.customName = 'test123##.txt';

    expect(file.name).toEqual('test123--.txt');
  });

  it('should set custom name by function and sanitize it', () => {
    file.customName = () => {
      return 'test123 ##.txt';
    };

    expect(file.name).toEqual('test123 --.txt');
  });

  it('should throw an error when custom name function is not returning string', () => {
    expect(() => {
      file.customName = () => {
        return {};
      };
    }).toThrow();
  });

  it('should return correct parts count for given size', () => {
    expect(file.getPartsCount(1)).toEqual(file.size);
  });

  it('should return correct part metadata', () => {
    expect(file.getPartMetadata(0, 2)).toEqual({ endByte: 2, partNumber: 0, size: 2, startByte: 0 });
    expect(file.getPartMetadata(1, 2)).toEqual({ endByte: 4, partNumber: 1, size: 2, startByte: 2 });
    expect(file.getPartMetadata(0, 6)).toEqual({ endByte: 4, partNumber: 0, size: 4, startByte: 0 });

  });

  it('should throw an error when start part is higher than part size ', () => {
    expect(() => {
      file.getPartMetadata(1, 6);
    }).toThrow();
  });

  it('should return part by part metadata', async () => {
    const meta = file.getPartMetadata(0, 2);
    const part = await file.getPartByMetadata(meta);

    expect(part.size).toEqual(2);
    expect(part.md5).toEqual('Vp73JkK+D63XEdakaNaO4Q==');
  });

  it('should not calc chunk md5 on disable param', async () => {
    const meta = file.getPartMetadata(0, 2);
    const part = await file.getPartByMetadata(meta, false);

    expect(part.size).toEqual(2);
    expect(part.md5).toEqual(undefined);
  });

  it('should return chunk by part metadata and offset', async () => {
    const meta = file.getPartMetadata(0, 4);
    const chunk = await file.getChunkByMetadata(meta, 1, 2);

    expect(chunk.size).toEqual(2);
    expect(chunk.md5).toEqual('EkcP5AbUQBfZbqs33WX8FA==');
    expect(chunk.startByte).toEqual(1);
    expect(chunk.endByte).toEqual(3);
  });

  it('should not calc chunk md5 on disable param', async () => {
    const meta = file.getPartMetadata(0, 4);
    const chunk = await file.getChunkByMetadata(meta, 1, 2, false);

    expect(chunk.size).toEqual(2);
    expect(chunk.md5).toEqual(undefined);
    expect(chunk.startByte).toEqual(1);
    expect(chunk.endByte).toEqual(3);
  });

  it('should release file buffer', () => {
    file.release();

    expect(file.buffer).toEqual(undefined);
  });

  it('should return json representation of the file', () => {
    const json = JSON.parse(JSON.stringify(file));

    expect(json).toEqual({
      name: fileName,
      type,
      size: file.size,
    });
  });
});
