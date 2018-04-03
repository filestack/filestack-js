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

import * as bowser from 'bowser';
import * as t from 'tcomb-validation';
import { getPart, getFile, closeFile } from './file_utils';
import { getName } from './utils';
import { commitPart, slicePartIntoChunks, uploadChunk } from './intelligent';
import { start, getS3PartData, uploadToS3, complete } from './network';
import {
  Context,
  FileObj,
  PartObj,
  State,
  Status,
  UploadConfig,
  UploadOptions
} from './types';
import { checkOptions, range, throat, throttle } from '../../utils';
import { Security, Session, StoreOptions } from '../../client';

/**
 * @private
 */
const MIN_CHUNK_SIZE = 32 * 1024;

/**
 * @private
 */
const statuses = {
  INIT: Status.INIT,
  RUNNING: Status.RUNNING,
  DONE: Status.DONE,
  FAILED: Status.FAILED,
  PAUSED: Status.PAUSED,
};

/**
 * Returns a Promise based on the flow state
 * If the flow is paused it will return a Promise that resolves when resumed
 * If the flow failed it will resolve harmlessly
 *
 * @private
 * @param func  function that returns a Promise
 */
const flowControl = (ctx: Context, func: any) => {
  return (...args: any[]) => {
    if (ctx.state.status === statuses.FAILED) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const check = () => {
        if (ctx.state.status === statuses.PAUSED) {
          setTimeout(() => check(), 100);
        } else {
          resolve(func(...args));
        }
      };
      check();
    });
  };
};

/**
 *
 * @private
 * @param num
 * @param ctx
 */
const makePart = (num: number, ctx: Context): PartObj => {
  return {
    buffer: null,
    chunks: [],
    chunkSize: ctx.config.intelligentChunkSize
      ? ctx.config.intelligentChunkSize
      : bowser.mobile
      ? 1 * 1024 * 1024
      : 8 * 1024 * 1024,
    intelligentOverride: false,
    loaded: 0,
    number: num,
    request: null,
    size: 0,
  };
};

/**
 *
 * @private
 * @param part
 * @param ctx
 */
const uploadPart = async (part: PartObj, ctx: Context): Promise<any> => {
  const cfg = ctx.config;
  // Intelligent flow commits a part only when all chunks have been uploaded
  if (cfg.intelligent === true || part.intelligentOverride) {
    const goChunk = flowControl(ctx, (chunk: any) => uploadChunk(chunk, ctx));
    part.chunks = slicePartIntoChunks(part, part.chunkSize);
    await Promise.all(part.chunks.map(throat(cfg.concurrency, goChunk)));
    return commitPart(part, ctx);
  }

  // Or we upload the whole part (default flow)
  const { body: s3Data } = await getS3PartData(part, ctx);
  let onProgress;
  if (cfg.onProgress) {
    /* istanbul ignore next */
    onProgress = throttle((evt: ProgressEvent) => {
      /* istanbul ignore next */
      if (evt.loaded > part.loaded) {
        part.loaded = evt.loaded;
      }
    }, cfg.progressInterval);
  }
  part.request = uploadToS3(part.buffer, s3Data, onProgress, cfg);
  return part.request;
};

/**
 * Clean up array buffers in memory
 * Because promises aren't streams
 * @private
 */
const gc = (part: PartObj) => {
  part.buffer = undefined;
  part.request = undefined;
  if (part.chunks && part.chunks.length) {
    part.chunks.forEach(gc);
  }
};

/**
 * Helpers to calculate total progress of file upload in bytes and percent
 * @private
 */
const sumBytes = (bytes: number[]) => bytes.reduce((a, b) => a + b, 0);
/**
 *
 * @private
 * @param bytes
 * @param file
 */
const percentOfFile = (bytes: number, file: FileObj) => Math.round((bytes / file.size) * 100);

/**
 *
 * @private
 * @param param0
 */
const getProgress = ({ config, state, file }: Context) => {
  const parts = Object.keys(state.parts).map((k: string) => state.parts[k]);
  const partsLoaded = parts.map((p: PartObj) => p.loaded);
  const chunksLoaded = parts
    .map((p: PartObj) => p.chunks)
    .reduce((a: any[], b: any[]) => a.concat(b), [])
    .map((c: any) => c.loaded)
    .filter((n: any) => n);
  let loaded = partsLoaded;
  if (config.intelligent === true) {
    loaded = chunksLoaded;
  }
  if (config.intelligent === 'fallback') {
    const partsWithoutChunks = parts
      .filter((p: PartObj) => !p.intelligentOverride)
      .map((p: PartObj) => p.loaded);
    loaded = partsWithoutChunks.concat(chunksLoaded);
  }
  const totalBytes = sumBytes(loaded);
  const totalPercent = percentOfFile(totalBytes, file);
  const payload = {
    totalBytes,
    totalPercent,
  };
  const prev = state.previousPayload || {};
  /* istanbul ignore next */
  if (totalPercent < prev.totalPercent) {
    payload.totalBytes = prev.totalBytes;
    payload.totalPercent = prev.totalPercent;
  }
  state.previousPayload = payload;
  return payload;
};

