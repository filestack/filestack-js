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
export const StoreParamsSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack Store',
  description: 'Filestack Store Options',
  type: 'object',
  additionalProperties: false,
  properties: {
    filename: {
      oneOf: [{
        type: 'string',
      }, {
        format: 'callback',
      }],
    },
    location: {
      '$ref': 'locationsDef',
    },
    path: {
      type: 'string',
    },
    container: {
      type: 'string',
    },
    region: {
      '$ref': 'regionsDef',
    },
    access: {
      type: 'string',
      enum: ['public', 'private'],
      default: 'private',
    },
    base64decode: {
      type: 'boolean',
    },
    workflows: {
      '$ref': 'workflowsDef',
    },
    disableStorageKey: {
      type: 'boolean',
    },
    tags: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
    sanitizer: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        additionalProperties: false,
        properties: {
          exclude: {
            type: 'array',
            items: [{
              type: 'string',
            }],
          },
          replacement: {
            type: 'string',
          },
        },
      }],
    },
  },
};
