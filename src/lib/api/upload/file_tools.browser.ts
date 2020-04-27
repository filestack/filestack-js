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
import fileType from 'file-type';

export type RawFile = Blob | Buffer | File | string;
export type NamedInputFile = {
  name?: string;
  file: RawFile;
};

type InputFile = RawFile | NamedInputFile;

const base64Regexp = /data:([a-zA-Z]*\/[a-zA-Z]*);base64,([^\"]*)/i;

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

    byteArrays.push(new Uint8Array(byteNumbers));
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
const readFile = async (file): Promise<any> => {
  /* istanbul ignore next */
  if (!File || !FileReader || !Blob) {
    return Promise.reject(new FilestackError('The File APIs are not fully supported by your browser'));
  }

  return Promise.resolve({
    slice: function(start: number, end: number) {
      return readPart(start, end, file);
    },
    release: () => {
      file = null;
    },
  });
};

/**
 * Read file par instead of whole file to avoid browser crashing
 *
 * @param start - star byte
 * @param end  - end byte
 * @param file - file to slice
 */
const readPart = (start: number, end: number, file): Promise<any> => {
  return new Promise((resolve, reject) => {
    const r = new FileReader();

    const blob = file.slice(start, end);
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsArrayBuffer(blob);
  });
};

/**
 * Accepts b64string or blob file
 *
 * @browser
 * @param {*} fileOrString
 * @returns {Promise<File>}
 */
export const getFile = (input: InputFile, sanitizeOptions?: SanitizeOptions): Promise<FsFile> => {
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

  return readFile(file).then(
    async res => {
      let mime = file.type;
      if (!file.type  || file.type.length === 0 || file.type === 'text/plain') {
        mime = getMimetype(await res.slice(0, fileType.minimumBytes), filename);
      }

      return new FsFile(
        {
          name: filename,
          size: file.size,
          type: mime,
          slice: res.slice,
          release: res.release,
        },
        sanitizeOptions
      );
    }
  );
};
