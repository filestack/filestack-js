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

import { removeEmpty } from '../utils';
import { StoreParams } from '../filelink';
import { ClientOptions, Session } from '../client';
// import { requestWithSource, request } from '../api/request';
import { FilestackError } from './../../filestack_error';
import { FsRequest, FsCancelToken } from '../request';

/**
 * @private
 */
export const PICKER_KEY = '__fs_picker_token';

/**
 * key for picker callback url (specifies which tab will be opened after opening picker)
 * @private
 */
export const CALLBACK_URL_KEY = 'fs-tab';

/**
 * @private
 */
export class CloudClient {
  session: Session;
  cloudApiUrl: string;

  /**
   * Returns flag if token should be cached in local storage
   *
   * @private
   * @type {boolean}
   * @memberof CloudClient
   */
  private cache: boolean = false;

  /**
   * Token returned from api for accessing clouds
   *
   * @private
   * @type {string}
   * @memberof CloudClient
   */
  private _token: string;

  /**
   * Flag for in-app browser setup
   * (in-app browsers are not supporting new window so we need to save token to session cache)
   *
   * @private
   * @memberof CloudClient
   */
  private _isInAppBrowser = false;

  constructor(session: Session, options?: ClientOptions) {
    this.session = session;

    if (this.session.prefetch.settings.inapp_browser) {
      this._isInAppBrowser = this.session.prefetch.settings.inapp_browser;
    }

    this.cloudApiUrl = session.urls.cloudApiUrl;

    if (options && options.sessionCache) {
      this.cache = options.sessionCache;
    }
  }

  get token() {
    if (this.cache) {
      const token = localStorage.getItem(PICKER_KEY);
      if (token) return token;
    }

    if (this._isInAppBrowser) {
      return sessionStorage.getItem(PICKER_KEY);
    }

    return this._token;
  }

  set token(key) {
    if (this.cache) {
      localStorage.setItem(PICKER_KEY, key);
    }

    if (this._isInAppBrowser) {
      sessionStorage.setItem(PICKER_KEY, key);
    }

    this._token = key;
  }

  prefetch() {
    const params = {
      apikey: this.session.apikey,
    };
    return FsRequest.get(`${this.cloudApiUrl}/prefetch`, { params })
      .then(res => res.data)
      .then(data => {
        if (data.inapp_browser) {
          this._isInAppBrowser = true;
        }

        return data;
      });
  }

  list(clouds: any, cancelTokenInput?: any) {
    const payload: any = {
      apikey: this.session.apikey,
      clouds,
      flow: 'web',
      token: this.token,
    };

    if (this._isInAppBrowser) {
      payload.appurl = this.currentAppUrl();
    }

    if (this.session.policy && this.session.signature) {
      payload.policy = this.session.policy;
      payload.signature = this.session.signature;
    }

    let options: any = {};

    if (cancelTokenInput) {
      const cancelToken = new FsCancelToken();
      cancelTokenInput.cancel = cancelToken.cancel.bind(cancelToken);
      options.cancelToken = cancelToken;
    }

    return FsRequest.post(`${this.cloudApiUrl}/folder/list`, payload, options).then(res => {
      if (res.data && res.data.token) {
        this.token = res.data.token;
      }

      return res.data;
    });
  }

  store(name: string, path: string, options: StoreParams = {}, customSource: any = {}, cancelTokenInput?: any) {
    // Default to S3
    if (options.location === undefined) {
      options.location = 's3';
    }

    const payload: any = {
      apikey: this.session.apikey,
      token: this.token,
      flow: 'web',
      clouds: {
        [name]: {
          path,
          store: removeEmpty(options),
        },
      },
    };

    if (name === 'customsource' && customSource.customSourcePath) {
      payload.clouds.customsource.customSourcePath = customSource.customSourcePath;
    }

    if (name === 'customsource' && customSource.customSourceContainer) {
      payload.clouds.customsource.customSourceContainer = customSource.customSourceContainer;
    }

    if (this.session.policy && this.session.signature) {
      payload.policy = this.session.policy;
      payload.signature = this.session.signature;
    }

    let requestOptions: any = {};

    if (cancelTokenInput) {
      const cancelToken = new FsCancelToken();
      cancelTokenInput.cancel = cancelToken.cancel.bind(cancelToken);
      requestOptions.cancelToken = cancelToken;
    }

    return FsRequest.post(`${this.cloudApiUrl}/store/`, payload, requestOptions).then(res => {
      if (res.data && res.data.token) {
        this.token = res.data.token;
      }

      if (res.data && res.data[name]) {
        return res.data[name];
      }

      return res.data;
    });
  }

  logout(name?: string) {
    const payload: any = {
      apikey: this.session.apikey,
      flow: 'web',
      token: this.token,
    };

    if (name) {
      payload.clouds = { [name]: {} };
    } else {
      if (this.cache) {
        // No name means logout of ALL clouds. Clear local session.
        localStorage.removeItem(PICKER_KEY);
      }

      if (this._isInAppBrowser) {
        sessionStorage.removeItem(PICKER_KEY);
      }
    }

    return FsRequest.post(`${this.cloudApiUrl}/auth/logout`, payload).then(res => {
      if (res.data && res.data[name]) {
        return res.data[name];
      }
      return res.data;
    });
  }

  metadata(url: string) {
    const payload: any = {
      apikey: this.session.apikey,
      url,
    };

    if (this.session.policy && this.session.signature) {
      payload.policy = this.session.policy;
      payload.signature = this.session.signature;
    }

    return FsRequest.post(`${this.cloudApiUrl}/metadata`, payload).then(res => res.data);
  }

  // OpenTok API Endpoints
  tokInit(type: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new FilestackError('Type must be one of video or audio.');
    }
    return FsRequest.post(`${this.cloudApiUrl}/recording/${type}/init`).then(res => res.data);
  }

  tokStart(type: string, key: string, sessionId: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new FilestackError('Type must be one of video or audio.');
    }
    const payload = {
      apikey: key,
      session_id: sessionId,
    };

    return FsRequest.post(`${this.cloudApiUrl}/recording/${type}/start`, payload).then(res => res.data);
  }

  tokStop(type: string, key: string, sessionId: string, archiveId: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new FilestackError('Type must be one of video or audio.');
    }

    const payload = {
      apikey: key,
      session_id: sessionId,
      archive_id: archiveId,
    };

    return FsRequest.post(`${this.cloudApiUrl}/recording/${type}/stop`, payload).then(res => res.data);
  }

  private currentAppUrl() {
    if (!window.URLSearchParams) {
      return undefined;
    }

    // set init string for clouds backend,
    // After this cloud service can make redirect back to current page url with selected tab for given cloud
    // if param exists and its value is init, backend will fill it with cloud name
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(CALLBACK_URL_KEY, 'init');

    return `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams.toString()}`;
  }
}
