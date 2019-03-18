/*
 * Copyright (c) 2018 by Filestack.
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

import * as fs from 'fs';
import * as path from 'path';
// import * as mime from 'mime';
import mimetype from 'file-type';
import { calcMD5 } from './md5';
import { Context, PartObj, FileObj } from './types';
import * as isutf8 from 'isutf8';
import isSvg from 'is-svg';

const getMimetype = (buffer) => {
  const meta = mimetype(buffer);
  if (meta) {
    return meta.mime;
  }

  if (isSvg(buffer)) {
    return 'image/svg+xml';
  }

  if (isutf8(buffer)) {
    return 'text/plain';
  }

  return 'application/octet-stream';
};

/**
 * Given a file with a valid descriptor this will return a part object
 * The part object represents a chunk of the file
 * @private
 * @param file    File object that contains a descriptor
 * @param part    Part object that contains a number field
 * @param config  Current upload configuration settings
 */
export const getPart = (part: PartObj, { config, file }: Context): Promise<PartObj> => {
  return new Promise((resolve) => {
    let length = config.partSize;
    const start = config.partSize * part.number;

    if (file.buffer.byteLength < start + length) {
      length = file.buffer.byteLength - start;
    }

    const filePart = file.buffer.slice(start, start + length);
    const partObj: PartObj = {
      ...part,
      buffer: filePart,
      size: filePart.byteLength,
      md5: calcMD5(filePart),
    };

    return resolve(partObj);
  });
};

/**
 * Given a file path, returns a file object
 * @private
 * @param inputFile  A valid path to a file on your filesystem or buffer.
 */
export const getFile = (inputFile: string | Buffer): Promise<FileObj> => {
  if (inputFile instanceof Buffer) {
    return Promise.resolve({
      buffer: inputFile,
      name: undefined,
      size: inputFile.byteLength,
      type: getMimetype(inputFile),
    } as FileObj);
  }

  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, (err, buffer) => {
      if (err) return reject(err);
      const stats = fs.statSync(inputFile);
      const file = {
        buffer,
        name: path.basename(inputFile),
        size: stats.size,
        type: getMimetype(buffer),
      } as FileObj;
      return resolve(file);
    });
  });
};
