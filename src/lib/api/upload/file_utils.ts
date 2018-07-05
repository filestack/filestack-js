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
import * as mime from 'mime';
import { calcMD5 } from './md5';
import { Context, PartObj, FileObj } from './types';

/**
 * Given a file with a valid descriptor this will return a part object
 * The part object represents a chunk of the file
 * @private
 * @param file    File object that contains a descriptor
 * @param part    Part object that contains a number field
 * @param config  Current upload configuration settings
 */
export const getPart = (part: PartObj, { config, file }: Context): Promise<PartObj> => {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(config.partSize);
    fs.read(file.fd, buffer, 0, config.partSize, part.number * config.partSize, (err, nread) => {
      if (err) return reject(err);
      if (nread === 0) {
        fs.close(file.fd, (err: any) => {
          if (err) return reject(err);
        });
      }
      buffer = buffer.slice(0, nread);
      const partObj: PartObj = {
        ...part,
        buffer,
        size: buffer.byteLength,
        md5: calcMD5(buffer),
      };
      return resolve(partObj);
    });
  });
};

/**
 * Given a file path, returns a file object
 * @private
 * @param filePath  A valid path to a file on your filesystem.
 */
export const getFile = (filePath: string): Promise<FileObj> => {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fd) => {
      if (err) return reject(err);
      const stats = fs.statSync(filePath);
      const file = {
        fd,
        name: path.basename(filePath),
        size: stats.size,
        type: mime.getType(filePath),
      } as FileObj;
      return resolve(file);
    });
  });
};

/**
 * Close file descriptor
 * @private
 * @param fd  A valid file descriptor
 */
export const closeFile = (fd: number) => {
  return fs.closeSync(fd);
};
