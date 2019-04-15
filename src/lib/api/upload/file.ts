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

export interface FilePartMetadata {
  startByte: number;
  endByte: number;
  partNumber: number;
  size: number;
}

export interface FilePart extends FilePartMetadata {
  buffer: Buffer | ArrayBuffer;
  md5: string;
}

export interface FileChunk extends FilePart {
  offset: number; // offset for chunk - from part start
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
   * Alias for name getter
   *
   * @readonly
   * @type {string}
   * @memberof File
   */
  public get filename(): string {
    return this.name;
  }

  /**
   * Sets new file name  and cleanup extra chars
   *
   * @memberof File
   */
  public set name(val: string) {
    this._file.name = sanitizeName(val);
  }

  public set customName(val: ((file: this) => string) | string) {
    switch (typeof val) {
      case 'string':
        this.name = val;
        break;
      case 'function':
        const newName = val(this);
        if (typeof newName !== 'string') {
          throw new Error(`Name function must return a string. Current return type is ${typeof val}`);
        }

        this.name = val(this);
        break;
    }
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
   * Returns part metadata
   *
   * @param {number} [partNum=0]
   * @param {*} size
   * @returns {FilePartMetadata}
   * @memberof File
   */
  public getPartMetadata (partNum: number = 0, size): FilePartMetadata {
    const start = size * partNum;

    if (this._file.buffer.byteLength < start + size) {
      size = this._file.buffer.byteLength - start;
    }

    return {
      partNumber: partNum,
      startByte: start,
      endByte: start + size,
      size: size,
    };
  }

  /**
   * Returns part metadata + buffer
   *
   * @param {FilePartMetadata} meta
   * @returns {FilePart}
   * @memberof File
   */
  public getPartByMetadata(meta: FilePartMetadata): FilePart {
    let slice = this._file.buffer.slice(meta.startByte, meta.endByte);

    return {
      buffer: slice,
      md5: md5(slice),
      ...meta,
    };
  }

  /**
   * Returns part chunk
   *
   * @param {FilePartMetadata} meta
   * @param {number} offset
   * @param {number} chunkSize
   * @returns {FilePart}
   * @memberof File
   */
  public getChunkByMetadata(meta: FilePartMetadata, offset: number, chunkSize: number): FileChunk {
    const start = meta.startByte + offset;
    const end = Math.min(start + chunkSize, meta.endByte);

    let slice = this._file.buffer.slice(start, end);

    return {
      ...meta,
      buffer: slice,
      md5: md5(slice),
      size: slice.byteLength,
      startByte: start,
      endByte: end,
      offset,
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
}