/**
 * Entry point for multi-part upload flow
 *
 * @private
 * @param file    File to upload
 * @param config  Upload config
 * @param token   Control token
 */
const uploadFile = async (ctx: Context, token: any): Promise<any> => {
  const { file, state, config } = ctx;

  const startProgress = (onProgress?: any): void => {
    if (onProgress) {
      state.progressTick = setInterval(() => {
        const payload = getProgress(ctx);
        if (payload.totalPercent === 100) {
          clearInterval(state.progressTick);
        }
        onProgress(payload);
      }, config.progressInterval);
    }
  };

  const finishProgress = (onProgress?: any): void => {
    if (onProgress) {
      onProgress({
        totalBytes: file.size,
        totalPercent: 100,
      });
      clearInterval(state.progressTick);
    }
  };

  /**
   * Will pause progress tick and set state
   */
  token.pause = (): void => {
    if (state.status === statuses.RUNNING) {
      state.status = statuses.PAUSED;
      clearInterval(state.progressTick);
    }
  };

  /**
   * Will resume flow and start progress tick again
   */
  token.resume = (): void  => {
    if (state.status === statuses.PAUSED) {
      state.status = statuses.RUNNING;
      startProgress(config.onProgress);
    }
  };

  /**
   * Iterate over all parts and abort their requests
   * @private
   */
  const cancelAllRequests = (): void  => {
    const parts = Object.keys(state.parts).map(k => state.parts[k]);
    parts.forEach((part: any) => {
      if (part.request) part.request.abort();
      part.chunks.forEach((chunk: any) => {
        if (chunk.request) chunk.request.abort();
      });
      gc(part);
    });
  };

  /**
   * Set failure status, clean up
   * @private
   */
  const failAndCleanUp = (): void  => {
    cancelAllRequests();
    clearInterval(state.progressTick);
    state.status = statuses.FAILED;
    if (file.fd) {
      closeFile(file.fd);
    }
  };

  const cancel = new Promise((_, reject) => {
    token.cancel = (): void  => {
      if (state.status === statuses.RUNNING || state.status === statuses.PAUSED) {
        failAndCleanUp();
        reject(new Error('Upload cancelled'));
      }
    };
  });

  const cancellable = (p: Promise<any>): Promise<any> => {
    return Promise.race([cancel, p]);
  };

  /**
   * Retries a function up to the retry limit. For intelligent ingestion it halves chunk size before retrying part
   * @private
   * @param location    A name for the function being retried
   * @param func        The function to retry
   * @param err         An Error whose message will be used if the retry limit is met.
   * @param part        Part object for FII retries (each part tracks its own chunkSize)
   * @returns           {Promise}
   */
  const retry = (location: string, func: any, err: any, part?: PartObj): Promise<any> => {
    let attempt = state.retries[location] || 0;
    const waitTime = Math.min(config.retryMaxTime, (config.retryFactor ** attempt) * 1000);
    const promise = new Promise((resolve, reject) => {
      if (attempt === config.retry
        || (err.status === 400 && err.method !== 'PUT')
        || err.status === 401
        || err.status === 403
        || err.status === 404
        || part && part.chunkSize <= MIN_CHUNK_SIZE
      ) {
        failAndCleanUp();
        return reject(err);
      }
      const exec = () => setTimeout(() => resolve(func()), waitTime);
      // FII S3 retry (resize chunk)
      if (part && (config.intelligent || part.intelligentOverride) && (
        // Browser S3 network error
        (err.method === 'PUT' && (err.crossDomain || err.status === 400 || err.timeout))
        // Node S3 network error
        || (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')
      )) {
        part.chunkSize /= 2;
        if (config.onRetry) {
          config.onRetry({
            location,
            parts: state.parts,
            filename: getName(file, config),
            chunkSize: part.chunkSize,
            attempt: undefined,
          });
        }
        if (config.intelligent === 'fallback') {
          part.intelligentOverride = true;
        }
        return exec();
      }
      // Normal retry (with retry limit)
      attempt += 1;
      state.retries[location] = attempt;
      if (config.onRetry) {
        config.onRetry({
          location,
          parts: state.parts,
          filename: getName(file, config),
          attempt,
        });
      }
      return exec();
    });
    return cancellable(promise);
  };

  // Here we go
  state.status = statuses.RUNNING;

  const { body: params } = await cancellable(start(ctx));
  ctx.params = params;

  const goPart = flowControl(ctx, async (partObj: PartObj) => {
    const part = await getPart(partObj, ctx);
    if (part.size === 0) {
      return Promise.reject(new Error('Upload aborted due to empty chunk.'));
    }
    const location = `upload part ${part.number + 1}`;
    state.parts[part.number] = part;
    try {
      const { headers: { etag }, status } = await uploadPart(part, ctx);
      if (status === 206) {
        const err = new Error('Intelligent part failed to commit');
        return retry(location, () => goPart(part), err, part);
      }
      part.loaded = part.size;
      gc(part);
      if (!config.intelligent && !etag) {
        return Promise.reject(new Error('Response from S3 is missing ETag header.'));
      }
      return etag;
    } catch (err) {
      return retry(location, () => goPart(part), err, part);
    }
  });

  const totalParts = Math.ceil(file.size / config.partSize);
  const allParts = range(0, totalParts).map((p: any) => makePart(p, ctx));
  const partsFlow = Promise.all(allParts.map(throat(config.concurrency, goPart)));
  startProgress(config.onProgress);
  const etags = await cancellable(partsFlow);

  const goComplete = flowControl(ctx, async () => {
    try {
      const res = await complete(etags, ctx);
      if (res.status === 202) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(goComplete()), 1000);
        });
      }

      state.status = statuses.DONE;
      finishProgress(config.onProgress);
      if (file.fd) {
        closeFile(file.fd);
      }

      if (res.body && res.body.error && res.body.error.text) {
        return Promise.reject(new Error(`File upload error: ${res.body.error.text}`));
      }

      return res.body;
    } catch (err) {
      return retry('complete', goComplete, err);
    }
  });
  return cancellable(goComplete());
};

