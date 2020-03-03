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

import * as cloneDeep from 'lodash.clonedeep';
// import Debug from 'debug';
import { FilestackError } from './../../filestack_error';
import { Session, Security } from './../client';
import { PickerOptions } from './../picker';
import { FsRequest } from '../request';
import { cleanUpCallbacks } from './../utils';

// const debug = Debug('fs:prefetch');

export type PrefetchSettings = {
  inapp_browser?: boolean;
  customsource?: boolean;
};

export type PrefetchPermissions = {
  intelligent_ingestion?: boolean;
  blocked?: boolean;
  blacklisted?: boolean;
  whitelabel?: boolean;
  transforms_ui?: boolean;
};

export enum PrefetchOptionsEvents {
  PICKER = 'picker',
  TRANSFORM_UI = 'transform_ui',
}

type PrefetchOptions = {
  pickerOptions?: PickerOptions;
  settings?: keyof PrefetchPermissions[];
  permissions?: keyof PrefetchSettings[];
  events?: PrefetchOptionsEvents[];
};

interface PrefetchRequest {
  apikey: string;
  security?: Security;
  permissions?: keyof PrefetchPermissions[];
  settings?: keyof PrefetchSettings[];
  events?: PrefetchOptionsEvents[];
  picker_config?: PickerOptions;
}

export type PrefetchResponse = {
  blocked?: boolean;
  settings?: PrefetchSettings;
  permissions?: PrefetchPermissions;
  updated_config: PickerOptions;
};

/**
 * @private
 */
export class Prefetch {

  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  // @todo any return type?
  // @todo think how to pass params?
  // @todo we cant use lodash merge :/
  async getConfig({ pickerOptions, settings, permissions, events }: PrefetchOptions) {
    // @todo this one we will add later
    // if (this.session.prefetch) {
    //   FsRequest.post(`${this.prefetchUrl}/prefetch`, { events }).then(() => {
    //     debug('Prefetch request finished. Events sent to backend');
    //   });

    //   return Promise.resolve(this.session.prefetch);
    // }

    const configToSend = cleanUpCallbacks(cloneDeep(pickerOptions));

    let paramsToSend: PrefetchRequest = {
      apikey: this.session.apikey,
      permissions,
      settings,
      picker_config: configToSend,
      events,
    };

    if (this.session.policy && this.session.signature) {
      paramsToSend.security = { policy: this.session.policy, signature: this.session.signature };
    }

    return FsRequest.post(`${this.session.urls.uploadApiUrl}/prefetch`, paramsToSend).then((res) => {
      if (res.status !== 200) {
        throw new FilestackError('There is a problem with prefetch request');
      }
      let data = res.data;

      // todo reassign callbacks from old config to new one
      data.updated_config = this.reassignCallbacks(pickerOptions || {}, data.updated_config || {});
      this.session.prefetch = data;

      return data;
    });
  }

  // @todo
  private reassignCallbacks(objOld, objTarget) {
    if (!objOld || Object.keys(objOld).length === 0) {
      return objOld;
    }

    return Object.keys(objOld).map((k) => {
      if (!objOld[k]) {
        return objOld[k];
      }

      if (typeof objOld[k] === 'function') {
        objTarget[k] = objOld[k];
      }

      if (objOld[k] === Object(objOld[k])) {
        return this.reassignCallbacks(objOld[k], objTarget[k]);
      }

      return objTarget[k];
    });
  }
}
