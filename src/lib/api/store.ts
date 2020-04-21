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

import { Security, Session } from '../client';
import { Filelink, StoreParams } from './../filelink';
import { FilestackError } from './../../filestack_error';
import { getValidator, StoreParamsSchema } from './../../schema';
import { FsRequest, FsCancelToken } from '../request';
import { UploadTags } from './upload/file';

export type StoreUrlParams = {
  session: Session;
  url?: string;
  storeParams?: StoreParams;
  token?: any;
  security?: Security;
  uploadTags?: UploadTags;
};

/**
 * Store given url with options and
 *
 * @param session
 * @param url
 * @param storeOpts
 * @param token
 * @param security
 * @param uploadTags
 */
export const storeURL = ({
  session,
  url,
  storeParams,
  token,
  security,
  uploadTags,
}: StoreUrlParams): Promise<any> => {
  if (!url || typeof url !== 'string') {
    return Promise.reject(new FilestackError('url is required for storeURL'));
  }

  const validateRes = getValidator(StoreParamsSchema)(storeParams);

  if (validateRes.errors.length) {
    return Promise.reject(new FilestackError(`Invalid store params`, validateRes.errors));
  }

  session.policy = security && security.policy || session.policy;
  session.signature = security && security.signature || session.signature;

  const filelink = new Filelink(url, session.apikey);
  filelink.store(storeParams);

  if (session.policy && session.signature) {
    filelink.security({
      policy: session.policy,
      signature: session.signature,
    });
  }

  let options: any = {};

  if (token) {
    const cancelToken = new FsCancelToken();
    token.cancel = cancelToken.cancel.bind(cancelToken);
    options.cancelToken = cancelToken;
  }

  return FsRequest.post(`${session.urls.processUrl}/process`, {
    apikey: session.apikey,
    sources: [ url ],
    tasks: filelink.getTasks(),
    upload_tags: uploadTags ? uploadTags : undefined,
  }, options).then((res) => {
    if (res.data && res.data.handle) {
      if (res.data.upload_tags) {
        res.data.uploadTags = res.data.upload_tags;
        delete res.data.upload_tags;
      }

      return { ...res.data, mimetype: res.data.type };
    }

    throw new FilestackError(`Invalid store response ${JSON.stringify(res.data)}`);
  });
};
