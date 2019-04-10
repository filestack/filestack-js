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
import { md5 } from './../../utils';

export interface FileInstance {
  buffer?: Buffer | ArrayBuffer;
  name: string;
  type: string;
  size: number;
}

export interface FilePart {
  startByte: number;
  endByte: number;
  partNumber: number;
  buffer: Buffer | ArrayBuffer;
  size: number;
  md5: string;
}

/**
 * File representation to unify file object in nodejs and browser
 *
 * @export
 * @class File
 */
export class File {

  private _md5: string;

  constructor(private readonly file: FileInstance) {
  }

  /**
   * Returns file name
   *
   * @returns {string}
   * @memberof File
   */
  get name(): string {
    return this.file.name || 'untitled';
  }

  /**
   * Returns file type
   *
   * @default 'application/octet-stream'
   * @returns {string}
   * @memberof File
   */
  get type(): string {
    return this.file.type || 'application/octet-stream';
  }

  /**
   * Returns file buffer
   *
   * @returns {(Buffer | ArrayBuffer)}
   * @memberof File
   */
  get buffer(): Buffer | ArrayBuffer {
    return this.file.buffer;
  }

  /**
   * Returns file size
   *
   * @returns {number}
   * @memberof File
   */
  get size(): number {
    return this.file.size || this.file.buffer.byteLength;
  }

  /**
   * Returns file md5 checksum
   *
   * @returns {string}
   * @memberof File
   */
  get md5(): string {
    if (this._md5) {
      return this._md5;
    }

    // cache md5 file value
    const md5Res = md5(this.file.buffer);
    this._md5 = md5Res;

    return md5Res;
  }

  /**
   * Returns number of parts according to part size
   *
   * @param {number} size - part size in bytes
   * @returns {number}
   * @memberof File
   */
  getPartsCount (size: number): number {
    return Math.ceil(this.file.buffer.byteLength / size);
  }

  /**
   * Returns FilePart object for uploads with calculated md5
   *
   * @private
   * @param {*} num - part number
   * @param {*} size - part size in bytes (default: 0)
   * @returns {FilePart}
   * @throw Error - when part is out of boundary
   * @memberof File
   */
  getPart(partNum = 0, size): FilePart {
    const part = this.getSlice(size * partNum, size);

    return {
      ...part,
      partNumber: partNum,
    };
  }

  /**
   * Teturn part chunk for given start and offset
   *
   * @param {number} partNum
   * @param {number} partStart
   * @param {number} offset
   * @returns {FilePart}
   * @memberof File
   */
  getPartOffset(partNum: number, partStart: number, offset: number, chunkSize: number): FilePart {
    const part = this.getSlice(partStart + offset, chunkSize);

    return {
      ...part,
      partNumber: partNum,
    };
  }

  private getSlice(start: number, end: number) {
    let length = end;

    if (this.file.buffer.byteLength < start + end) {
      length = this.file.buffer.byteLength - start + end;
    }

    const part = this.file.buffer.slice(start, start + length);

    return {
      startByte: start,
      endByte: start + length,
      buffer: part,
      size: part.byteLength,
      md5: md5(part),
    };
  }

  cleanup() {
    this.file.buffer = null;
  }
}
