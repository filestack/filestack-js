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

import * as t from 'tcomb-validation';
import { request } from './request';
import { checkOptions, removeEmpty } from '../utils';
import { Security, StoreOptions } from '../client';

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
  const allowed = [
    { name: 'filename', type: t.String },
    { name: 'location', type: t.enums.of('s3 gcs rackspace azure dropbox') },
    { name: 'path', type: t.String },
    { name: 'region', type: t.String },
    { name: 'container', type: t.String },
    { name: 'access', type: t.enums.of('public private') },
    { name: 'workflowIds', type: t.list(t.String) },
  ];

  checkOptions('storeURL', allowed, opts);

  const options: any = { ...opts };
  const location = options.location || 's3';
  options.key = session.apikey;
  options.policy = security && security.policy || session.policy;
  options.signature = security && security.signature || session.signature;

  const baseURL = `${session.urls.storeApiUrl}/${location}`;

  return new Promise((resolve, reject) => {
    const req = request
      .post(baseURL)
      .query(removeEmpty(options))
      .field('url', url);

    if (token) {
      token.cancel = () => {
        req.abort();
        reject(new Error('Upload cancelled'));
      };
    }

    req.then((res: any) => {
      if (res.body && res.body.url) {
        const handle = res.body.url.split('/').pop();
        const response = { ...res.body, handle, mimetype: res.body.type };
        resolve(response);
      } else {
        resolve(res.body);
      }
    }).catch((err) => {
      reject(err);
    });
  });
};
