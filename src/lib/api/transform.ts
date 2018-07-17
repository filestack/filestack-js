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

import * as t from 'tcomb-validation';
import { Session } from '../client';
import { resolveCdnUrl } from './../utils/index';

/**
 * @private
 */
const toSnakeCase = (original: { [index: string]: any }): { [index: string]: any } => {
  let snakeCased: { [index: string]: any } = {};

  const keys = Object.keys(original);

  for (let i = 0; i < keys.length; i++) {
    let newKey = keys[i].split(/(?=[A-Z])/).join('_').toLowerCase();

    if (typeof original[keys[i]] === 'object'
        && !Array.isArray(original[keys[i]])) {
      snakeCased[newKey] = toSnakeCase(original[keys[i]]);
    } else {
      snakeCased[newKey] = original[keys[i]];
    }
  }

  return snakeCased;
};

/**
 * Align enum
 */
export enum EAlignOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
}

/**
 * Align enum with faces option
 */
export enum EAlignFacesOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
  faces = 'faces',
}

/**
 * Fit enum
 */
export enum EFitOptions {
  clip = 'clip',
  crop = 'crop',
  scale = 'scale',
  max = 'max',
}

/**
 * Blur enum
 */
export enum EBlurMode {
  linear = 'linear',
  gaussian = 'gaussian',
}

/**
 * Shapes enum
 */
export enum EShapeType {
  oval = 'oval',
  rect = 'rect',
}

/**
 * Noise type enum
 */
