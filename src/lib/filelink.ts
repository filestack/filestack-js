/*
 * Copyright (c) 2018 by Filestack
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

import { config } from './../config';
import { TransformSchema } from './../schema/transforms.schema';
import { getValidator } from './../schema/validator';
import { resolveHost } from './utils';
import { FilestackError } from './../FilestackError';

/**
 * Align enum
 */
export enum AlignOptions {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
}

/**
 * Align enum with faces option
 */
export enum AlignFacesOptions {
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
export enum FitOptions {
  clip = 'clip',
  crop = 'crop',
  scale = 'scale',
  max = 'max',
}

/**
 * Blur enum
 */
export enum BlurMode {
  linear = 'linear',
  gaussian = 'gaussian',
}

/**
 * Shapes enum
 */
export enum ShapeType {
  oval = 'oval',
  rect = 'rect',
}

/**
 * Noise type enum
 */
export enum NoiseType {
  none = 'none',
  low = 'low',
  medium = 'medium',
  high = 'high',
}

/**
 * Style type enum
 */
export enum StyleType {
  artwork = 'artwork',
  photo = 'photo',
}

/**
 * Color space enum
 */
export enum ColorspaceType {
  RGB = 'RGB',
  CMYK = 'CMYK',
  Input = 'Input',
}

/**
 * Crop faces options enum
 */
export enum CropfacesType {
  thumb = 'thumb',
  crop = 'crop',
  fill = 'fill',
}

/**
 * Convert to format
 */
export enum VideoTypes {
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

export enum URLScreenshotAgent {
  desktop = 'desktop',
  mobile = 'mobile',
}

export enum URLScreenshotMode {
  all = 'all',
  window = 'window',
}

export enum URLScreenshotOrientation {
  portrait = 'portrait',
  landscape = 'landscape',
}

/**
 * Video storage location
 */
export enum Locations {
  s3 = 's3',
  azure = 'azure',
  gcs = 'gcs',
  rackspace = 'rackspace',
  dropbox = 'dropbox',
}

export enum VideoAccess {
  private = 'private',
  public = 'public',
}

export enum VideoAccessMode {
  preserve = 'preserve',
  constrain = 'constrain',
  letterbox = 'letterbox',
  pad = 'pad',
  crop = 'crop',
}

/**
 * Available options for store transformations
 *
 * @export
 * @interface StoreParams
 */
export interface StoreParams {
  filename?: string;
  localion?: string;
  path?: string;
  container?: string;
  region?: string;
  access?: string;
  base64decode?: boolean;
}

export interface ResizeParams {
  width?: number;
  height?: number;
  fit?: FitOptions;
  align?: AlignFacesOptions;
}

export interface CropParams {
  dim: [number, number, number, number];
}

export interface RotateParams {
  deg: number | string;
  color?: string;
  background?: string;
}

export interface DetectFacesParams {
  minsize?: number;
  maxsize?: number;
  color?: string;
  export?: boolean;
}

export interface CropFacesParams {
  mode?: CropfacesType;
  width?: number;
  height?: number;
  faces?: number | string;
  buffer?: number;
}

export interface PixelateFacesParams {
  faces?: number | string;
  minsize?: number;
  maxsize?: number;
  buffer?: number;
  amount?: number;
  blur?: number;
  type?: ShapeType;
}

export interface BlurFacesParams {
  faces?: number | string;
  minsize?: number;
  maxsize?: number;
  buffer?: number;
  amount?: number;
  blur?: number;
  type?: ShapeType;
}

export interface RoundedCornersParams {
  radius?: number;
  blur?: number;
  background?: string;
}

export interface VignetteParams {
  amount?: number;
  blurmode?: BlurMode;
  background?: string;
}

export interface PolaroidParams {
  color?: string;
  rotate?: number;
  background?: string;
}

export interface TornEdgesParams {
  spread?: [number, number];
  background?: string;
}

export interface ShadowParams {
  blur?: number;
  opacity?: number;
  vector?: [number, number];
  color?: string;
  background?: string;
}

export interface CircleParams {
  background?: string;
}

export interface BorderParams {
  width?: number;
  color?: string;
  background?: string;
}

export interface SharpenParams {
  amount: number;
}

export interface BlurParams {
  amount: number;
}

export interface BlackWhiteParams {
  threshold: number;
}

export interface SepiaParams {
  tone: number;
}

export interface PixelateParams {
  amount: number;
}

export interface OilPaintParams {
  amount: number;
}

export interface ModulateParams {
  brightness?: number;
  hue?: number;
  saturation?: number;
}

export interface PartialPixelateParams {
  amount?: number;
  blur?: number;
  type?: ShapeType;
  objects?: [[number, number, number, number]];
}

export interface PartialBlurParams {
  amount: number;
  blur?: number;
  type?: ShapeType;
  objects?: [[number, number, number, number]];
}

export interface CollageParams {
  margin?: number;
  width?: number;
  height?: number;
  color?: string;
  fit?: FitOptions;
  files: [string];
}

export interface UpscaleParams {
  upscale?: boolean;
  noise?: NoiseType;
  style?: StyleType;
}

export interface AsciiParams {
  background?: string;
  foreground?: string;
  colored?: boolean;
  size?: number;
  reverse?: boolean;
}

export interface QualityParams {
  value: number;
}

export interface SecurityParams {
  policy: string;
  signature?: string;
}

export interface OutputParams {
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
}

export interface CacheParams {
  cache?: boolean;
  expiry: number;
}

export interface VideoConvertParams {
  aspect_mode: VideoAccessMode;
  preset?: VideoTypes;
  force?: boolean;
  title?: string;
  extname?: string;
  filename?: string;
  location?: Locations;
  path?: string;
  access?: VideoAccess;
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
}

export interface URLScreenshotParams {
  agent?: URLScreenshotAgent;
  width?: number;
  height?: number;
  mode?: URLScreenshotMode;
  delay?: number;
  orientation?: URLScreenshotOrientation;
  device?: string;
}

export interface PdfInfoParams {
  colorinfo?: boolean;
}

export interface PdfConvertParams {
  pageorientation?: string;
  pageformat?: string;
  pages?: (string | number)[];
}

// export type TransformOptions = StoreParams & ResizeParams & RotateParams & CropParams & DetectFacesParams & CropFacesParams & PixelateFacesParams
//                                & BlurFacesParams & RoundedCornersParams & VignetteParams & PolaroidParams & TornEdgesParams & ShadowParams
//                                & CircleParams & BorderParams & SharpenParams & BlurParams & BlackWhiteParams & SepiaParams & PixelateFacesParams
//                                & OilPaintParams & ModulateParams & PartialBlurParams & PartialPixelateParams;

// const src = (new Filelink('testhandle')).flip().flop();
// img.src = src;
// console.log(src.toString());

const handleRegexp = new RegExp('^([_\\w\\-]+){20}$');

export class Filelink {
  private validator = getValidator(TransformSchema);
  private transforms = [];

