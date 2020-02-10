/*
 * Copyright (c) 2018 by Filestack
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

import { FsRequestError, FsRequestErrorCode } from './../error';
import Debug from 'debug';

const debug = Debug('fs:request:shouldRetry');

/**
 * Indicates if method should be retried
 *
 * @private
 * @param {FsRequestError} err
 * @returns
 * @memberof Dispatch
 */
export const shouldRetry = (err: FsRequestError) => {
  debug('Checking error for retry. Code: %n, type: %s', (err.response ? err.response.status : 'Malformed response'), err.code);

  // we always should retry on network failure
  switch (err.code) {
    case FsRequestErrorCode.NETWORK:
    case FsRequestErrorCode.SERVER:
    case FsRequestErrorCode.TIMEOUT:
      return true;
    // we should not make request on request aborted
    case FsRequestErrorCode.ABORTED:
      return false;
  }

  if (!err.response) {
    return false;
  }

  // we should retry on all server errors (5xx)
  // this should be handled by FsRequestErrorCode.SERVER but to be sure
  if (500 <= err.response.status && err.response.status <= 599) {
    return true;
  }

  // we should not retry on other errors (4xx) ie: BadRequest etc
  return false;
};