/**
 * User facing method to upload a single file
 * @private
 * @param session Session object that contains apikey
 * @param file A valid file path (in Node). In browsers a File, Blob, or base64 encoded string
 * @param options Configures the uploader
 * @param storeOptions Storage options for the backend
 * @param token Control token
 */
export const upload = (
  session: Session,
  fileOrString: any,
  options: UploadOptions = {},
  storeOptions: StoreOptions = {},
  token: any = {},
  security?: Security
): Promise<any> => {
  return getFile(fileOrString).then((file: any) => {
    if ((file.size !== undefined && file.size === 0) || file.length === 0) {
      return Promise.reject(new Error('file has a size of 0.'));
    }
    const allowedOptions = [
      { name: 'host', type: t.String },
      { name: 'path', type: t.Boolean },
      { name: 'mimetype', type: t.String },
      { name: 'partSize', type: t.Number },
      { name: 'concurrency', type: t.refinement(t.Integer, n => n > 0) },
      { name: 'onProgress', type: t.Function },
      { name: 'progressInterval', type: t.Integer },
      { name: 'onRetry', type: t.Function },
      { name: 'retry', type: t.Integer },
      { name: 'retryFactor', type: t.Integer },
      { name: 'retryMaxTime', type: t.Integer },
      { name: 'timeout', type: t.Integer },
      { name: 'intelligent', type: t.union([t.Boolean, t.enums.of('fallback')]) },
      { name: 'intelligentChunkSize', type: t.Number },
    ];
    const allowedStoreOptions = [
      { name: 'location', type: t.enums.of('s3 gcs rackspace azure dropbox') },
      { name: 'region', type: t.String },
      { name: 'path', type: t.String },
      { name: 'container', type: t.String },
      { name: 'filename', type: t.String },
      { name: 'access', type: t.enums.of('public private') },
    ];

    // Throw if any options are invalid
    checkOptions('upload (options)', allowedOptions, options);
    checkOptions('upload (storeOptions)', allowedStoreOptions, storeOptions);

    // Custom filename option
    const storeOpts = { ...storeOptions };
    const opts = { ...options };
    let customName;
    if (storeOpts.filename) {
      customName = storeOpts.filename;
    } else if (file.name === undefined) {
      // Blobs don't have names, Files do. Give a placeholder name for blobs.
      if (file.type) {
        const ext = file.type.split('/').pop();
        customName = `untitled.${ext}`;
      } else {
        customName = 'untitled';
      }
    }
    // Default location param
    if (storeOpts.location === undefined) {
      storeOpts.location = 's3';
    }

    // Intelligent Ingestion requires part size of exactly 8MB
    if (opts.intelligent) {
      opts.partSize = 8 * 1024 * 1024;
    }

    // Set security if on session or override
    const policy = security && security.policy || session.policy;
    const signature = security && security.signature || session.signature;

    // Configurables
    const config: UploadConfig = {
      host: session.urls.uploadApiUrl,
      apikey: session.apikey,
      policy,
      signature,
      partSize: 6 * 1024 * 1024,
      concurrency: 3,
      progressInterval: 1000,
      retry: 10,
      retryFactor: 2,
      retryMaxTime: 15000,
      customName,
      mimetype: options.mimetype,
      store: {
        store_location: storeOpts.location,
        store_region: storeOpts.region,
        store_container: storeOpts.container,
        store_path: storeOpts.path,
        store_access: storeOpts.access,
      },
      timeout: 120000,
      ...opts,
    };

    const initialState: State = {
      parts: {},
      progressTick: null,
      previousPayload: null,
      retries: {},
      status: statuses.INIT,
    };

    const context: Context = {
      file,
      config,
      state: initialState,
    };

    return uploadFile(context, token);
  });
};
