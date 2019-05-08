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
import { Security, Session } from '../client';
import { Filelink, StoreParams } from './../filelink';
import { FilestackError } from './../../FilestackError';

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
  session: Session,
  url?: string,
  opts?: StoreParams,
  token?: any,
  security?: Security
): Promise<any> => {
  if (!url || typeof url !== 'string') {
    throw new Error('url is required for storeURL');
  }

  session.policy = security && security.policy || session.policy;
  session.signature = security && security.signature || session.signature;

  const baseURL = new Filelink(url, session.apikey);
  baseURL.setCname(session.cname);
  baseURL.setBase64(true);

  if (session.policy && session.signature) {
    baseURL.security({
      policy: session.policy,
      signature: session.signature,
    });
  }

  baseURL.store(opts);
  let options: any = {};

  if (token) {
    const CancelToken = request.CancelToken;
    const source = CancelToken.source();
    token.cancel = source.cancel;

    options.cancelToken = source.token;
  }

  return request.get(baseURL.toString(), options).then((res) => {
    if (res.data && res.data.handle) {
      return { ...res.data, mimetype: res.data.type };
    }

    throw new FilestackError(`Invalid store response ${JSON.stringify(res.data)}`);
  });
};