export enum ENoiseType {
  none = 'none',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

/**
 * Style type enum
 */
export enum EStyleType {
  artwork = 'artwork',
  photo = 'photo',
}

/**
 * Color space enum
 */
export enum EColorspaceType {
  RGB = 'RGB',
  CMYK = 'CMYK',
  Input = 'Input',
}

/**
 * Crop faces options enum
 */
export enum ECropfacesType {
  thumb = 'thumb',
  crop = 'crop',
  fill = 'fill',
}

/**
 * Convert to format
 */
export enum EVideoTypes {
    h264 = 'h264',
    h264_hi = 'h264.hi',
    webm = 'webm',
    'webm-hi' = 'webm.hi',
    ogg = 'ogg',
    'ogg-hi' = 'ogg.hi',
    'hls-variant' = 'hls.variant',
    mp3 = 'mp3',
    oga = 'oga',
    m4a = 'm4a',
    aac = 'aac',
    hls = 'hls.variant.audio'
}

/**
 * Video storage location
 */
export enum EVideoLocations {
  s3 = 's3',
  azure = 'azure',
  gcs = 'gcs',
  rackspace = 'rackspace',
  dropbox = 'dropbox',
}

export enum EVideoAccess {
  private = 'private',
  public = 'public',
}

export enum EVideoAccessMode {
  preserve = 'preserve',
  constrain = 'constrain',
  letterbox = 'letterbox',
  pad = 'pad',
  crop = 'crop',
}

/**
 * @see https://www.filestack.com/docs/image-transformations
 */
export interface TransformOptions {
  flip?: boolean;
  compress?: boolean;
  flop?: boolean;
  enchance?: boolean;
  redeye?: boolean;
  monochrome?: boolean;
  negative?: boolean;
  tags?: boolean;
  sfw?: boolean;
  resize?: {
    width?: number;
    height?: number;
    fit?: boolean;
    align?: EAlignFacesOptions;
  };
  crop?: {
    dim: [number, number, number, number]
  };
  rotate?: {
    deg: number | string;
    color?: string;
    background?: string;
  };
  detect_faces?: {
    minsize?: number;
    maxsize?: number;
    color?: string;
    export?: boolean;
  } | true;
  crop_faces?: {
    mode?: ECropfacesType;
    width?: number;
    height?: number;
    faces?: number | string;
    buffer?: number;
  };
  pixelate_faces?: {
    faces?: number | string;
    minsize?: number;
    maxsize?: number;
    buffer?: number;
    amount?: number;
    blur?: number;
    type?: EShapeType;
  };
  blur_faces?: {
    faces?: number | string;
    minsize?: number;
    maxsize?: number;
    buffer?: number;
    amount?: number;
    blur?: number;
    type?: EShapeType;
  };
  rounded_corners?: {
    radius?: number;
    blur?: number;
    background?: string;
  } | true;
  vignette?: {
    amount?: number;
    blurmode?: EBlurMode;
    background?: string;
  };
  polaroid?: {
    color?: string;
    rotate?: number;
    background?: string;
  } | true;
  torn_edges?: {
    spread?: [number, number];
    background?: string;
  } | true;
  shadow?: {
    blur?: number;
    opacity?: number;
    vector?: [number, number];
    color?: string;
    background?: string;
  } | true;
  circle?: {
    background?: string;
  } | true;
  border?: {
    width?: number;
    color?: string;
    background?: string;
  } | true;
  sharpen?: {
    amount: number;
  } | true;
  blur?: {
    amount: number;
  } | true;
  blackwhite?: {
    threshold: number;
  } | true;
  sepia?: {
    tone: number;
  } | true;
  pixelate?: {
    amount: number;
  } | true;
  oil_paint?: {
    amount: number;
  } | true;
  modulate?: {
    brightness?: number;
    hue?: number;
    saturation?: number;
  } | true;
  partial_pixelate?: {
    amount?: number;
    blur?: number;
    type?: EShapeType;
    objects?: [[number, number, number, number]];
  };
  partial_blur?: {
    amount: number;
    blur?: number;
    type?: EShapeType;
    objects?: [[number, number, number, number]];
  };
  collage?: {
    margin?: number;
    width?: number;
    height?: number;
    color?: string;
    fit?: EFitOptions,
    files: [string];
  };
  upscale?: {
    upscale?: boolean;
    noise?: ENoiseType;
    style?: EStyleType;
  } | true;
  ascii?: {
    background?: string;
    foreground?: string;
    colored?: boolean;
    size?: number;
    reverse?: boolean;
  } | true;
  quality?: {
    value: number;
  };
  security?: {
    policy: string;
    signature?: string;
  };
  output?: {
    format: string;
    colorspace?: string;
    strip?: boolean;
    quality?: number;
    page?: number;
    compress?: boolean;
    density?: number;
    background?: string;
    secure?: boolean;
    docinfo?: boolean;
    pageformat?: string;
    pageorientation?: string;
  };
  cache?: {
    cache?: boolean;
    expiry: number;
  };
  // audio/video
  video_convert? : {
    aspect_mode: EVideoAccessMode;
    preset?: EVideoTypes;
    force?: boolean;
    title?: string;
    extname?: string;
    filename?: string;
    location?: EVideoLocations;
    path?: string;
    access?: EVideoAccess;
    container?: string;
    audio_bitrate?: number;
    upscale: boolean;
    video_bitrate?: number;
    audio_sample_rate?: number;
    audio_channels?: number;
    clip_length?: string;
    clip_offset?: string;
    width?: number;
    height?: number;
    two_pass?: boolean;
    fps?: number;
    keyframe_interval?: number;
    watermark_url?: string;
    watermark_top?: number;
    watermark_bottom?: number;
    watermark_right?: number;
    watermark_left?: number;
    watermark_width?: number;
    watermark_height?: number;
  };
}

// ===== Custom Validators =====

/**
 * @private
 */
const vRange = (start: number, end: number) => {
  const validator = t.refinement(t.Integer, (n: number) => n >= start && n <= end);
  validator['displayName'] = `Value is not in allowed range(${start}-${end})`;

  return validator;
};

/**
 * @private
 */
const vFloat = () => {
  return t.refinement(t.Number, (n: number) => n > 0 && n < 1);
};

/**
 * @private
 */
const vFloatOrRange = (start: number, end: number) => {
  return t.union([vFloat(), vRange(start, end)]);
};

/**
 * @private
 */
const vNumberOrAll = () => {
  return t.union([t.Integer, t.enums.of('all')]);
};

/**
 * @private
 */
const vAlignment = t.enums.of('top left right bottom center');

/**
 * @private
 */
const vBlurMode = t.enums.of('linear gaussian');

/**
 * @private
 */
const vColor = t.String;

/**
 * @private
 */
const vRotate = t.union([t.enums.of('exif'), vRange(1, 359) ]);

/**
 * @private
 */
const vShapeType = t.enums.of('rect oval');

/**
 * @private
 */
const vFit = t.enums.of('clip crop scale max');

/**
 * @private
 */
const vColorspace = t.enums.of('RGB CMYK Input');

/**
 * @private
 */
const vCropfaces = t.enums.of('thumb crop fill');

/**
 * @private
 * Custom schema interface for tcomb-validation
 */
interface CustomSchemaInterface {
  name?: string;
  validator?: Function;
  props?: CustomSchemaInterface[];
  required?: boolean;
  canBeBoolean?: boolean;
  [index: string]: any;
}

/**
 * @private
 * Apply tcomb validators to object
 *
 * @private
 * @param validators
 * @param canBeBoolean
 * @param maybe
 */
const applySchemaValidators = (validators: any, canBeBoolean: boolean = false, maybe: boolean = false) => {
  // single validator
  if (typeof validators === 'function') {
    return maybe ? t.maybe(validators) : validators;
  }

  const defaultValidators = t.struct(validators);

  if (!canBeBoolean) {
    return maybe ? t.maybe(defaultValidators) : defaultValidators;
  }

  const vBoolean = t.Boolean;

  const isValid = t.union([vBoolean, defaultValidators], 'canBeBoolean');
  isValid.dispatch = (x) => {
    return (typeof x === 'boolean') ? vBoolean : defaultValidators;
  };

  return maybe ? t.maybe(isValid) : isValid;
};

/**
 * Convert custom schema for tcomb-validation with maybe function (not required param)
 *
 * @private
 * @param schema
 */
const toTcombSchema = (schema: CustomSchemaInterface): t.Struct<{}> => {
  let result: any = {};
  if (!Array.isArray(schema) && typeof schema === 'object') {
    Object.keys(schema).map((key: string) => {
      result[key] = t.maybe(schema[key]);
    });

    return result;
  }

  schema.forEach((el: any) => {
    if (el.props) {
      result[el.name] = applySchemaValidators(toTcombSchema(el.props), el.canBeBoolean, !el.required);
      return;
    }

    result[el.name] = applySchemaValidators(el.validator, el.canBeBoolean, !el.required);
  });

  return t.struct(result);
};

/**
 * @private
 */
const validationSchema: any[] = [
  {
    name: 'flip',
    validator: t.Boolean,
  },{
    name: 'compress',
    validator: t.Boolean,
  }, {
    name: 'flop',
    validator: t.Boolean,
  }, {
    name: 'tags',
    validator: t.Boolean,
  }, {
    name: 'sfw',
    validator: t.Boolean,
  }, {
    name: 'monochrome',
    validator: t.Boolean,
  }, {
    name: 'enhance',
    validator: t.Boolean,
  }, {
    name: 'redeye',
    validator: t.Boolean,
  }, {
    name: 'negative',
    validator: t.Boolean,
  }, {
    name: 'resize',
    props: {
      width: t.Integer,
      height: t.Integer,
      fit: vFit,
      align: vAlignment,
    },
  }, {
    name: 'crop',
    props: {
      dim: t.tuple([t.Integer, t.Integer, t.Integer, t.Integer]),
    },
  }, {
    name: 'resize',
    props: {
      width: t.Integer,
      height: t.Integer,
      fit: vFit,
      align: vAlignment,
    },
  }, {
    name: 'rotate',
    props: {
      deg: vRotate,
      colour: vColor,
      background: vColor,
    },
  }, {
    name: 'rounded_corners',
    canBeBoolean: true,
    props: {
      radius: vRange(1, 10000),
      blur: vRange(0, 20),
      background: vColor,
    },
  }, {
    name: 'vignette',
    props: {
      amount: vRange(0, 100),
      blurmode: vBlurMode,
      background: vColor,
    },
  }, {
    name: 'polaroid',
    canBeBoolean: true,
    props: {
      color: vColor,
      rotate: vRotate,
      background: vColor,
    },
  }, {
    name: 'torn_edges',
    canBeBoolean: true,
    props: {
      spread: t.tuple([vRange(1, 10000), vRange(1, 10000)]),
      background: vColor,
    },
  }, {
    name: 'shadow',
    canBeBoolean: true,
    props: {
      blur: vRange(0, 20),
      opacity: vRange(0, 100),
      vector: t.tuple([vRange(-1000, 1000), vRange(-1000, 1000)]),
      color: vColor,
      background: vColor,
    },
  }, {
    name: 'circle',
    canBeBoolean: true,
    props: {
      background: vColor,
    },
  }, {
    name: 'border',
    canBeBoolean: true,
    props: {
      width: vRange(1, 1000),
      color: vColor,
      background: vColor,
    },
  }, {
    name: 'sharpen',
    canBeBoolean: true,
    props: {
      amount: vRange(1, 20),
    },
  }, {
    name: 'blackwhite',
    canBeBoolean: true,
    props: {
      threshold: vRange(0, 100),
    },
  }, {
    name: 'blur',
    canBeBoolean: true,
    props: [{
      name: 'amount',
      validator: vRange(2, 20),
      required: true,
    }],
  }, {
    name: 'sepia',
    canBeBoolean: true,
    props: {
      tone: vRange(1, 100),
    },
  }, {
    name: 'pixelate',
    canBeBoolean: true,
    props: [{
      name: 'amount',
      validator: vRange(2, 100),
      required: true,
    }],
  }, {
    name: 'oil_paint',
    canBeBoolean: true,
    props: {
      amount: vRange(1, 10),
    },
  }, {
    name: 'modulate',
    canBeBoolean: true,
    props: {
      brightness: vRange(0, 10000),
      hue: vRange(0, 359),
      saturation: vRange(0, 10000),
    },
  }, {
    name: 'partial_pixelate',
    props: {
      amount: vRange(2, 100),
      blur: vRange(0, 20),
      type: vShapeType,
      objects: t.list(t.tuple([t.Integer, t.Integer, t.Integer, t.Integer])),
    },
  }, {
    name: 'partial_blur',
    props: {
      amount: vRange(2, 100),
      blur: vRange(0, 20),
      type: vShapeType,
      objects: t.list(t.tuple([t.Integer, t.Integer, t.Integer, t.Integer])),
    },
  }, {
    name: 'collage',
    props: {
      files: t.list(t.String),
      margin: t.Integer,
      width: t.Integer,
      height: t.Integer,
      color: vColor,
      fit: vFit,
      autorotate: t.Boolean,
    },
  }, {
    name: 'upscale',
    canBeBoolean: true,
    props: {
      upscale: t.Boolean,
      noise: t.enums.of('none low medium high'),
      style: t.enums.of('artwork photo'),
    },
  }, {
    name: 'ascii',
    canBeBoolean: true,
    props: {
      background: vColor,
      foreground: vColor,
      colored: t.Boolean,
      size: vRange(10, 100),
      reverse: t.Boolean,
    },
  }, {
    name: 'quality',
    props: {
      value: t.Number,
    },
  }, {
    name: 'security',
    props: {
      policy: t.String,
      signature: t.String,
    },
  }, {
    name: 'cache',
    canBeBoolean: true,
    props: {
      cache: t.Boolean,
      expiry: t.Integer,
    },
  }, {
    name: 'output',
    props: {
      format: t.String,
      colorspace: vColorspace,
      strip: t.Boolean,
      quality: vRange(1, 100),
      page: vRange(1, 10000),
      compress: t.Boolean,
      density: vRange(1, 500),
      background: vColor,
      secure: t.Boolean,
      docinfo: t.Boolean,
      pageformat: t.enums.of('a3 A3 a4 A4 a5 A5 b4 B4 b5 B5 letter legal tabloid'),
      pageorientation: t.enums.of('portrait landscape'),
    },
  }, {
    name: 'crop_faces',
    props: {
      mode: vCropfaces,
      width: t.Integer,
      height: t.Integer,
      faces: vNumberOrAll(),
      buffer: t.Integer,
    },
  }, {
    name: 'detect_faces',
    canBeBoolean: true,
    props: {
      minsize: vFloatOrRange(0, 10000),
      maxsize: vFloatOrRange(0, 10000),
      color: vColor,
      export: t.Boolean,
    },
  }, {
    name: 'pixelate_faces',
    props: {
      faces: vNumberOrAll(),
      minsize: vFloatOrRange(0, 10000),
      maxsize: vFloatOrRange(0, 10000),
      buffer: vRange(0, 1000),
      amount: vRange(2, 100),
      blur: vRange(0, 20),
      type: vShapeType,
    },
  }, {
    name: 'blur_faces',
    props: {
      faces: vNumberOrAll(),
      minsize: vFloatOrRange(0, 10000),
      maxsize: vFloatOrRange(0, 10000),
      buffer: vRange(0, 1000),
      amount: vRange(2, 100),
      blur: vRange(0, 20),
      type: vShapeType,
    },
  }, {
    name: 'video_convert',
    props: {
      preset: t.enums.of('h264 h264.hi webm webm.hi ogg ogg.hi hls.variant mp3 oga m4a aac hls.variant.audio'),
      force: t.Boolean,
      title: t.String,
      extname: t.String,
      filename: t.String,
      location: t.enums.of('S3 s3 azure gcs rackspace dropbox'),
      path: t.String,
      access: t.enums.of('private public'),
      container: t.String,
      audio_bitrate: vRange(0, 999),
      video_bitrate: vRange(1, 5000),
      audio_sample_rate: vRange(0, 99999),
      audio_channels: vRange(1, 12),
      upscale: t.Boolean,
      aspect_mode: t.enums.of('preserve constrain letterbox pad crop'),
      clip_length: t.String,
      clip_offset: t.String,
      width: t.Number,
      height: t.Number,
      two_pass: t.Boolean,
      fps: vRange(1, 300),
      keyframe_interval: vRange(1, 300),
      watermark_url: t.String,
      watermark_top: t.Number,
      watermark_bottom: t.Number,
      watermark_right: t.Number,
      watermark_left: t.Number,
      watermark_width: t.Number,
      watermark_height: t.Number,
    },
  },
];

/**
 * Converts nested arrays to string
 *
 * @private
 * @example [1,2, [2,3]] => "[1,2, [2,3]]"
 * @param arr - any array
 */
const arrayToString = (arr: any[]): string => {
  const toReturn = arr.map((el) => {
    if (Array.isArray(el)) {
      return arrayToString(el);
    }

    return el;
  });

  return `[${toReturn}]`;
};

/**
 * Flatten transformation option to string
 *
 * @private
 * @example {resize:{width: 100,height: 200}} => resize=width:100,height:200
 * @param key - option key
 * @param values - option params
 */
const optionToString = (key: string, values: any): string => {
  let optionsString: string[] = [];

  // if we just want to enable feature
  if (typeof values === 'boolean') {
    if (!values) {
      return '';
    }

    return key;
  }

  if (typeof values === 'object' && !Object.keys(values).length) {
    return '';
  }

  Object.keys(values).forEach((i) => {
    if (Array.isArray(values[i])) {
      optionsString.push(`${i}:${arrayToString(values[i])}`);
      return;
    }

    optionsString.push(`${i}:${values[i]}`);
  });

  return `${key}=${optionsString.join(',')}`;
};

/**
 * Creates filestack transform url.
 * Transform params can be provided in camelCase or snakeCase style
 *
 * @example
 * ```js
 * // camelCase
 * console.log(transform(session, {
 *    partialPixelate: {
 *      objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
 *    },
 *  }, 'testfile'));
 * ```
 * result => https://cdn.filestackcontent.com/partial_pixelate=objects:[[10,20,200,250],[275,91,500,557]]/testfile
 *
 * ```js
 * // snakeCase
 * console.log(transform(session, {
 *    partial_pixelate: {
 *      objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
 *    },
 *  }, 'testfile'));
 * ```
 * result => https://cdn.filestackcontent.com/partial_pixelate=objects:[[10,20,200,250],[275,91,500,557]]/testfile
 *
 * @private
 * @throws Error
 * @param options Transformation options
 */
export const transform = (session: Session, url: string, options: TransformOptions = {}): string | null => {
  options = toSnakeCase(options);

  // strict will not allow additional params
  const validate = t.validate(options, toTcombSchema(validationSchema), { strict: true });

  if (!validate.isValid()) {
    const firstError: t.ValidationError | null = validate.firstError();
    throw new Error(`Wrong options provided: ${firstError ? firstError.message : 'unknown'}`);
  }

  let transformsArray: string[] = [];

  if (session.policy && session.signature) {
    options.security = {
      policy: session.policy,
      signature: session.signature,
    };
  }

  Object.keys(options).forEach((key: keyof TransformOptions) => {
    transformsArray.push(optionToString(key, options[key]));
  });

  // remove empty transform entries
  transformsArray = transformsArray.filter((val) => {
    return val.length;
  });

  // See URL format: https://www.filestack.com/docs/image-transformations
  const baseURL = resolveCdnUrl(session, url);

  if (!transformsArray.length) {
    return `${baseURL}/${url}`;
  }

  const transformString = transformsArray.join('/');

  return `${baseURL}/${transformString}/${url}`;
};
