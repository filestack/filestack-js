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
import { FsRequestOptions, FsResponse } from './types';

/**
 * Filestack error codes (common for browser and node)
 *
 * @export
 * @enum {number}
 */
export enum FsRequestErrorCode {
  ABORTED = 'ABORTED',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEDOUT',
  SERVER = 'SERVER',
  REQUEST = 'REQUEST',
  OTHER = 'OTHER',
  REDIRECT = 'REDIRECT',
}

/**
 * Custom Filestack Request error class
 *
 * @export
 * @class FsRequestError
 * @extends {Error}
 */
export class FsRequestError extends Error {
  /**
   * Error details, ie validation errors
   *
   * @type {*}
   * @memberof FilestackError
   */
  public readonly config: FsRequestOptions;
  public readonly response: FsResponse;
  public readonly code: FsRequestErrorCode;

  /**
   * Creates an instance of FsRequestError.
   *
   * @param {string} message
   * @param {*} config
   * @param {FsResponse} [response]
   * @param {FsRequestErrorCode} [code]
   * @memberof FsRequestError
   */
  constructor(message: string, config: any, response?: FsResponse, code?: FsRequestErrorCode) {
    /* istanbul ignore next */
    super(message);

    this.config = config;
    this.response = response;
    this.code = code;

    // const captureStackTrace: Function = (Error as any).captureStackTrace;
    // captureStackTrace && captureStackTrace(this);
    fixProto(this, new.target.prototype);
  }
}

function fixProto(target: Error, prototype: {}) {
  const setPrototypeOf: Function = (Object as any).setPrototypeOf;
  /* istanbul ignore next */
  setPrototypeOf ? setPrototypeOf(target, prototype) : ((target as any).__proto__ = prototype);
}
