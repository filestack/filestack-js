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
import fileType from 'file-type';
import issvg from 'is-svg';
import * as isutf8 from 'isutf8';
import { isNode, sanitizeName } from './../../utils';

export type RawFile = Blob | Buffer | File | string;
export type NamedInputFile = {
  name?: string;
  file: RawFile;
};

export type InputFile = RawFile | NamedInputFile;

const base64Regexp = /data:([a-zA-Z]*\/[a-zA-Z]*);base64,([^\"]*)/i;

/**
 * Check if file is buffer
 *
 * @node
 * @param input
 */
const isFileBuffer = (input: InputFile): input is Buffer => {
  return Buffer.isBuffer(input);
};

/**
 * Check if file is blob
 * @param input
 */
const isFileBlob = (input: InputFile): input is Blob => {
  return  input.toString() === '[object Blob]';
};

/**
 * Check if input is instance of browser file
 *
 * @browser
 * @param input
 */
const isFileBrowser = (input: InputFile): input is File => {
  return input instanceof File;
};

/**
 * Check if file is base64 string
 *
 * @param input
 */
const isFileBase = (input: InputFile): input is string => {
  if (typeof input !== 'string') {
    return false;
  }

  if (input.indexOf('base64') > -1) {
    const matches = input.match(base64Regexp);
    input = matches.pop();
  }

  if (isNode()) {
    if (Buffer.from(input, 'base64').toString('base64') === input) {
      return true;
    }

    return false;
  }

  try {
    return btoa(atob(input)) === input;
  } catch (err) {
    /* istanbul ignore next */
    return false;
  }
};

/**
 * Check if file is instance of named interface
 *
 * @param input
 */
const isFileNamed = (input: InputFile): input is NamedInputFile => {
  if (input['file'] && input['name']) {
    return true;
  }

  return false;
};

/**
 * Check if input is a valid file path
 *
 * @node
 * @param input
 */
const isFilePath = (input: InputFile): input is string => {
  if (require('fs').existsSync(input)) {
    return true;
  }

  return false;
};

/**
 * Returns mimetype of input file
 *
 * @param file
 */
const getMimetype = (file: any): string => {
  let type = fileType(file);
  if (type) {
    return type.mime;
  }

  // @todo we can check it only for node currently, rewrite it for browser as well
  try {
    if (issvg(file)) {
      return 'image/svg+xml';
    }

    if (isutf8(file)) {
      return 'text/plain';
    }
  } catch (e) {
    console.warn('Checking svg is currently not supported for browsers');
  }

  return 'application/octet-stream';
};

/**
 * Convert encoded base64 string or dataURI to blob
 *
 * @browser
 * @param b64data     String to decode
 * @param sliceSize   Byte quantity to split data into
 * @private
 * @returns {Blob}
 */
const b64toBlob = (b64Data: string, sliceSize = 512): Blob => {
  let contentType = '';

  if (b64Data.indexOf('base64') > -1) {
    const matches = b64Data.match(base64Regexp);
    b64Data = matches.pop();
    contentType = matches[1];
  }

  const byteCharacters = atob(b64Data);
  const byteArrays: any[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Read file as array buffer
 *
 * @browser
 * @private
 * @param blob
 * @returns {Boolean}
 */
const readFile = (file): Promise<any> => {
  return new Promise((resolve, reject) => {
    /* istanbul ignore next */
    if (!File || !FileReader || !Blob) {
      return reject(new Error('The File APIs are not fully supported by your browser'));
    }

    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// =================== BROWSER UTILS ===================
  /**
   * Accepts b64string or blob file
   *
   * @browser
   * @param {*} fileOrString
   * @returns {Promise<File>}
   */
const getFileBrowser = (input: InputFile): Promise<FsFile> => {
  let filename;
  let file: Blob;

  if (isFileNamed(input)) {
    filename = input.name;
    input = input.file;
  }

  if (isFileBrowser(input)) {
    file = input;
    filename = input.name;
  } else if (isFileBase(input)) {
    file = b64toBlob(input);
  } else if (isFileBlob(input)) {
    file = input;
  } else {
    return Promise.reject(new Error('Unsupported input file type'));
  }

  return readFile(file).then((buffer) => {
    return new FsFile({
      buffer,
      name: sanitizeName(filename),
      size: buffer.byteLength,
      type: file.type || getMimetype(new Uint8Array(buffer)),
    });
  });
};

// =================== NODE UTILS ===================
/**
 * Accepts Buffer or filepath or base64 string
 *
 * @node
 * @param {*} inputFile
 * @returns {Promise<File>}
 */
const getFileNode = (input: InputFile): Promise<FsFile> => {
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

        return resolve(new FsFile({
          buffer,
          name: sanitizeName(filename || (require('path')).basename(path)),
          size: buffer.byteLength,
          type: getMimetype(buffer),
        }));
      });
    });
  }

  if (isFileBase(input)) {
    input = Buffer.from(input, 'base64');
  }

  if (isFileBuffer(input)) {
    return Promise.resolve(new FsFile({
      buffer: input,
      name: filename,
      size: input.byteLength,
      type: getMimetype(input),
    }));
  }

  return Promise.reject(new Error('Unsupported input file type'));
};

export const getFile = isNode() ? getFileNode : getFileBrowser;