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

import { request, multipart } from '../request';
import { getName } from './utils';
import { Context, PartObj, UploadConfig } from './types';

/**
 * @private
 */
/* istanbul ignore next */
export const getLocationURL = (url: string) => {
  return url && `https://${url}`;
};

/**
 * Starts the multi-part upload flow (/multipart/start)
 * @private
 * @param file    Valid File instance
 * @param config  Upload config
 * @returns {Promise}
 */
export const start = ({ config, file }: Context): Promise<any> => {
  const fields: any = {
    apikey: config.apikey,
    filename: getName(file, config),
    mimetype: config.mimetype || file.type || 'application/octet-stream',
    size: file.size,
  };
  // Security
  if (config.policy && config.signature) {
    fields.policy = config.policy;
    fields.signature = config.signature;
  }
  // Intelligent Ingestion
  if (config.intelligent) {
    fields.multipart = true;
  }

  return multipart(`${config.host}/multipart/start`, {
    ...fields,
    ...config.store,
  }, {
    timeout: config.timeout,
  });
};

/**
 * Gets the S3 upload params for current part (/multipart/upload)
 * @private
 * @param startParams   Parameters returned from start call
 * @param partNumber    Current part number (1 - 10000)
 * @param size          Size of current part in bytes
 * @param md5           MD5 hash of part
 * @param config        Upload config
 * @param offset        Current offset if chunking a part.
 */
export const getS3PartData = (part: PartObj, { config, params }: Context): Promise<any> => {
  const host = getLocationURL(params.location_url);
  const locationRegion = params.location_region;

  const fields = {
    apikey: config.apikey,
    part: part.number + 1,
    size: part.size,
    md5: part.md5,
    ...params,
  };

  // Intelligent Ingestion
  if (part.offset !== undefined) {
    fields.multipart = true;
    fields.offset = part.offset;
  }

  let headers = {};

  if (locationRegion) {
    // set headers for filestack upload region to be respected in cdn when using cnames
    headers['Filestack-Upload-Region'] = locationRegion;
  }

  return multipart(`${host}/multipart/upload`, {
    ...fields,
    ...config.store,
  }, {
    headers,
    timeout: config.timeout,
  });
};

/**
 * Uploads bytes directly to S3 with HTTP PUT
 * @private
 * @param part        ArrayBuffer with part data
 * @param params      Params for this part returned by getS3PartData response
 * @param onProgress  A function to be called on progress event for this part
 * @param config
 */
export const uploadToS3 = (part: ArrayBuffer, params: any, onUploadProgress: any, cfg: UploadConfig): Promise<any> => {
  const host = params.url;
  const timeout = cfg.timeout || Math.max(part.byteLength / 100, 1000);

  return request
    .put(host, part, {
      headers: params.headers,
      timeout,
      onUploadProgress,
    });
};

/**
 * Convert array of Etags into format for /multipart/complete call
 * @private
 * @param etags     Array of Etag strings
 */
const formatETags = (etags: string[]): string => etags.map((tag: string, idx: number) => `${idx + 1}:${tag}`).join(';');

/**
 * Completes upload flow (/multipart/complete)
 * @private
 * @param file          File being uploaded
 * @param etags         An array of etags from each S3 part
 * @param startParams   Parameters returned from start call
 * @param config        Upload config
 */
export const complete = (etags: string[], { config, file, params }: Context): Promise<any> => {
  const host = getLocationURL(params.location_url);
  const locationRegion = params.location_region;

  const fields = {
    apikey: config.apikey,
    size: file.size,
    filename: getName(file, config),
    mimetype: config.mimetype || file.type || 'application/octet-stream',
    parts: formatETags(etags),
    ...params,
  };

  // Intelligent Ingestion
  if (config.intelligent) {
    fields.multipart = true;
    delete fields.parts;
  }

  // Security
  if (config.policy && config.signature) {
    fields.policy = config.policy;
    fields.signature = config.signature;
  }

  let headers = {};

  if (locationRegion) {
    // set headers for filestack upload region to be respected in cdn when using cnames
    headers['Filestack-Upload-Region'] = locationRegion;
  }

  return multipart(`${host}/multipart/complete`, {
    ...fields,
    ...config.store,
  }, {
    headers,
    timeout: config.timeout,
  });
};