  /**
   * Handle or multiple handles in array
   *
   * @private
   * @memberof Filelink
   */
  private source: string | string[];

  /**
   * Application key
   *
   * @private
   * @type {string}
   * @memberof Filelink
   */
  private apikey: string;

  /**
   * Is base64 support is enabled
   *
   * @private
   * @type {boolean}
   * @memberof Filelink
   */
  private b64: boolean = false;

  /**
   * Custom CNAME
   *
   * @private
   * @type {string}
   * @memberof Filelink
   */
  private cname: string;

  /**
   * Overwrite domain (test purposes)
   *
   * @private
   * @type {string}
   * @memberof Filelink
   */
  private customDomain: string;

  /**
   * Class for generating tranformation urls
   * @param {(string | string[])} source - handle or multiple handles (ie for collage)
   * @param {string} [apikey] - your apikey - required fro all external sources
   *
   * @memberof Filelink
   */
  constructor(source: string | string[], apikey?: string) {
    // console.log('====================');
    this.source = source;
    const isExternal = this.isSourceExternal();

    if (isExternal && !apikey) {
      throw new FilestackError('External sources requires apikey to handle transforms');
    }

    if (!isExternal && typeof this.source === 'string' && !handleRegexp.test(this.source)) {
      throw new FilestackError('Invalid filestack source provided');
    }

    this.apikey = apikey;
  }

  setBase64(flag: boolean) {
    this.b64 = flag;
    return this;
  }

  setCname(cname: string) {
    this.cname = cname;
    return this;
  }

