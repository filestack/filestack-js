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

import { requestWithSource, multipart } from '../request';
import { getLocationURL, getHost, getS3PartData, uploadToS3 } from './network';
import { calcMD5 } from './md5';
import { PartObj, Context } from './types';
import { throttle } from '../../utils';

/**
 * Slice a part into smaller chunks
 * @private
 * @param part  Part buffer to slice.
 * @param size  Size of slices.
 * @returns     List of chunks.
 */
export const slicePartIntoChunks = (part: PartObj, size: number): any[] => {
  let offset = 0;
  const chunks: any[] = [];
  while (offset < part.size) {
    const end = Math.min(offset + size, part.size);
    const buf = part.buffer.slice(offset, end);
    const chunk = {
      buffer: buf,
      offset,
      size: buf.byteLength,
      number: part.number,
      md5: calcMD5(buf),
    };
    chunks.push(chunk);
    offset += size;
  }
  return chunks;
};

/**
 * Get chunk (of part) metadata and PUT chunk to S3
 * @private
 * @param chunk Chunk object, has offset information
 * @param startParams Parameters returned from start call
 * @param config Upload config
 * @returns {Promise}
 */
export const uploadChunk = async (chunk: any, ctx: Context): Promise<any> => {
  const { body: s3Data } = await getS3PartData(chunk, ctx);
  let onProgress;
  if (ctx.config.onProgress) {
    /* istanbul ignore next */
    onProgress = throttle((evt: ProgressEvent) => {
      /* istanbul ignore next */
      if (evt.loaded > chunk.loaded) {
        chunk.loaded = evt.loaded;
      }
    }, ctx.config.progressInterval);
  }
  chunk.request = uploadToS3(chunk.buffer, s3Data, onProgress, ctx.config);
  await chunk.request;
  chunk.loaded = chunk.size;
  return chunk.request;
};

/**
 * Commits single part (/commit) for intelligent ingestion (only called after all chunks have been uploaded)
 * @private
 * @param file        File being uploaded
 * @param part        Part object
 * @param startParams Parameters returned from start call
 * @param config      Upload config
 * @returns {Promise}
 */
export const commitPart = (part: PartObj, ctx: Context): Promise<any> => {
  const cfg = ctx.config;
  const host = getLocationURL(ctx.params.location_url);

  const fields = {
    apikey: cfg.apikey,
    part: part.number + 1,
    size: ctx.file.size,
    ...ctx.params,
  };

  return multipart(`${host}/multipart/commit`, {
    ...fields,
    ...cfg.store,
  }, {
    timeout: cfg.timeout,
  });
};
