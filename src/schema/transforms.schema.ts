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
export const TransformSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'https://filestack.com/schemas/transforms.json',
  title: 'Filestack Transformations',
  description: 'Filestack transformations parameters',
  type: 'object',
  additionalProperties: false,
  definitions: {
    facesDef: {
      '$id': '#facesDef',
      oneOf: [{
        type: 'string',
        enum: ['all'],
      }, {
        type: 'integer',
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
      '$id': '#objectsDef',
      type: 'array',
      minItems: 1,
      maxItems: 50,
      items: [{
        type: 'array',
        additionalItems: false,
        minItems: 4,
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
      '$id': '#positionDef',
      default: ['middle', 'center'],
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
          default: ['middle', 'center'],
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
    no_metadata: {
      type: 'boolean',
      additionalProperties: false,
    },
    compress: {
      additionalProperties: false,
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          metadata: {
            type: 'boolean',
            default: false,
          },
        },
      }],
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
          default: 'clip',
        },
        align: {
          '$ref': '#positionDef',
          default: 'center',
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
          type: 'array',
          additionalItems: false,
          minItems: 4,
          items: [{
            type: 'integer',
            minimum: 0,
            maximum: 100000,
          }, {
            type: 'integer',
            minimum: 0,
            maximum: 100000,
          }, {
            type: 'integer',
            minimum: 1,
            maximum: 100000,
          }, {
            type: 'integer',
            minimum: 1,
            maximum: 100000,
          }],
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
          '$ref': 'defs.json#/definitions/colorDef',
          default: 'FFFFFFFF',
        },
      },
      additionalProperties: false,
    },
    detect_faces: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          maxsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          minsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          export: {
            type: 'boolean',
          },
          color: {
            '$ref': 'defs.json#/definitions/colorDef',
            default: '000000FF',
          },
        },
        additionalProperties: false,
      }],
    },
    crop_faces: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          faces: {
            default: 1,
            '$ref': '#facesDef',
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
            default: 0.35,
          },
          minsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          buffer: {
            type: 'integer',
            minimum: 0,
            maximum: 10000,
          },
          mode: {
            type: 'string',
            enum: ['crop', 'thumb', 'fill'],
            default: 'thumb',
          },
        },
        additionalProperties: false,
      }],
    },
    pixelate_faces: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          faces: {
            '$ref': '#facesDef',
            default: 'all',
          },
          maxsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          minsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          buffer: {
            type: 'integer',
            minimum: 0,
            maximum: 10000,
          },
          amount: {
            type: 'integer',
            minimum: 2,
            maximum: 100,
            default: 10,
          },
          blur: {
            type: 'number',
            minimum: 0,
            maximum: 20,
            default: 4,
          },
          type: {
            type: 'string',
            enum: ['rect', 'oval'],
            default: 'rect',
          },
        },
        additionalProperties: false,
      }],
    },
    blur_faces: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          faces: {
            '$ref': '#facesDef',
            default: 'all',
          },
          maxsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          minsize: {
            type: 'number',
            minimum: 0,
            maximum: 10000,
            default: 0.35,
          },
          buffer: {
            type: 'integer',
            minimum: 0,
            maximum: 10000,
          },
          amount: {
            type: 'number',
            minimum: 0,
            maximum: 10,
            default: 10,
          },
          blur: {
            type: 'number',
            minimum: 0,
            maximum: 20,
            default: 4,
          },
          type: {
            type: 'string',
            enum: ['rect', 'oval'],
            default: 'rect',
          },
        },
        additionalProperties: false,
      }],
    },
    rounded_corners: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          radius: {
            oneOf: [{
              type: 'integer',
              minimum: 1,
              maximum: 10000,
            }, {
              type: 'string',
              enum: ['max'],
            }],
          },
          blur: {
            type: 'number',
            minimum: 0,
            maximum: 20,
            default: 0.3,
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    vignette: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            default: 20,
          },
          blurmode: {
            type: 'string',
            enum: ['gaussian', 'linear'],
            default: 'gaussian',
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    polaroid: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          rotate: {
            type: 'integer',
            minimum: 0,
            maximum: 359,
          },
          color: {
            '$ref': 'defs.json#/definitions/colorDef',
            default: 'snow',
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    torn_edges: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          spread: {
            type: 'array',
            additionalItems: false,
            minItems: 2,
            items: [{
              type: 'integer',
              minimum: 1,
              maximum: 10000,
              default: 1,
            }, {
              type: 'integer',
              minimum: 1,
              maximum: 10000,
              default: 10,
            }],
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    shadow: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          blur: {
            type: 'number',
            minimum: 0,
            maximum: 20,
            default: 100,
          },
          opacity: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            default: 60,
          },
          vector: {
            type: 'array',
            additionalItems: false,
            minItems: 2,
            items: [{
              type: 'integer',
              minimum: -1000,
              maximum: 1000,
              default: 4,
            }, {
              type: 'integer',
              minimum: -1000,
              maximum: 1000,
              default: 4,
            }],
          },
          color: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    circle: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
        },
        additionalProperties: false,
      }],
    },
    border: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          color: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
          },
          width: {
            type: 'integer',
            minimum: 0,
            maximum: 1000,
          },
        },
        additionalProperties: false,
      }],
    },
    sharpen: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 20,
            default: 2,
          },
        },
        additionalProperties: false,
      }],
    },
    blur: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            minimum: 0,
            maximum: 20,
            default: 2,
          },
        },
        additionalProperties: false,
      }],
    },
    blackwhite: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          threshold: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            default: 50,
          },
        },
        additionalProperties: false,
      }],
    },
    sepia: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          tone: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            default: 80,
          },
        },
        additionalProperties: false,
      }],
    },
    pixelate: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            minimum: 2,
            maximum: 100,
            default: 2,
          },
        },
        additionalProperties: false,
      }],
    },
    oil_paint: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            minimum: 2,
            maximum: 100,
            default: 2,
          },
        },
        additionalProperties: false,
      }],
    },
    modulate: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          brightness: {
            type: 'integer',
            minimum: 0,
            maximum: 10000,
            default: 100,
          },
          saturation: {
            type: 'integer',
            minimum: 0,
            maximum: 10000,
            default: 100,
          },
          hue: {
            type: 'integer',
            minimum: 0,
            maximum: 359,
            default: 0,
          },
        },
        additionalProperties: false,
      }],
    },
    asci: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          foreground: {
            '$ref': 'defs.json#/definitions/colorDef',
            default: '000000FF',
          },
          background: {
            '$ref': 'defs.json#/definitions/colorDef',
            default: 'FFFFFFFF',
          },
          colored: {
            type: 'boolean',
            default: false,
          },
          size: {
            type: 'integer',
            minimum: 10,
            maximum: 100,
            default: 100,
          },
          reverse: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      }],
    },
    collage: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          additionalItems: false,
          minItems: 1,
          items: [{
            type: 'string',
          }],
        },
        margin: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        width: {
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
        height: {
          type: 'integer',
          minimum: 0,
          maximum: 10000,
        },
        color: {
          '$ref': 'defs.json#/definitions/colorDef',
          default: 'FFFFFFFF',
        },
        fit: {
          type: 'string',
          enum: ['auto', 'crop'],
        },
        autorotate: {
          type: 'boolean',
          default: false,
        },
      },
      required: ['width', 'height', 'files'],
      additionalProperties: false,
    },
    urlscreenshot: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          agent: {
            type : 'string',
            enum: ['desktop', 'mobile'],
            default: 'desktop',
          },
          width: {
            type: 'integer',
            minimum: 1,
            maximum: 1920,
            default: 1024,
          },
          height: {
            type: 'integer',
            minimum: 1,
            maximum: 8000,
            default: 768,
          },
          mode: {
            type: 'string',
            enum: ['all', 'window'],
            default: 'all',
          },
          delay: {
            type: 'integer',
            minimum: 0,
            maximum: 20000,
            default: 1000,
          },
          orientation: {
            type: 'string',
            enum: ['portrait', 'landscape'],
            default: 'portrait',
          },
          device: {
            type: 'string',
            default: '',
          },
        },
        additionalProperties: false,
      }],
    },
    upscale: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          noise: {
            type: 'string',
            enum: ['none', 'low', 'medium', 'high'],
            default: 'none',
          },
          upscale: {
            type: 'boolean',
            default: true,
          },
          style: {
            type: 'string',
            enum: ['artwork', 'photo'],
            default: 'photo',
          },
        },
        additionalProperties: false,
      }],
    },
    output: {
      type: 'object',
      additionalProperties: false,
      properties: {
        format: {
          type: 'string',
          enum: ['doc', 'docx', 'html', 'jpg', 'odp', 'ods', 'odt', 'pjpg', 'pdf', 'png', 'ppt', 'pptx', 'svg', 'txt', 'webp', 'xls', 'xlsx'],
        },
        page: {
          type: 'integer',
          minimum: 1,
          maximum: 99999,
        },
        density: {
          type: 'integer',
          minimum: 1,
          maximum: 500,
        },
        compress: {
          type: 'boolean',
        },
        quality: {
          oneOf: [{
            type: 'string',
            enum: ['input'],
          }, {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 95,
          }],
        },
        secure: {
          type: 'boolean',
          default: false,
        },
        docinfo: {
          type: 'boolean',
          default: false,
        },
        strip: {
          type: 'boolean',
          default: false,
        },
        colorspace: {
          type: 'string',
          enum: ['rgb', 'cmyk', 'input'],
          default: 'rgb',
        },
        background: {
          '$ref': 'defs.json#/definitions/colorDef',
        },
        pageformat: {
          type: 'string',
          enum: ['a3', 'a4', 'a5', 'b4', 'b5', 'letter', 'legal', 'tabloid'],
        },
        pageorientation: {
          type: 'string',
          enum: ['landscape', 'portrait'],
        },
      },
    },
    pjpg: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        additionalProperties: false,
        properties: {
          quality: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
          },
          metadata: {
            type: 'boolean',
            default: false,
          },
        },
      }],
    },
    quality: {
      type: 'object',
      additionalProperties: false,
      properties: {
        value: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
      },
    },
    cache: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          expiry: {
            type: 'integer',
          },
        },
      }],
    },
    video_convert: {
      type: 'object',
      additionalProperties: false,
      properties: {
        width: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
        height: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
        preset: {
          type: 'string',
        },
        force: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
        extname: {
          type: 'string',
        },
        upscale: {
          type: 'boolean',
        },
        aspect_mode: {
          type: 'string',
          enum: ['letterbox', 'pad', 'crop', 'preserve', 'constrain'],
          default: 'letterbox',
        },
        audio_sample_rate: {
          type: 'integer',
          minimum: 1,
          maximum: 99999,
        },
        two_pass: {
          type: 'boolean',
        },
        video_bitrate: {
          type: 'integer',
          minimum: 1,
          maximum: 5000,
        },
        fps: {
          type: 'integer',
          minimum: 1,
          maximum: 300,
        },
        keyframe_interval: {
          type: 'integer',
          minimum: 250,
          maximum: 250,
        },
        audio_bitrate: {
          type: 'integer',
          minimum: 1,
          maximum: 999,
        },
        audio_channels: {
          type: 'integer',
          minimum: 1,
          maximum: 12,
        },
        clip_length: {
          type: 'string',
          pattern: '^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$',
        },
        clip_offset: {
          type: 'string',
          pattern: '^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$',
        },
        watermark_url: {
          type: 'string',
        },
        watermark_top: {
          type: 'integer',
          minimum: 0,
          maximum: 9999,
        },
        watermark_right: {
          type: 'integer',
          minimum: 0,
          maximum: 9999,
        },
        watermark_bottom: {
          type: 'integer',
          minimum: 0,
          maximum: 9999,
        },
        watermark_left: {
          type: 'integer',
          minimum: 0,
          maximum: 9999,
        },
        frame_count: {
          type: 'integer',
          minimum: 1,
          maximum: 1,
          default: 1,
        },
        filename: {
          type: 'string',
        },
        location: {
          '$ref': 'defs.json#/definitions/locationsDef',
        },
        path: {
          type: 'string',
        },
        container: {
          type: 'string',
        },
        access: {
          type: 'string',
          enum: ['public', 'private'],
          default: 'public',
        },
      },
    },
    store: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        additionalProperties: false,
        properties: {
          filename: {
            type: 'string',
          },
          location: {
            '$ref': 'defs.json#/definitions/locationsDef',
          },
          path: {
            type: 'string',
          },
          container: {
            type: 'string',
          },
          region: {
            '$ref': 'defs.json#/definitions/regionsDef',
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
            type: 'array',
            additionalItems: false,
            minItems: 1,
            maxItems: 20,
            items: [{
              type: 'string',
            }, {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: {
                  type: 'string',
                },
              },
            }],
          },
        },
      }],
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
          '$ref': '#positionDef',
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
          '$ref': '#objectsDef',
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
      required: ['objects'],
    },
    partial_pixelate: {
      type: 'object',
      properties: {
        objects: {
          '$ref': '#objectsDef',
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
      required: ['objects'],
    },
    security: {
      type: 'object',
      additionalProperties: false,
      properties: {
        policy: {
          type: 'string',
        },
        signature: {
          type: 'string',
        },
      },
      required: ['policy', 'signature'],
    },
  },
};
