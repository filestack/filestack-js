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
import { FsTokenInterface } from './types';
import { EventEmitter } from 'eventemitter3';

// token
const token = data => new Promise(resolve => data.listeners.push(resolve));

const tokenSource = () => {
  const data = {
    reason: null,
    listeners: [],
  };

  const cancel = reason => {
    reason = reason || 'Aborted';

    if (typeof reason === 'string') {
      reason = new Error(reason);
    }

    data.reason = reason;

    // Only for security reason
    /* istanbul ignore next */
    setTimeout(function() {
      for (let i = 0; i < data.listeners.length; i++) {
        if (typeof data.listeners[i] === 'function') {
          data.listeners[i](reason);
          data.listeners.splice(i, 1);
        }
      }
    }, 0);
  };

  return {
    cancel: cancel,
    token: token(data),
  };
};

/**
 * Filestack token that allow pause, resume or cancel given upload
 *
 * @export
 * @class FsToken
 * @extends {EventEmitter}
 * @implements {FsTokenInterface}
 */
export class FsCancelToken implements FsTokenInterface {
  private source: any;
  private cancelMethod: any;

  constructor() {
    const cancelable = tokenSource();

    this.source = cancelable.token;
    this.cancelMethod = cancelable.cancel;
  }

  /**
   * Cancel request action
   *
   * @param {(string | Error)} [reason]
   * @memberof Token
   */
  public cancel(reason?: string | Error) {
    this.cancelMethod(reason);
  }

  /**
   * Returns cancel token promise
   *
   * @returns
   * @memberof Token
   */
  public getSource(): Promise<string> {
    return this.source;
  }
}
