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
export const DefinitionsSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  title: 'Filestack',
  description: 'Filestack common definitions',
  type: 'object',
  additionalProperties: false,
  definitions: {
    workflowsDef: {
      id: '/workflowsDef',
      type: 'array',
      additionalItems: false,
      minItems: 1,
      maxItems: 20,
      items: [{
        oneOf: [{
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
      }],
    },
    securityCallDef: {
      id: '/securityCallDef',
      oneOf: [{
        additionalProperties: false,
        type: 'string',
        enum: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
      }, {
        type: 'array',
        additionalProperties: false,
        items: [{
          minItems: 1,
          maxItems: 10,
          type: 'string',
          additionalProperties: false,
          enum: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif', 'runWorkflow'],
        }],
      }],
    },
    regionsDef: {
      id: '/regionsDef',
      type: 'string',
      pattern: '^[a-zA-Z]{2}-[a-zA-z]{1,}-[1-9]$',
      errorMessage: 'AWS Region Param is in invalid format',
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
        enum: ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fractal', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray0', 'gray1', 'gray2', 'gray3', 'gray4', 'gray5', 'gray6', 'gray7', 'gray8', 'gray9', 'gray10', 'gray11', 'gray12', 'gray13', 'gray14', 'gray15', 'gray16', 'gray17', 'gray18', 'gray19', 'gray20', 'gray21', 'gray22', 'gray23', 'gray24', 'gray25', 'gray26', 'gray27', 'gray28', 'gray29', 'gray30', 'gray31', 'gray32', 'gray33', 'gray34', 'gray35', 'gray36', 'gray37', 'gray38', 'gray39', 'gray40', 'gray41', 'gray42', 'gray43', 'gray44', 'gray45', 'gray46', 'gray47', 'gray48', 'gray49', 'gray50', 'gray51', 'gray52', 'gray53', 'gray54', 'gray55', 'gray56', 'gray57', 'gray58', 'gray59', 'gray60', 'gray61', 'gray62', 'gray63', 'gray64', 'gray65', 'gray66', 'gray67', 'gray68', 'gray69', 'gray70', 'gray71', 'gray72', 'gray73', 'gray74', 'gray75', 'gray76', 'gray77', 'gray78', 'gray79', 'gray80', 'gray81', 'gray82', 'gray83', 'gray84', 'gray85', 'gray86', 'gray87', 'gray88', 'gray89', 'gray90', 'gray91', 'gray92', 'gray93', 'gray94', 'gray95', 'gray96', 'gray97', 'gray98', 'gray99', 'gray100', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'none', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen', 'transparent'],
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
            'faces',
          ],
        },
        {
          type: 'array',
          uniqueItems: true,
          additionalItems: false,
          minItems: 2,
          maxItems: 2,
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
};