  /**
   * Set custom domain. Used for test purpose. It will be removed when after client.transform
   *
   * @param {string} domain
   * @returns
   * @memberof Filelink
   */
  setCustomDomain(domain: string) {
    this.customDomain = domain;
    return this;
  }

  getValidationSchema() {
    return TransformSchema;
  }

  /**
   * Returns transformations in JSON format
   *
   * @returns
   * @memberof Filelink
   */
  toJSON() {
    return this.transforms;
  }

  /**
   * Returns  transform url
   *
   * @returns
   * @memberof Filelink
   */
  toString() {
    const returnUrl = [];
    returnUrl.push(this.getCdnHost());

    if (this.isSourceExternal() && this.apikey) {
      returnUrl.push(this.apikey);
    }

    let transformsString = this.generateTransformString();

    let source = this.source;

    if (this.b64) {
      // console.log(JSON.stringify(this.transforms));
      if (this.transforms.length > 0) {
        transformsString = `b64/${btoa(JSON.stringify(this.transforms))}`;
      }

      if (Array.isArray(source)) {
        source = this.arrayToString(source);
      }
      source = `b64://${btoa(source)}`;
    } else {
      if (Array.isArray(source)) {
        source = this.arrayToString(source);
      } else {
        source = this.escapeValue(source);
      }
    }

    if (transformsString.length) {
      returnUrl.push(transformsString);
    }

    returnUrl.push(source);
    return returnUrl.join('/');
  }

  /**
   * Add task and validate
   *
   * @param {string} name
   * @param {*} [params]
   * @returns
   * @memberof Filelink
   */
  addTask(name: string, params?) {
    this.validateTask(name, params);

    if (name !== 'cache' && typeof params === 'boolean') {
      if (!params) {
        return this;
      } else {
        params = undefined;
      }
    } else if (typeof params === 'object' && !Object.keys(params).length) {
      params = undefined;
    }

    this.transforms.push({ name, params });
    return this;
  }

  /**
   * Transformations part
   */

