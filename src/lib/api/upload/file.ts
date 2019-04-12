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
import { md5, sanitizeName } from './../../utils';

export interface FileInstance {
  buffer?: Buffer | ArrayBuffer;
  name: string;
  type: string;
  size: number;
}

export const enum FileState {
  INIT = 'init',
  PROGRESS = 'progress',
  STORED = 'stored',
  INTRANSIT = 'inTransit',
  FAILED = 'failed',
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

  public status: FileState;

  public handle: string;

  public url: string;

  constructor(private readonly _file: FileInstance) {
  }

  /**
   * Returns file name
   *
   * @returns {string}
   * @memberof File
   */
  public get name(): string {
    return this._file.name || 'untitled';
  }

  /**
   * Sets new file name  and cleanup extra chars
   *
   * @memberof File
   */
  public set name(val: string) {
    this._file.name = sanitizeName(val);
  }

  /**
   * Returns file type
   *
   * @default 'application/octet-stream'
   * @returns {string}
   * @memberof File
   */
  public get type(): string {
    return this._file.type || 'application/octet-stream';
  }

  /**
   * Alias for file type
   *
   * @readonly
   * @type {string}
   * @memberof File
   */
  public get mimetype(): string {
    return this.type;
  }

  /**
   * Returns file buffer
   *
   * @returns {(Buffer | ArrayBuffer)}
   * @memberof File
   */
  public get buffer(): Buffer | ArrayBuffer {
    return this._file.buffer;
  }

  /**
   * Returns file size
   *
   * @returns {number}
   * @memberof File
   */
  public get size(): number {
    return this._file.size || this._file.buffer.byteLength;
  }

  /**
   * Returns file md5 checksum
   *
   * @returns {string}
   * @memberof File
   */
  public get md5(): string {
    if (!this._md5) {
      // cache md5 file value
      this._md5 = md5(this._file.buffer);
    }

    return this._md5;
  }

  /**
   * Returns number of parts according to part size
   *
   * @param {number} size - part size in bytes
   * @returns {number}
   * @memberof File
   */
  public getPartsCount (size: number): number {
    return Math.ceil(this._file.buffer.byteLength / size);
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
  public getPart(partNum = 0, size): FilePart {
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
  public getPartOffset(partNum: number, partStart: number, offset: number, chunkSize: number): FilePart {
    const part = this.getSlice(partStart + offset, chunkSize);

    return {
      ...part,
      partNumber: partNum,
    };
  }

  /**
   * Cleanup file buffer to release memory
   *
   * @memberof File
   */
  public release() {
    this._file.buffer = null;
  }

  public toJSON() {
    return {
      name: this.name,
      status: this.status,
      type: this.type,
      md5: this.md5,
      size: this.size,
      url: this.url,
      handle: this.handle,
    };
  }

  /**
   * Returns file slice from start to end
   *
   * @private
   * @param {number} start
   * @param {number} end
   * @returns
   * @memberof File
   */
  private getSlice(start: number, end: number) {
    let length = end;

    if (this._file.buffer.byteLength < start + end) {
      length = this._file.buffer.byteLength - start + end;
    }

    const part = this._file.buffer.slice(start, start + length);

    return {
      startByte: start,
      endByte: start + length,
      buffer: part,
      size: part.byteLength,
      md5: md5(part),
    };
  }
}
