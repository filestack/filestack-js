import { Filelink } from './../filelink';
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

import { request } from './request';
import { Security, StoreOptions } from '../client';
import { transform } from './transform';

/**
 *
 * @private
 * @param session
 * @param url
 * @param opts
 * @param token
 * @param security
 */
export const storeURL = (
  session: any,
  url?: string,
  opts?: StoreOptions,
  token?: any,
  security?: Security
): Promise<{}> => {
  if (!url || typeof url !== 'string') {
    throw new Error('url is required for storeURL');
  }

  session.policy = security && security.policy || session.policy;
  session.signature = security && security.signature || session.signature;

  const baseURL = new Filelink(url, session.apikey);
  baseURL.setCname(session.cname);
  // baseURL.setBase64(true); // Enable it after fix in mocks

  if (session.urls.cdnUrl.indexOf('localhost') > -1 || session.urls.cdnUrl.indexOf('badurl') > -1) {
    baseURL.setCustomDomain(session.urls.cdnUrl);
  }

  if (session.policy && session.signature) {
    baseURL.security({
      policy: session.policy,
      signature: session.signature,
    });
  }

  baseURL.store(opts);

  // const baseURL = transform(session, url, {
  //   store : opts || {},
  // });
  return new Promise((resolve, reject) => {
    const req = request.get(baseURL.toString());

    if (token) {
      token.cancel = () => {
        req.abort();
        reject(new Error('Upload cancelled'));
      };
    }

    return req.then((res: any) => {
      if (res.body && res.body.url) {
        const handle = res.body.url.split('/').pop();
        const response = { ...res.body, handle, mimetype: res.body.type };
        return resolve(response);
      }

      return resolve(res.body);
    }).catch((err) => {
      reject(err);
    });
  });
};
