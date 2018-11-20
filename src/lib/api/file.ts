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
import { Security, Session } from '../client';
import { request } from './request';
import { checkOptions, removeEmpty } from '../utils';

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
    throw new Error('A valid Filestack handle is required for remove');
  }

  if (!(session.policy && session.signature) && (!security || !(security.policy && security.signature))) {
    throw new Error('Security policy and signature are required for remove');
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

  return new Promise((resolve, reject) => {
    request
      .delete(baseURL)
      .query(options)
      .end((err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
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
    throw new Error('A valid Filestack handle is required for metadata');
  }

  const allowed = [
    { name: 'size',       type: t.Boolean },
    { name: 'mimetype',   type: t.Boolean },
    { name: 'filename',   type: t.Boolean },
    { name: 'width',      type: t.Boolean },
    { name: 'height',     type: t.Boolean },
    { name: 'uploaded',   type: t.Boolean },
    { name: 'writeable',  type: t.Boolean },
    { name: 'cloud',      type: t.Boolean },
    { name: 'sourceUrl',  type: t.Boolean },
    { name: 'md5',        type: t.Boolean },
    { name: 'sha1',       type: t.Boolean },
    { name: 'sha224',     type: t.Boolean },
    { name: 'sha256',     type: t.Boolean },
    { name: 'sha384',     type: t.Boolean },
    { name: 'sha512',     type: t.Boolean },
    { name: 'location',   type: t.Boolean },
    { name: 'path',       type: t.Boolean },
    { name: 'container',  type: t.Boolean },
    { name: 'exif',       type: t.Boolean },
  ];

  checkOptions('metadata', allowed, opts);

  const options: any = { ...opts };
  options.source_url = options.sourceUrl; // source_url is snake_case
  options.policy = (security && security.policy) || session.policy;
  options.signature = (security && security.signature) || session.signature;

  const baseURL = `${session.urls.fileApiUrl}/${handle}/metadata`;
  return new Promise((resolve, reject) => {
    request
      .get(baseURL)
      .query(removeEmpty(options))
      .end((err: Error, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve({
          ...res.body,
          handle,
        });
      });
  });
};

/**
 * @private
 */
enum ERequestMethod {
  get = 'get',
  head = 'head',
}

/**
 * @private
 */
enum EResponseType {
  blob = 'blob',
  json = 'json',
}

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
export const retrieve = (session: Session,
  handle: string,
  options: RetrieveOptions = {},
  security?: Security): Promise<Object | Blob> => {
  if (!handle
    || handle.length === 0
    || typeof handle !== 'string') {

    throw new Error('File handle is required');
  }

  const allowed = [
    { name: 'metadata', type: t.Boolean },
    { name: 'head', type: t.Boolean },
    { name: 'dl', type: t.Boolean },
    { name: 'cache', type: t.Boolean },
    { name: 'extension', type: t.String },
  ];

  checkOptions('retrieveOptions', allowed, options);

  const requestOptions: any = { ...options };
  requestOptions.key = session.apikey;
  requestOptions.policy = security && security.policy || session.policy;
  requestOptions.signature = security && security.signature || session.signature;

  let method: ERequestMethod = ERequestMethod.get;
  let responseType = EResponseType.blob;

  if (requestOptions.head) {
    method = ERequestMethod.head;
    responseType = EResponseType.json;
    delete requestOptions.head;
  }

  let extension;

  if (requestOptions.extension && requestOptions.extension.length) {
    extension = requestOptions.extension;
    delete requestOptions.extension;
  }

  let metadata;
  if (requestOptions.metadata) {
    if (method === ERequestMethod.head) {
      throw new Error('Head and metadata options cannot be used together');
    }

    responseType = EResponseType.json;
    metadata = requestOptions.metadata;
    delete requestOptions.metadata;
  }

  const baseURL = `${session.urls.fileApiUrl}/${handle}` + (extension ? `+${extension}` : '') + (metadata ? '/metadata' : '');

  return new Promise((resolve, reject) => {
    request[method](baseURL)
      .query(requestOptions)
      .responseType(responseType)
      .end((err: Error, res: any) => {
        if (err) {
          return reject(err);
        }

        if (method === ERequestMethod.head) {
          return resolve(res.headers);
        }

        resolve(res.body);
      });
  });
};
