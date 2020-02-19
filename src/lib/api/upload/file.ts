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
import { md5, sanitizeName, SanitizeOptions } from './../../utils';

export interface UploadTags {
  [key: string]: string;
}

export interface FileInstance {
  name: string;
  type: string;
  size: number;
  slice: (start: number, end: number) => Promise<ArrayBuffer>;
  release?: () => void;
}

export const enum FileState {
  INIT = 'Initialized',
  PROGRESS = 'Progress',
  STORED = 'Stored',
  INTRANSIT = 'InTransit',
  FAILED = 'Failed',
}

export interface FilePartMetadata {
  startByte: number;
  endByte: number;
  partNumber: number;
  size: number;
}

export interface FilePart extends FilePartMetadata {
  buffer: Buffer | ArrayBuffer;
  md5?: string;
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

  public status: FileState;

  public handle: string;

  public url: string;

  public container: string;

  public key: string;

  public workflows: any[];

  public uploadTags: UploadTags;

  constructor(private readonly _file: FileInstance, private readonly _sanitizeOptions?: SanitizeOptions) {
    this._file.name = sanitizeName(this._file.name, this._sanitizeOptions);
  }

  /**
   * Returns file name
   *
   * @returns {string}
   * @memberof File
   */
  public get name(): string {
    return this._file.name;
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
    this._file.name = sanitizeName(val, this._sanitizeOptions);
  }

  /**
   * Sets custom name using string or function
   * Name will be sanitized
   *
   * @memberof File
   */
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
    /* istanbul ignore next */
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
   * Returns file size
   *
   * @returns {number}
   * @memberof File
   */
  public get size(): number {
    return this._file.size;
  }

  /**
   * Returns number of parts according to part size
   *
   * @param {number} size - part size in bytes
   * @returns {number}
   * @memberof File
   */
  public getPartsCount (size: number): number {
    return Math.ceil(this._file.size / size);
  }

  /**
   * Returns part metadata
   *
   * @param {number} [partNum=0]
   * @param {*} size
   * @returns {FilePartMetadata}
   * @memberof File
   */
  public getPartMetadata (partNum: number, size: number): FilePartMetadata {
    const startByte = size * partNum;

    if (startByte > this._file.size) {
      throw new Error(`Start byte of the part is higher than buffer size`);
    }

    const endByte = Math.min(startByte + size, this._file.size);

    return {
      partNumber: partNum,
      startByte,
      endByte,
      size: endByte - startByte,
    };
  }

  /**
   * Returns part metadata + buffer
   *
   * @param {FilePartMetadata} meta
   * @returns {FilePart}
   * @memberof File
   */
  public async getPartByMetadata(meta: FilePartMetadata, md5Enabled: boolean = true): Promise<FilePart> {
    let slice = await this._file.slice(meta.startByte, meta.endByte);

    return Promise.resolve({
      ...meta,
      buffer: slice,
      md5: md5Enabled ? md5(slice) : undefined,
    });
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
  public async getChunkByMetadata(meta: FilePartMetadata, offset: number, chunkSize: number, md5Enabled: boolean = true): Promise<FileChunk> {
    const startByte = meta.startByte + offset;
    const endByte = Math.min(startByte + chunkSize, meta.endByte);

    let slice = await this._file.slice(startByte, endByte);

    return Promise.resolve({
      ...meta,
      buffer: slice,
      md5: md5Enabled ? md5(slice) : undefined,
      size: slice.byteLength,
      startByte,
      endByte,
      offset,
    });
  }
  /**
   * Cleanup file buffer to release memory
   *
   * @memberof File
   */
  public release() {
    if (this._file.release) {
      this._file.release();
    }
  }

  public toJSON() {
    return {
      name: this.name,
      status: this.status,
      type: this.type,
      size: this.size,
      url: this.url,
      handle: this.handle,
      uploadTags: this.uploadTags,
    };
  }
}
