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

import { FsCancelToken } from './token';

describe('Request/Token', () => {
  describe('cancel', () => {
    const token = new FsCancelToken();
    it('cancel token should return undefined without value', () => expect(token.cancel()).toEqual(undefined));
  });

  describe('cancel', () => {
    const token = new FsCancelToken();
    // @ts-ignore
    it("cancel token should return undefined with value new String('Aborted')", () => expect(token.cancel(new String('Aborted'))).toEqual(undefined));
  });

  describe('source token', () => {
    it('Cancel event should be called', done => {
      const token = new FsCancelToken();
      const cancelSpy = jest.fn().mockName('cancelSpy');

      token.once('cancel', cancelSpy);
      token.cancel();

      setTimeout(() => {
        expect(cancelSpy).toHaveBeenCalled();
        done();
      }, 10);
    });
  });

  it('Cancel event should be called with reason', done => {
    const token = new FsCancelToken();
    const cancelSpy = jest.fn().mockName('cancelSpy');
    const cancelReason = 'test';

    token.once('cancel', cancelSpy);
    token.cancel(cancelReason);

    setTimeout(() => {
      expect(cancelSpy).toHaveBeenCalledWith(cancelReason);
      done();
    }, 10);
  });
});
