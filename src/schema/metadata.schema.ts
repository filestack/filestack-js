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
export const MetadataParamsSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack Metadata',
  description: 'Filestack Metadata Options',
  type: 'object',
  additionalProperties: false,
  properties: {
    size: {
      type: 'boolean',
    },
    mimetype: {
      type: 'boolean',
    },
    filename: {
      type: 'boolean',
    },
    width: {
      type: 'boolean',
    },
    metadata: {
      type: 'boolean',
    },
    height: {
      type: 'boolean',
    },
    uploaded: {
      type: 'boolean',
    },
    writeable: {
      type: 'boolean',
    },
    cloud: {
      type: 'boolean',
    },
    sourceUrl: {
      type: 'boolean',
    },
    md5: {
      type: 'boolean',
    },
    sha1: {
      type: 'boolean',
    },
    sha224: {
      type: 'boolean',
    },
    sha256: {
      type: 'boolean',
    },
    sha384: {
      type: 'boolean',
    },
    sha512: {
      type: 'boolean',
    },
    location: {
      type: 'boolean',
    },
    path: {
      type: 'boolean',
    },
    container: {
      type: 'boolean',
    },
    exif: {
      type: 'boolean',
    },
  },
};
