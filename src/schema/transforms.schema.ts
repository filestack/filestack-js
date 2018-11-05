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

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack Transformations',
  description: 'Filestack transformations parameters',
  type: 'object',
  definitions: {
    colorDef: {
      type: 'string',
      pattern: '^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    },
    facesDef: {
      oneOf: [{
        type: 'string',
        enum: 'all',
      }, {
        type: 'number',
        minimum: 1,
        maximum: 1000,
      }, {
        type: 'array',
        uniqueItems: true,
        items: [{
          type: 'integer',
          minimum: 1,
          maximum: 1000,
        }],
      }],
    },
    objectsDef: {
      type: 'array',
      minItems: 1,
      maxItems: 50,
      items: [{
        type: 'array',
        additionalItems: false,
        minItems: 4,
        maxItems: 4,
        items: [{
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        }, {
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        }, {
          type: 'integer',
          minimum: 1,
          maximum: 10000,
        }, {
          type: 'integer',
          minimum: 1,
          maximum: 10000,
        }],
      }],
    },
    positionDef: {
      oneOf: [
        {
          type: 'string',
          enum: [
            'top',
            'middle',
            'bottom',
            'left',
            'center',
            'right',
          ],
        },
        {
          type: 'array',
          uniqueItems: true,
          additionalItems: false,
          minItems: 2,
          maxItems: 2,
          items: [
            {
              type: 'string',
              enum: [
                'top',
                'middle',
                'bottom',
              ],
            }, {
              type: 'string',
              enum: [
                'left',
                'center',
                'right',
              ],
            },
          ],
        },
      ],
    },
  },
  properties: {
    flip: {
      type: 'boolean',
      additionalProperties: false,
    },
    compress: {
      type: 'boolean',
      additionalProperties: false,
    },
    flop: {
      type: 'boolean',
      additionalProperties: false,
    },
    enchance: {
      type: 'boolean',
      additionalProperties: false,
    },
    redeye: {
      type: 'boolean',
      additionalProperties: false,
    },
    monochrome: {
      type: 'boolean',
      additionalProperties: false,
    },
    negative: {
      type: 'boolean',
      additionalProperties: false,
    },
    tags: {
      type: 'boolean',
      additionalProperties: false,
    },
    sfw: {
      type: 'boolean',
      additionalProperties: false,
    },
    imagesize: {
      type: 'boolean',
      additionalProperties: false,
    },
    metadata: {
      type: 'object',
      params: {
        type: 'array',
        items: {
          type: 'string',
          'enum': [
            'filename',
            'mimetype',
            'size',
            'width',
            'height',
            'writeable',
            'path',
            'container',
            'cloud',
            'exif',
            'source_url',
            'md5',
            'sha256',
            'sha1',
            'sha512',
          ],
        },
        minItems: 0,
        uniqueItems: true,
        additionalItems: false,
      },
      additionalProperties: false,
    },
    resize: {
      type: 'object',
      properties: {
        width: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        height: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        fit: {
          type: 'string',
          enum: ['clip', 'crop', 'scale' ,'max'],
        },
        align: {
          $ref: '#/definitions/positionDef',
        },
      },
      // required: ['width', 'height'],
      additionalProperties: false,
      anyOf: [
        { required: ['width'] },
        { required: ['height'] },
      ],
    },
    crop: {
      type: 'object',
      properties: {
        dim: {
          $ref: '#/definitions/objectsDef',
        },
      },
      required: ['dim'],
    },
    rotate: {
      type: 'object',
      properties: {
        deg: {
          oneOf: [{
            type: 'string',
            num: ['exif'],
          }, {
            type: 'number',
            minimum: 0,
            maximum: 359,
          }],
        },
        exif: {
          type: 'boolean',
        },
        background: {
          $ref: '#/definitions/colorDef',
        },
      },
      additionalProperties: false,
    },
    detect_faces: {
      type: 'object',
      properties: {
        maxsize: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        minsize: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        export: {
          type: 'boolean',
        },
        color: {
          $ref: '#/definitions/colorDef',
        },
      },
      additionalProperties: false,
    },
    crop_faces: {
      type: 'object',
      properties: {
        faces: {

        },
        width: {
          type: 'number',
          minimum: 1,
          maximum: 10000,
        },
        height: {
          type: 'number',
          minimum: 1,
          maximum: 10000,
        },
        maxsize: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        minsize: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        buffer: {
          type: 'number',
          minimum: 0,
          maximum: 10000,
        },
        mode: {
          type: 'string',
          enum: ['crop', 'thumb', 'fill'],
        },
      },
      additionalProperties: false,
    },
    watermark: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
        },
        size: {
          type: 'number',
          minimum: 0,
          maximum: 500,
        },
        position: {
          $ref: '#/definitions/positionDef',
        },
      },
      required: [
        'file',
      ],
      additionalProperties: false,
    },
    partial_blur: {
      type: 'object',
      properties: {
        objects: {
          $ref: '#/definitions/objectsDef',
        },
        amount: {
          type: 'number',
          minimum: 0,
          maximum: 20,
        },
        blur: {
          type: 'number',
          minimum: 0,
          maximum: 20,
        },
        type: {
          type: 'string',
          enum: ['rect', 'oval'],
        },
      },
    },
    partial_pixelate: {
      type: 'object',
      properties: {
        objects: {
          $ref: '#/definitions/objectsDef',
        },
        amount: {
          type: 'number',
          minimum: 2,
          maximum: 100,
        },
        blur: {
          type: 'number',
          minimum: 0,
          maximum: 20,
        },
        type: {
          type: 'string',
          enum: ['rect', 'oval'],
        },
      },
    },
  },
};
