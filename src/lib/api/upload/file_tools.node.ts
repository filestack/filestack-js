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
import { File as FsFile } from './file';
import { SanitizeOptions, getMimetype } from './../../utils';
import { FilestackError } from './../../../filestack_error';
import { InputFile, base64Regexp, isFileNamed } from './file_tools';

/**
 * Check if file is buffer
 *
 * @node
 * @param input
 */
const isFileBuffer = (input: InputFile): input is Buffer => Buffer.isBuffer(input);

/**
 * Check if input is a valid file path
 *
 * @node
 * @param input
 */
const isFilePath = (input: InputFile): input is string => require('fs').existsSync(input);

/**
 * Check if file is base64 string
 *
 * @param input
 */
const isFileBase = (input: InputFile): input is string => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.indexOf('base64') > -1 && base64Regexp.test(input)) {
    input = input.match(base64Regexp).pop();
  }

  if (Buffer.from(input, 'base64').toString('base64') === input) {
    return true;
  }

  return false;
};

/**
 * Accepts Buffer or filepath or base64 string
 *
 * @node
 * @param {*} inputFile
 * @returns {Promise<File>}
 */
export const getFile = (input: InputFile, sanitizeOptions?: SanitizeOptions): Promise<FsFile> => {
  let filename;

  if (isFileNamed(input)) {
    filename = input.name;
    input = input.file;
  }

  if (isFilePath(input)) {
    let path = input;
    return new Promise((resolve, reject) => {
      require('fs').readFile(path, (err, buffer) => {
        if (err) {
          return reject(err);
        }

        if (!filename) {
          filename = require && require('path').basename(path);
        }

        return resolve(
          new FsFile(
            {
              name: filename,
              size: buffer.byteLength,
              type: getMimetype(buffer, filename),
              slice: (start, end) => Promise.resolve(buffer.slice(start, end)),
            },
            sanitizeOptions
          )
        );
      });
    });
  }

  if (isFileBase(input)) {
    input = Buffer.from(input, 'base64');
  }

  if (isFileBuffer(input)) {
    return Promise.resolve(
      new FsFile(
        {
          name: filename,
          size: input.byteLength,
          type: getMimetype(input, filename),
          // @ts-ignore
          slice: (start, end) => Promise.resolve(input.slice(start, end)),
        },
        sanitizeOptions
      )
    );
  }

  return Promise.reject(new FilestackError('Unsupported input file type'));
};
