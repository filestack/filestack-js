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
  title: 'Filestack Transformations',
  description: 'Filestack transformations parameters',
  type: 'object',
  additionalProperties: false,
  definitions: {
    securityCallDef: {
      id: '/securityCallDef',
      type: 'string',
      enum: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
    },
    regionsDef: {
      id: '/regionsDef',
      type: 'string',
      enum: ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'sa-east-1'],
    },
    locationsDef: {
      id: '/locationsDef',
      type: 'string',
      enum: ['s3', 'S3', 'rackspace', 'gcs', 'azure', 'dropbox'],
    },
    colorDef: {
      id: 'colorDef',
      oneOf: [{
        type: 'string',
        pattern: '^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', // without # at the begining
      }, {
        type: 'string',
        enum: ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fractal', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray0', 'gray1', 'gray2', 'gray3', 'gray4', 'gray5', 'gray6', 'gray7', 'gray8', 'gray9', 'gray10', 'gray11', 'gray12', 'gray13', 'gray14', 'gray15', 'gray16', 'gray17', 'gray18', 'gray19', 'gray20', 'gray21', 'gray22', 'gray23', 'gray24', 'gray25', 'gray26', 'gray27', 'gray28', 'gray29', 'gray30', 'gray31', 'gray32', 'gray33', 'gray34', 'gray35', 'gray36', 'gray37', 'gray38', 'gray39', 'gray40', 'gray41', 'gray42', 'gray43', 'gray44', 'gray45', 'gray46', 'gray47', 'gray48', 'gray49', 'gray50', 'gray51', 'gray52', 'gray53', 'gray54', 'gray55', 'gray56', 'gray57', 'gray58', 'gray59', 'gray60', 'gray61', 'gray62', 'gray63', 'gray64', 'gray65', 'gray66', 'gray67', 'gray68', 'gray69', 'gray70', 'gray71', 'gray72', 'gray73', 'gray74', 'gray75', 'gray76', 'gray77', 'gray78', 'gray79', 'gray80', 'gray81', 'gray82', 'gray83', 'gray84', 'gray85', 'gray86', 'gray87', 'gray88', 'gray89', 'gray90', 'gray91', 'gray92', 'gray93', 'gray94', 'gray95', 'gray96', 'gray97', 'gray98', 'gray99', 'gray100', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'none', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen',],
      }],
    },
    pageFormatDef: {
      id: '/pageFormatDef',
      type: 'string',
      enum: ['a2', 'a3', 'a4', 'a5', 'b4', 'b5', 'letter', 'legal', 'tabloid'],
    },
    pageRangeDef: {
      id: '/pageRangeDef',
      type: 'array',
      uniqueItems: true,
      items: [{
        oneOf: [{
          type: 'integer',
          minimum: 1,
        }, {
          type: 'string',
          pattern: '^(\\d+(?:-\\d+)?)$|^(-\\d+)$|^(\\d+-)$',
          errorMessage: 'Param should be provided in one of the following formats: "1,2,3,5", "1-3", "1-", "-2" ',
        }],
      }],
    },
    facesDef: {
      id: '/facesDef',
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
      id: '/objectsDef',
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
      id: '/positionDef',
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
    enhance: {
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
          '$ref': 'positionDef',
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
            enum: ['exif'],
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
          '$ref': 'colorDef',
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
            '$ref': 'colorDef',
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
            '$ref': 'facesDef',
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
            '$ref': 'facesDef',
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
            '$ref': 'facesDef',
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
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
            default: 'snow',
          },
          background: {
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
          },
          background: {
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
          },
          background: {
            '$ref': 'colorDef',
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
            '$ref': 'colorDef',
            default: '000000FF',
          },
          background: {
            '$ref': 'colorDef',
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
          '$ref': 'colorDef',
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
          '$ref': 'colorDef',
        },
        pageformat: {
          type: 'string',
          enum: ['a2', 'a3', 'a4', 'a5', 'b4', 'b5', 'letter', 'legal', 'tabloid'],
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
          maximum: 4096,
        },
        height: {
          type: 'integer',
          minimum: 1,
          maximum: 4096,
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
          pattern: `^([0-1]?\\d|2[0-3])(?::([0-5]?\\d))?(?::([0-5]?\\d))?$`,
        },
        clip_offset: {
          type: 'string',
          pattern: `^([0-1]?\\d|2[0-3])(?::([0-5]?\\d))?(?::([0-5]?\\d))?$`,
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
          '$ref': 'locationsDef',
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
          '$ref': 'positionDef',
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
          '$ref': 'objectsDef',
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
          '$ref': 'objectsDef',
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
    pdfinfo: {
      oneOf: [{
        type: 'boolean',
      }, {
        type: 'object',
        properties: {
          colorinfo: {
            type: 'boolean',
          },
        },
      }],
    },
    pdfconvert: {
      type: 'object',
      additionalProperties: false,
      properties: {
        pageorientation: {
          type: 'string',
          enum: ['portrait', 'landscape'],
        },
        pageformat: {
          '$ref': 'pageFormatDef',
        },
        pages: {
          '$ref': 'pageRangeDef',
        },
      },
      anyOf: [{
        required: ['pageorientation'],
      }, {
        required: ['pageformat'],
      }, {
        required: ['pages'],
      }],
    },
    fallback: {
      type: 'object',
      additionalProperties: false,
      properties: {
        handle: {
          type: 'string',
        },
        cache: {
          type: 'integer',
          minimum: 1,
          maximum: 31536000,
        },
      },
      required: ['handle'],
    },
    zip: {
      type: 'string',
    },
    minify_css: {
      type: 'object',
      additionalProperties: false,
      properties: {
        gzip: {
          type: 'boolean',
        },
        level: {
          type: 'number',
          enum: [1, 2],
        },
      },
    },
    minify_js: {
      type: 'object',
      additionalProperties: false,
      properties: {
        gzip: {
          type: 'boolean',
        },
        use_babel_polyfill: {
          type: 'boolean',
        },
        keep_fn_name: {
          type: 'boolean',
        },
        keep_class_name: {
          type: 'boolean',
        },
        mangle: {
          type: 'boolean',
        },
        merge_vars: {
          type: 'boolean',
        },
        remove_console: {
          type: 'boolean',
        },
        remove_undefined: {
          type: 'boolean',
        },
        targets: {
          type: 'string',
        },
      },
    },
  },
};
