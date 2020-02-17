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

type PrefetchOptionsSetting = {
  inapp_browser: boolean;
  customsource: boolean;
};

type PrefetchOptionsPermissions = {
  intelligent_ingestion: boolean;
  blocked: boolean;
  blacklisted: boolean;
  whitelabel: boolean;
};

type PrefetchOptions = {
  pickerOptions: PickerOptions;
  settings: PrefetchOptionsSetting;
  permissions: PrefetchOptionsPermissions;
};

type responseObject = {
  intelligent_ingestion: boolean;
  blocked: boolean;
  blacklisted: boolean;
  whitelabel: boolean;
  customsource: boolean;
  inapp_browser: boolean;
  updated_config: {
    fromSources: string[];
  };
};

/**
 * @private
 */
export class Prefetch {
  private session: Session;

  private prefetchUrl: string;

  private configToCheck: PickerOptions;

  constructor(session: Session) {
    this.session = session;
    this.prefetchUrl = session.urls.cloudApiUrl;
  }

  async getConfig({ pickerOptions, settings, permissions }: PrefetchOptions) {
    // @todo: stay?
    if (this.session.prefetch) {
      return Promise.resolve(this.session.prefetch);
    }

    const configToSend = this.cleanUpCallback(pickerOptions);

    const paramsToSend = {
      apikey: this.session.apikey,
      security: {
        policy: this.session.policy,
        signature: this.session.signature,
      },
      settings,
      permissions,
      picker_config: configToSend,
    };

    const response = await requestWithSource()
      .post(`${this.prefetchUrl}/prefetch`, paramsToSend)
      .then(res => res.data)
      .then(data => data);

    // @todo
    // after response reassign callback and return picker config
    // const pickerOptionsToReturn = this.reassignCallbacks(response);

    const pickerOptionsToReturn = this.reassignCallbacks(response);
    return pickerOptionsToReturn;

    // @todo make request to backend and assign them to session
    // return Promise.resolve(this.session.prefetch);
  }

  private cleanUpCallback(pickerOptions: PickerOptions) {
    // make copy of original picker config and cleanup all callbacks (all methods started form onXX)
    const tempCallbackVariable: null = null;

    this.configToCheck = pickerOptions;

    pickerOptions = {
      onClose: tempCallbackVariable,
      onOpen: tempCallbackVariable,
      onFileSelected: tempCallbackVariable,
      onFileUploadStarted: tempCallbackVariable,
      onFileUploadFinished: tempCallbackVariable,
      onFileUploadFailed: tempCallbackVariable,
      onFileUploadProgress: tempCallbackVariable,
      onFileCropped: tempCallbackVariable,
      onUploadStarted: tempCallbackVariable,
      onUploadDone: tempCallbackVariable,
    };

    return pickerOptions;
  }

  private reassignCallbacks(response: responseObject): PrefetchOptions {
    // reassign all callback to new config returned from prefetch
    return {
      pickerOptions: {
        fromSources: response.updated_config.fromSources,
      },
      settings: {
        inapp_browser: response.inapp_browser,
        customsource: response.customsource,
      },
      permissions: {
        intelligent_ingestion: response.intelligent_ingestion,
        blocked: response.blocked,
        blacklisted: response.blacklisted,
        whitelabel: response.whitelabel,
      },
    };
  }
}
