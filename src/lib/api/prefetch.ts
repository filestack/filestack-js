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

import { ClientOptions, Session } from '../client';
import { PickerOptions } from './../picker';
import { requestWithSource } from '../api/request';

type PrefetchOptions = {
  pickerOptions: PickerOptions,
  settings: any, // @todo interface
  permissions: any,  // @todo interface
};

/**
 * @private
 */
export class Prefetch {
  private session: Session;

  private prefetchUrl: string;

  private configToCheck: PickerOptions;

  // private requestInProgress;

  constructor(session: Session) {
    this.session = session;
    this.prefetchUrl = session.urls.cloudApiUrl;
  }

  async getConfig({ pickerOptions, settings, permissions }: PrefetchOptions) {

    if (this.session.prefetch) {
      return Promise.resolve(this.session.prefetch);
    }

    const configToSend = this.cleanUpCallback(pickerOptions);
    //pickerOptions

    // const params = {
    //   apikey: this.session.apikey,
    //   security: {
    //     policy: this.session.policy,
    //     signature: this.session.signature,
    //   },
    //   settings,
    //   permissions,
    //   picker_config: configToSend,
    // };

    // @todo
    // after response reassign callback and return picker confif

    // cosnt pickerOptionsToReturn = this.reassignCallbacks(response);

    return Promise.resolve({
      blocked: false,
      settings: {
        inapp_browser: true,
      },
      permissions: {
        whitelabel: false,
      },
      pickerOptions,
    });

    // @todo make request to backend and assign them to session
    // return Promise.resolve(this.session.prefetch);
  }

  private cleanUpCallback(pickerOptions: PickerOptions) {
    this.configToCheck = pickerOptions;
    // make copy of original picker config and cleanup all callbacks (all methods started form onXX)
  }

  private reassignCallbacks() {
    // reassign all callback to new config returned from prefetch
  }
}
