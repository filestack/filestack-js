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

import { Session } from '../client';
import { resolveCdnUrl } from './../utils/index';
import { TransformSchema, getValidator, valuesToLowerCase } from './../../schema/';
import { FilestackError } from './../../FilestackError';

declare var ENV: any;

/**
 * @private
 */
const toSnakeCase = (original: { [index: string]: any }): { [index: string]: any } => {
  let snakeCased: { [index: string]: any } = {};

  const keys = Object.keys(original);

  for (let i = 0; i < keys.length; i++) {
    let newKey = keys[i].split(/(?=[A-Z])/).join('_').toLowerCase();

    if (typeof original[keys[i]] === 'object' && !Array.isArray(original[keys[i]])) {
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
    hls = 'hls.variant.audio',
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
  store?: {
    filename?: string,
    localion?: string,
    path?: string,
    container?: string,
    region?: string;
    access?: string;
    base64decode?: boolean;
  };
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
  video_convert?: {
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

    return escapeValue(el);
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

  if (typeof values === 'undefined') {
    return key;
  }

  if (typeof values === 'object' && !Object.keys(values).length) {
    return '';
  }

  // if we just want to enable feature
  if (typeof values === 'boolean') {
    if (!values && key === 'cache') {
      return `${key}=false`;
    }

    if (!values) {
      return '';
    }

    return key;
  }

  Object.keys(values).forEach((i) => {
    if (Array.isArray(values[i])) {
      optionsString.push(`${i}:${arrayToString(values[i])}`);
      return;
    }

    optionsString.push(`${i}:${escapeValue(values[i])}`);
  });

  return `${key}=${optionsString.join(',')}`;
};

// move to util§s ?
const escapeValue = (value: any): any => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.indexOf('http:') > -1|| value.indexOf('https:') > -1 || value.indexOf('src:') > -1) {
    return `"${value}"`;
  }

  return value;
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
export const transform = (session: Session, url: string, options: TransformOptions = {}): string => {
  options = toSnakeCase(valuesToLowerCase(options));

  const validate = getValidator(TransformSchema);

  if (!validate(options)) {
    throw new FilestackError('Validation error', validate.errors);
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

  return `${baseURL}/${transformString}/${escapeValue(url)}`;
};
