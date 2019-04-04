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
import { File } from './file';
import fileType from 'file-type';
import issvg from 'is-svg';
import * as isutf8 from 'isutf8';
import { isNode } from './is_node';

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
const b64toBlob = (b64Data: string, sliceSize = 512) => {
  let byteString;
  let contentType = '';
  if (b64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = b64Data.split(',')[1];
  }
  if (byteString !== undefined) {
    contentType = b64Data.split(',')[0].split(':')[1].split(';')[0];
    b64Data = decodeURI(byteString);
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
 * Is blob?
 *
 * @browser
 * @private
 * @param blob
 * @returns {Boolean}
 */
const isBlob = (blob: any): boolean => {
  return blob.toString() === '[object File]' || blob.toString() === '[object Blob]';
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
const browser = {
  /**
   * Accepts b64string or blob file
   *
   * @browser
   * @param {*} fileOrString
   * @returns {Promise<File>}
   */
  getFile(fileOrString: Blob | string): Promise<File> {
    let file: any = fileOrString;

    if (typeof fileOrString === 'string') {
      file = b64toBlob(file);
    }

    if (!file || !isBlob(file)) {
      return Promise.reject(new TypeError('File argument is not a valid Blob'));
    }

    return readFile(file).then((buffer) => {
      return new File({
        buffer,
        name: file.name || undefined,
        size: file.size || buffer.byteLength,
        type: file.type || getMimetype(new Uint8Array(buffer)),
      });
    });
  },
};

// =================== NODE UTILS ===================
const node = {
  /**
   * Accepts Buffer or filepath or base64 string
   *
   * @node
   * @param {*} inputFile
   * @returns {Promise<File>}
   */
  getFile(inputFile: Buffer | string): Promise<File> {
    if (typeof inputFile === 'string' && Buffer.from(inputFile, 'base64').toString('base64') === inputFile) {
      inputFile = Buffer.from(inputFile, 'base64');
    }

    if (inputFile instanceof Buffer) {
      return Promise.resolve(new File({
        buffer: inputFile,
        name: undefined,
        size: inputFile.byteLength,
        type: getMimetype(inputFile),
      }));
    }

    return new Promise((resolve, reject) => {
      (require('fs')).readFile(inputFile, (err, buffer) => {
        if (err) return reject(err);

        return resolve(new File({
          buffer,
          name: (require('path')).basename(inputFile),
          size: buffer.byteLength,
          type: getMimetype(buffer),
        }));
      });
    });
  },
};

let fileClass;

if (isNode) {
  fileClass = node.getFile;
} else {
  fileClass = browser.getFile;
}

export const getFile = fileClass;
