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
export const UploadParamsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack Upload',
  description: 'Filestack Upload Options',
  type: 'object',
  additionalProperties: false,
  properties: {
    partSize: {
      type: 'integer',
      minimum: 5 * 1024 * 1024,
    },
    concurrency: {
      type: 'integer',
      minimum: 1,
      maximum: 20,
    },
    progressInterval: {
      type: 'integer',
      minimum: 1,
    },
    retry: {
      type: 'integer',
      minimum: 0,
      maximum: 20,
    },
    retryFactor: {
      type: 'integer',
    },
    retryMaxTime: {
      type: 'integer',
    },
    timeout: {
      type: 'integer',
      minimum: 1,
      maximum: 60 * 60 * 1000,
    },
    intelligent: {
      oneOf: [
        {
          type: 'boolean',
        },
        {
          type: 'string',
          enum: ['fallback'],
        },
      ],
    },
    intelligentChunkSize: {
      type: 'integer',
    },
    onProgress: {
      format: 'callback',
    },
    onRetry: {
      format: 'callback',
    },
    disableIntegrityCheck: {
      type: 'boolean',
    },
    tags: {
      type: 'object',
      maxItems: 10,
      additionalProperties: {
        type: 'string',
        maxlength: 256,
      },
    },
  },
};