  /**
   * Flips image
   *
   * @returns
   * @memberof Filelink
   */
  flip() {
    return this.addTask('flip');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  flop() {
    return this.addTask('flop');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  enchance() {
    return this.addTask('enchance');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  redeye() {
    return this.addTask('redeye');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  monochrome() {
    return this.addTask('monochrome');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  negative() {
    return this.addTask('negative');
    return this;
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  tags() {
    return this.addTask('tags');
  }

  /**
   *
   *
   * @returns
   * @memberof Filelink
   */
  sfw() {
    return this.addTask('swf');
  }

  /**
   *
   *
   * @param {StoreParams} params
   * @returns
   * @memberof Filelink
   */
  store(params: StoreParams) {
    return this.addTask('store', params);
  }

  /**
   *
   *
   * @param {(CacheParams | boolean)} params
   * @returns
   * @memberof Filelink
   */
  cache(params: CacheParams | boolean) {
    return this.addTask('cache', params);
  }

  resize(params: ResizeParams) {
    return this.addTask('resize', params);
  }

  crop(params: CropParams) {
    return this.addTask('crop', params);
  }

  rotate(params: RotateParams) {
    return this.addTask('rotate', params);
  }

  detectFaces(params: DetectFacesParams) {
    return this.addTask('detect_faces', params);
  }

  cropFaces(params: CropFacesParams) {
    return this.addTask('crop_faces', params);
  }

  PixelateFaces(params: PixelateFacesParams) {
    return this.addTask('pixelate_faces', params);
  }

  blurFaces(params: BlurFacesParams) {
    return this.addTask('blur_faces', params);
  }

  roundedCorners(params: RoundedCornersParams) {
    return this.addTask('rounded_corners', params);
  }

  polaroid(params: PolaroidParams) {
    return this.addTask('polarid', params);
  }

  vignette(params: VignetteParams) {
    return this.addTask('vignette', params);
  }

  tornEdges(params: TornEdgesParams) {
    return this.addTask('torn_edges', params);
  }

  shadow(params: ShadowParams) {
    return this.addTask('shadow', params);
  }

  circle(params: CircleParams) {
    return this.addTask('circle', params);
  }

  border(params: BorderParams) {
    return this.addTask('border', params);
  }

  sharpen(params: SharpenParams) {
    return this.addTask('sharpen', params);
  }

  blur(params: BlurParams) {
    return this.addTask('blur', params);
  }

  blackWhite(params: BlackWhiteParams) {
    return this.addTask('blackwhite', params);
  }

  sepia(params: SepiaParams) {
    return this.addTask('sepia', params);
  }

  pixelate(params: PixelateParams) {
    return this.addTask('pixelate', params);
  }

  oilPaint(params: OilPaintParams) {
    return this.addTask('oilpaint', params);
  }

  modulate(params: ModulateParams) {
    return this.addTask('modulate', params);
  }

  partialPixelate(params: PartialPixelateParams) {
    return this.addTask('partial_pixelate', params);
  }

  partialBlur(params: PartialBlurParams) {
    return this.addTask('partial_blur', params);
  }

  collage(params: CollageParams) {
    return this.addTask('collage', params);
  }

  Upscal(params: UpscaleParams) {
    return this.addTask('upscale', params);
  }

  ascii(params: AsciiParams) {
    return this.addTask('ascii', params);
  }

  quality(params: QualityParams) {
    return this.addTask('quality', params);
  }

  security(params: SecurityParams) {
    return this.addTask('security', params);
  }

  output(params: OutputParams) {
    return this.addTask('output', params);
  }

  videoConvert(params: VideoConvertParams) {
    return this.addTask('video_convert', params);
  }

  URLScreenshot(params: URLScreenshotParams) {
    return this.addTask('urlscreenshot', params);
  }

  pdfInfo(params: PdfInfoParams) {
    return this.addTask('pdfinfo', params);
  }

  pdfConvert(params: PdfConvertParams) {
    return this.addTask('pdfconvert', params);
  }

  private isSourceExternal(): boolean {
    if (!this.source) {
      throw new FilestackError('Source not Set');
    }

    let toTest = Array.isArray(this.source) ? this.source : [this.source];
    for (let i in toTest) {
      if (toTest[i].indexOf('src:') === 0 || toTest[i].indexOf('http') === 0) {
        return true;
      }
    }

    return false;
  }

  private validateTask(name, options): void {
    const toValidate = {};
    toValidate[name] = options;

    if (!this.validator(toValidate)) {
      throw new FilestackError(`Task "${name}" validation error, Params: ${JSON.stringify(options)}`, this.validator.errors);
    }

    return;
  }

  private getCdnHost(): string {
    let urls = config.urls;

    if (this.customDomain) {
      urls.cdnUrl = this.customDomain;
    }

    urls = resolveHost(urls, this.cname);

    return urls.cdnUrl;
  }

  /**
   * Returns applied transformations as string
   *
   * @private
   * @returns {string}
   * @memberof Filelink
   */
  private generateTransformString(): string {
    let transforms = [];

    this.transforms.forEach((el) => {
      transforms.push(this.optionToString(el.name, el.params));
    });

    return transforms.join('/');
  }

  /**
   * Flatten transformation option to string
   *
   * @private
   * @example {resize:{width: 100,height: 200}} => resize=width:100,height:200
   * @param key - option key
   * @param values - option params
   */
  private optionToString(key: string, values: any): string {
    let optionsString: string[] = [];
    // console.log(key, values, '======');
    if (typeof values === 'undefined') {
      return key;
    }

    if (typeof values === 'object' && !Object.keys(values).length) {
      return key;
    }

    // if we just want to enable feature
    if (typeof values === 'boolean') {
      if (!values) {
        if (key === 'cache') {
          return 'cache=false';
        }
        return '';
      }

      return key;
    }

    Object.keys(values).forEach((i) => {
      if (Array.isArray(values[i])) {
        optionsString.push(`${i}:${this.arrayToString(values[i])}`);
        return;
      }

      optionsString.push(`${i}:${this.escapeValue(values[i])}`);
    });

    return `${key}=${optionsString.join(',')}`;
  }

  private escapeValue (value: string): string {
    if (typeof value !== 'string') {
      return value;
    }

    if (value.indexOf('/') > -1) {
      return `"${value}"`;
    }

    return value;
  }

  /**
   * Converts nested arrays to string
   *
   * @private
   * @example [1,2, [2,3]] => "[1,2, [2,3]]"
   * @param arr - any array
   */
  private arrayToString(arr: any[]): string {
    const toReturn = arr.map((el) => {
      if (Array.isArray(el)) {
        return this.arrayToString(el);
      }

      return this.escapeValue(el);
    });

    return `[${toReturn}]`;
  }

}
