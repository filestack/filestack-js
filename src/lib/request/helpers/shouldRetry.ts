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
/**
 * Indicates if method should be retried
 *
 * @private
 * @param {FsRequestError} err
 * @returns
 * @memberof Dispatch
 */
export const shouldRetry = (err: FsRequestError) => {
  // we always should retry on network failure
  switch (err.code) {
    case FsRequestErrorCode.NETWORK:
    case FsRequestErrorCode.SERVER:
    case FsRequestErrorCode.TIMEOUT:
      return true;
  }

  // if request was not made and there is no response - retry
  if (!err.response) {
    return true;
  }

  // we should retry on all server errors (5xx)
  if (500 <= err.response.status && err.response.status <= 599) {
    return true;
  }

  // we should not retry on other errors (4xx) ie: BadRequest etc
  return false;
};
