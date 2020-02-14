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
import { requestWithSource } from '../api/request';

/**
 * @private
 */
export class Prefetch {
  session: Session;
  prefetchUrl: string;
  private _isInAppBrowser = false;

  constructor(session: Session, options?: ClientOptions) {
    this.session = session;
    this.prefetchUrl = session.urls.cloudApiUrl;
  }

  async prefetchConfig(params1: any) {
    const params = {
      apikey: this.session.apikey,
    };

    return requestWithSource()
      .get(`${this.prefetchUrl}/prefetch`, { params: params })
      .then(res => res.data)
      .then(data => {
        if (data.inapp_browser) {
          this._isInAppBrowser = true;
        }

        return data;
      });

    const perms = {
      apikey: this.session.apikey,
      security: {
        policy: this.session.policy,
        signature: this.session.policy,
      },
      settings: ['inapp_browser', 'customsource'],
      permissions: ['whitelabel', 'itd'],
      picker_config: {},
    };

    // async prefetchConfig(params: any) {
    //   let assignParams = {
    //     apikey: this.session.apikey,
    //   };
    //   Object.assign(assignParams, params);

    //   console.log('PICKER | params', params);
    //   console.log('PICKER | assignParams', assignParams);

    // new response
    return new Promise(resolve => {
      const response = {
        blocked: false,
        settings: {
          inapp_browser: true,
        },
        permissions: {
          whitelabel: false,
        },
        updated_config: {
          fromSources: ['facebook'],
        },
      };

      resolve(response);
    });
  }

  // @todo interface
  // async prefetchConfig(params: any) {
  //   let assignParams = {
  //     apikey: this.session.apikey,
  //   };
  //   Object.assign(assignParams, params);

  //   return requestWithSource()
  //     .post(`${this.prefetchUrl}/prefetch`, assignParams)
  //     .then(res => res.data)
  //     .then(data => {
  //       if (data.inapp_browser) {
  //         this._isInAppBrowser = true;
  //       }
  //       return data;
  //     });
  // }
}
