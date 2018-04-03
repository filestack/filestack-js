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

import { ClientOptions, Session, StoreOptions } from '../client';
import { removeEmpty } from '../utils';
import { requestWithSource as request } from '../api/request';

/**
 * @private
 */
export const PICKER_KEY = '__fs_picker_token';

/**
 * @private
 */
export class CloudClient {
  session: Session;
  cloudApiUrl: string;
  private cache: boolean = false;
  private _token: string;

  constructor(session: Session, options?: ClientOptions) {
    this.session = session;
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
    return this._token;
  }

  set token(key) {
    if (this.cache) {
      localStorage.setItem(PICKER_KEY, key);
    }
    this._token = key;
  }

  prefetch() {
    const params = {
      apikey: this.session.apikey,
    };
    return request('get', `${this.cloudApiUrl}/prefetch`)
      .query(params)
      .then((res: any) => res.body);
  }

  list(clouds: any, token: any = {}) {
    const payload: any = {
      apikey: this.session.apikey,
      clouds,
      flow: 'web',
      token: this.token,
    };
    if (this.session.policy && this.session.signature) {
      payload.policy = this.session.policy;
      payload.signature = this.session.signature;
    }
    return new Promise((resolve, reject) => {
      const req = request('post', `${this.cloudApiUrl}/folder/list`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            if (response.body && response.body.token) {
              this.token = response.body.token;
            }
            resolve(response.body);
          }
        });
      token.cancel = () => {
        req.abort();
        reject(new Error('Cancelled'));
      };
    });
  }

  store(name: string, path: string, options: StoreOptions = {}, customSource: any = {}, token: any = {}) {

    // Default to S3
    if (options.location === undefined) options.location = 's3';

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

    return new Promise((resolve, reject) => {
      const req = request('post', `${this.cloudApiUrl}/store/`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            if (response.body && response.body.token) {
              this.token = response.body.token;
            }
            if (response.body && response.body[name]) {
              resolve(response.body[name]);
            } else {
              resolve(response.body);
            }
          }
        });

      token.cancel = () => {
        req.abort();
        reject(new Error('Cancelled'));
      };
    });
  }

  link(name: string, path: string, customSource: any = {}, token: any = {}) {
    const payload: any = {
      apikey: this.session.apikey,
      token: this.token,
      flow: 'web',
      clouds: {
        [name]: {
          path,
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
    return new Promise((resolve, reject) => {
      const req = request('post', `${this.cloudApiUrl}/link/`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            if (response.body && response.body.token) {
              this.token = response.body.token;
            }
            if (response.body[name]) {
              resolve(response.body[name]);
            } else {
              resolve(response.body);
            }
          }
        });
      token.cancel = () => {
        req.abort();
        reject(new Error('Cancelled'));
      };
    });
  }

  logout(name?: string) {
    const payload: any = {
      apikey: this.session.apikey,
      flow: 'web',
      token: this.token,
    };
    if (name) {
      payload.clouds = {
        [name]: {},
      };
    } else {
      // No name means logout of ALL clouds. Clear local session.
      if (this.cache) {
        localStorage.removeItem(PICKER_KEY);
      }
    }
    return new Promise((resolve, reject) => {
      request('post', `${this.cloudApiUrl}/auth/logout/`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            if (response.body && response.body.token) {
              this.token = response.body.token;
            }
            resolve(response.body);
          }
        });
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
    return new Promise((resolve, reject) => {
      request('post', `${this.cloudApiUrl}/metadata`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.body);
          }
        });
    });
  }

  // OpenTok API Endpoints
  tokInit(type: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new Error('Type must be one of video or audio.');
    }
    return new Promise((resolve, reject) => {
      return request('post', `${this.cloudApiUrl}/recording/${type}/init`)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
    });
  }

  tokStart(type: string, key: string, sessionId: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new Error('Type must be one of video or audio.');
    }
    const payload = {
      apikey: key,
      session_id: sessionId,
    };
    return new Promise((resolve, reject) => {
      return request('post', `${this.cloudApiUrl}/recording/${type}/start`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
    });
  }

  tokStop(type: string, key: string, sessionId: string, archiveId: string) {
    if (type !== 'video' && type !== 'audio') {
      throw new Error('Type must be one of video or audio.');
    }
    const payload = {
      apikey: key,
      session_id: sessionId,
      archive_id: archiveId,
    };
    return new Promise((resolve, reject) => {
      return request('post', `${this.cloudApiUrl}/recording/${type}/stop`)
        .send(payload)
        .end((err: Error, response: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
    });
  }
}
