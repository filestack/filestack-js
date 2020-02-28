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
import { removeEmpty } from '../utils';
import { FilestackError } from './../../filestack_error';
import { getValidator, MetadataParamsSchema, RetrieveParamsSchema } from './../../schema';
import { FsRequest, FsHttpMethod } from '../request';

/**
 * Remove given file
 *
 * @private
 * @param session
 * @param handle
 * @param security
 */
export const remove = (session: Session, handle?: string, skipStorage?: boolean, security?: Security): Promise<any> => {
  if (!handle || typeof handle !== 'string') {
    throw new FilestackError('A valid Filestack handle is required for remove');
  }

  if (!(session.policy && session.signature) && (!security || !(security.policy && security.signature))) {
    throw new FilestackError('Security policy and signature are required for remove');
  }

  const fileApiUrl = session.urls.fileApiUrl;
  const baseURL = `${fileApiUrl}/${handle}`;
  const options: any = {
    key: session.apikey,
    policy: (security && security.policy) || session.policy,
    signature: (security && security.signature) || session.signature,
  };

  if (skipStorage) {
    options.skip_storage = true;
  }

  return FsRequest.delete(baseURL, {
    filestackHeaders: false,
    params: removeEmpty(options),
  });
};

export interface MetadataOptions {
  size?: boolean;
  mimetype?: boolean;
  filename?: boolean;
  width?: boolean;
  height?: boolean;
  uploaded?: boolean;
  writeable?: boolean;
  cloud?: boolean;
  sourceUrl?: boolean;
  md5?: boolean;
  sha1?: boolean;
  sha224?: boolean;
  sha256?: boolean;
  sha384?: boolean;
  sha512?: boolean;
  location?: boolean;
  path?: boolean;
  container?: boolean;
  exif?: boolean;
}

/**
 * Returns file metadata
 *
 * @private
 * @param session
 * @param handle
 * @param opts
 * @param security
 */
export const metadata = (session: Session, handle?: string, opts?: MetadataOptions, security?: Security): Promise<any> => {
  if (!handle || typeof handle !== 'string') {
    throw new FilestackError('A valid Filestack handle is required for metadata');
  }

  const validateRes = getValidator(MetadataParamsSchema)(opts);

  if (validateRes.errors.length) {
    throw new FilestackError(`Invalid metadata params`, validateRes.errors);
  }

  const options: any = { ...opts };
  options.source_url = options.sourceUrl; // source_url is snake_case
  options.policy = (security && security.policy) || session.policy;
  options.signature = (security && security.signature) || session.signature;

  const baseURL = `${session.urls.fileApiUrl}/${handle}/metadata`;
  return new Promise((resolve, reject) => {
    FsRequest.get(baseURL, { params: removeEmpty(options), filestackHeaders: false, })
      .then(res => resolve({ ...res.data, handle }))
      .catch(reject);
  });
};

export interface RetrieveOptions {
  metadata?: boolean;
  head?: boolean;
  dl?: boolean;
  extension?: string;
  cache?: boolean;
}

/**
 * Returns file information
 *
 * @private
 * @param session
 * @param handle
 * @param options
 * @param security
 */
export const retrieve = (session: Session, handle: string, options: RetrieveOptions = {}, security?: Security): Promise<Object | Blob> => {
  if (!handle || handle.length === 0 || typeof handle !== 'string') {
    throw new FilestackError('File handle is required');
  }

  const validateRes = getValidator(RetrieveParamsSchema)(options);

  if (validateRes.errors.length) {
    throw new FilestackError(`Invalid retrieve params`, validateRes.errors);
  }

  const requestOptions: any = { ...options };
  requestOptions.key = session.apikey;
  requestOptions.policy = (security && security.policy) || session.policy;
  requestOptions.signature = (security && security.signature) || session.signature;

  let method: FsHttpMethod = FsHttpMethod.GET;

  if (requestOptions.head) {
    method = FsHttpMethod.HEAD;
    delete requestOptions.head;
  }

  let extension;

  if (requestOptions.extension && requestOptions.extension.length) {
    extension = requestOptions.extension;
    delete requestOptions.extension;
  }

  let metadata;
  if (requestOptions.metadata) {
    if (method === FsHttpMethod.HEAD) {
      throw new FilestackError('Head and metadata options cannot be used together');
    }

    metadata = requestOptions.metadata;
    delete requestOptions.metadata;
  }

  const baseURL = `${session.urls.fileApiUrl}/${handle}` + (extension ? `+${extension}` : '') + (metadata ? '/metadata' : '');

  return new Promise((resolve, reject) => {
    FsRequest.dispatch(baseURL, {
      method,
      filestackHeaders: false,
      params: removeEmpty(requestOptions),
    })
      .then(res => resolve(method === FsHttpMethod.HEAD ? res.headers : res.data))
      .catch(reject);
  });
};
