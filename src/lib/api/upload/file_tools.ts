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
import { isNode, SanitizeOptions, requireNode, getMimetype } from './../../utils';
import { FilestackError } from './../../../filestack_error';

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
const isFileBuffer = (input: InputFile): input is Buffer => Buffer.isBuffer(input);

/**
 * Check if file is blob
 * @param input
 */
const isFileBlob = (input: InputFile): input is Blob => input.toString() === '[object Blob]';

/**
 * Check if input is instance of browser file
 *
 * @browser
 * @param input
 */
const isFileBrowser = (input: InputFile): input is File => input instanceof File;

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
    input = input.match(base64Regexp).pop();
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
const isFileNamed = (input: InputFile): input is NamedInputFile => input && input['file'] && input['name'];

/**
 * Check if input is a valid file path
 *
 * @node
 * @param input
 */
const isFilePath = (input: InputFile): input is string => requireNode('fs').existsSync(input);

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
      return reject(new FilestackError('The File APIs are not fully supported by your browser'));
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
const getFileBrowser = (input: InputFile, sanitizeOptions?: SanitizeOptions): Promise<FsFile> => {
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
    return Promise.reject(new FilestackError('Unsupported input file type'));
  }

  return readFile(file).then((buffer) => {
    return new FsFile({
      buffer,
      name: filename,
      size: buffer.byteLength,
      type: file.type || getMimetype(new Uint8Array(buffer)),
    }, sanitizeOptions);
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
const getFileNode = (input: InputFile, sanitizeOptions?: SanitizeOptions): Promise<FsFile> => {
  let filename;

  if (isFileNamed(input)) {
    filename = input.name;
    input = input.file;
  }

  if (isFilePath(input)) {
    let path = input;

    return new Promise((resolve, reject) => {
      requireNode('fs').readFile(path, (err, buffer) => {
        if (err) {
          return reject(err);
        }

        return resolve(new FsFile({
          buffer,
          name: filename || (requireNode('path')).basename(path),
          size: buffer.byteLength,
          type: getMimetype(buffer),
        }, sanitizeOptions));
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
    }, sanitizeOptions));
  }

  return Promise.reject(new FilestackError('Unsupported input file type'));
};

export const getFile = (input: InputFile, sanitizeOptions?: SanitizeOptions) => isNode() ? getFileNode(input, sanitizeOptions) : getFileBrowser(input, sanitizeOptions);
