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
import { Filelink } from './../filelink';

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

export enum EUrlscreenshotAgent {
  desktop = 'desktop',
  mobile = 'mobile',
}

export enum EUrlscreenshotMode {
  all = 'all',
  window = 'window',
}

export enum EUrlscreenshotOrientation {
  portrait = 'portrait',
  landscape = 'landscape',
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
    location?: string,
    path?: string,
    container?: string,
    region?: string;
    access?: string;
    base64decode?: boolean;
  };
  resize?: {
    width?: number;
    height?: number;
    fit?: EFitOptions;
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
  urlscreenshot?: {
    agent?: EUrlscreenshotAgent;
    width?: number;
    height?: number;
    mode?: EUrlscreenshotMode;
    delay?: number;
    orientation?: EUrlscreenshotOrientation;
    device?: string;
  } | true;
  pdfinfo?: {
    colorinfo?: boolean
  } | true;
  pdfconvert?: {
    pageorientation?: string
    pageformat?: string
    pages?: (string | number)[]
  };
}

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
 * // snake_case
 * console.log(transform(session, {
 *    partial_pixelate: {
 *      objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
 *    },
 *  }, 'testfile'));
 * ```
 * result => https://cdn.filestackcontent.com/partial_pixelate=objects:[[10,20,200,250],[275,91,500,557]]/testfile
 *
 * Client.transform is deprecated. Use Filelink class instead
 *
 * @private
 * @throws Error
 * @param options Transformation options
 * @param url url, handle or array of elements
 */
export const transform = (session: Session, url: string | string[], options: TransformOptions = {}, b64: boolean = false): string => {
  options = toSnakeCase(options);

  if (session.policy && session.signature) {
    options.security = {
      policy: session.policy,
      signature: session.signature,
    };
  }

  const filelink = new Filelink(url, session.apikey);
  filelink.setCname(session.cname);
  filelink.setBase64(b64);

  Object.keys(options).forEach((key: keyof TransformOptions) => {
    if (typeof options[key] === 'boolean' && !options[key] && key !== 'cache') {
      return;
    }

    filelink.addTask(key, options[key]);
  });

  return filelink.toString();
};
