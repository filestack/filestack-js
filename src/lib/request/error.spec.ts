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

import { FsRequestError, FsRequestErrorCode } from './error';

describe('Request/Error', () => {
  describe('new FsRequestError()', () => {
    it('should return response instance of error', () => {
      const error = new FsRequestError(
        'Some error message',
        {},
        { status: 404, statusText: 'some error message', headers: '', data: Date(), config: {} },
        FsRequestErrorCode.ABORTED
      );
      expect(error).toBeInstanceOf(Error);
    });
  });
});