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
import { resolveHost, b64 } from './utils';
import { FilestackError, FilestackErrorType } from './../filestack_error';
import Debug from 'debug';

const debug = Debug('fs:filelink');

export enum Align {
  left = 'left',
  right = 'right',
  center = 'center',
  bottom = 'bottom',
  top = 'top',
  faces = 'faces',
  middle = 'middle',
}

/**
 * Align
 */
export type AlignOptions = Align | [Align.top | Align.middle | Align.bottom, Align.left | Align.center | Align.right];

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

export interface StoreBaseParams {
  location?: string;
  path?: string;
  container?: string;
  region?: string;
  access?: string;
  disableStorageKey?: boolean;
}

/**
 * Available options for store transformations
 *
 * @export
 * @interface StoreParams
 */
export type StoreParams = StoreBaseParams & {
  filename?: string;
  base64decode?: boolean;
};

export interface AnimationParams {
  delay?: number;
  loop?: number;
  width?: number;
  height?: number;
  fit?: FitOptions;
  align?: AlignOptions;
  background?: string;
}

export interface ResizeParams {
  width?: number;
  height?: number;
  fit?: FitOptions;
  align?: AlignOptions;
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

export interface CompressParams {
  metadata?: boolean;
}

export interface SharpenParams {
  amount: number;
}

export interface BlurParams {
  amount: number;
}

export interface BlackwhiteParams {
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

export enum EnhancePreset {
  auto = 'auto',
  vivid = 'vivid',
  beautify = 'beautify',
  beautifyPlus = 'beautify_plus',
  fixDark = 'fix_dark',
  fixNoise = 'fix_noise',
  fixTint = 'fix_tint',
  outdor = 'outdoor',
  fireworks = 'fireworks',
}
export interface EnhanceParams {
  preset?: EnhancePreset;
}

export interface PdfInfoParams {
  colorinfo?: boolean;
}

export interface PdfConvertParams {
  pageorientation?: string;
  pageformat?: string;
  pages?: (string | number)[];
}

export interface FallbackParams {
  handle: string;
  cache?: number;
}

export interface MinifyCssParams {
  gzip?: boolean;
  level?: number;
}

export interface MinifyJsParams {
  gzip?: boolean;
  use_babel_polyfill?: boolean;
  keep_fn_name?: boolean;
  keep_class_name?: boolean;
  mangle?: boolean;
  merge_vars?: boolean;
  remove_console?: boolean;
  remove_undefined?: boolean;
  targets?: null | string;
}

const handleRegexp = /^[\w\-]{20}|wf:\/\/[\w\-\/]{106}$/;

/**
 * Class for handling filelinks. For now its supports all filestack transforms.
 * It outputs transform url or array of transforms
 * @example
 * const link = new Filelink('handle or externalUrl', 'apikey');
 * link.flip().flop().store();
 *
 * console.log(link.toString());
 * // enable base64 support
 * link.setBase64(true)
 *
 * console.log(link.toString());
 *
 * @export
 * @class Filelink
 */
export class Filelink {
  /**
   * Validator instance
   *
   * @private
   * @memberof Filelink
   */
  private static validator = getValidator(TransformSchema);

  /**
   * Applied transforms array
   *
   * @private
   * @memberof Filelink
   */
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
   * should use a validator to check params of every task
   * @private
   * @type {boolean}
   * @memberof Filelink
   */
  private useValidator: boolean = true;

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
   * @param {(string | string[])} source - handle or multiple handles (i.e. for collage)
   * @param {string} [apikey] - your apikey - required for all external sources
   *
   * @memberof Filelink
   */
  constructor(source: string | string[], apikey?: string) {
    this.apikey = apikey;
    this.setSource(source);
  }

  /**
   * Enable new base64 link support to avoid problems with special chars in link
   *
   * @param {boolean} flag
   * @returns
   * @memberof Filelink
   */
  setBase64(flag: boolean) {
    this.b64 = flag;
    return this;
  }

  /**
   * Switch the useValidator flag
   *
   * @param {boolean} flag
   * @returns
   * @memberof Filelink
   */
  setUseValidator(flag: boolean) {
    this.useValidator = flag;
    return this;
  }

  /**
   * Set cname for transformation link
   *
   * @param {string} cname
   * @returns
   * @memberof Filelink
   */
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

  setSource(source: string | string[]) {
    this.source = source;

    const isExternal = this.isSourceExternal();

    debug(`Source ${source} - isExternal? ${isExternal}`);

    if (isExternal && !this.apikey) {
      throw new FilestackError('External sources requires apikey to handle transforms');
    }

    if (!isExternal && typeof this.source === 'string' && (!handleRegexp.test(this.source) && this.source.indexOf('filestackcontent') === -1)) {
      throw new FilestackError('Invalid filestack source provided');
    }
  }

  /**
   * Returns JSONSchema form transformations params
   *
   * @returns
   * @memberof Filelink
   */
  getValidationSchema() {
    return TransformSchema;
  }

  /**
   * Returns transformations in JSON format
   *
   * @returns
   * @memberof Filelink
   */
  getTransformations() {
    if (this.useValidator) {
      this.validateTasks(this.transforms);
    }
    return this.transforms;
  }

  /**
   * Returns transform url
   *
   * @returns
   * @memberof Filelink
   */
  toString() {
    const returnUrl = [];
    returnUrl.push(this.getCdnHost());

    if (this.useValidator) {
      this.validateTasks(this.transforms);
    }

    if (this.apikey) {
      returnUrl.push(this.apikey);
    }

    let transformsString = this.generateTransformString();

    let source = this.source;

    if (this.b64) {
      if (this.transforms.length > 0) {
        transformsString = `b64/${b64(JSON.stringify(this.transforms), true)}`;
      }

      if (Array.isArray(source)) {
        source = this.arrayToString(source);
      }

      source = `b64://${b64(source, true)}`;
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
    Debug(`Add task  ${name} with params %O`, params);

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
   * Returns all tasks added for transformation
   *
   * @memberof Filelink
   */
  getTasks() {
    return this.transforms;
  }

  /**
   * Cleanup transformations on filelink
   *
   * @returns
   * @memberof Filelink
   */
  reset() {
    this.transforms = [];
    return this;
  }

  /**
   * Transformations part
   */

  /**
   * Add autoimage transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#auto-image-conversion
   * @returns this
   * @memberof Filelink
   */
  autoImage() {
    return this.addTask('auto_image', true);
  }

  /**
   * Adds flip transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#flip
   * @returns this
   * @memberof Filelink
   */
  flip() {
    return this.addTask('flip', true);
  }

  /**
   * Adds flop transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#flop
   * @returns this
   * @memberof Filelink
   */
  flop() {
    return this.addTask('flop', true);
  }

  /**
   * Adds enhance transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#enhance
   * @returns this
   * @memberof Filelink
   */
  enhance(params?: EnhanceParams) {
    return this.addTask('enhance', params || true);
  }

  /**
   * Add security to link
   *
   * @see https://www.filestack.com/docs/api/processing/#redeye
   * @returns
   * @memberof Filelink
   */
  redeye() {
    return this.addTask('redeye', true);
  }

  /**
   * Add monochrome transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#monochrome
   * @returns this
   * @memberof Filelink
   */
  monochrome() {
    return this.addTask('monochrome', true);
  }

  /**
   * Add compress transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#compress
   * @returns this
   * @memberof Filelink
   */
  compress(params?: CompressParams) {
    return this.addTask('compress', params || true);
  }

  /**
   * Adds negative transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#negative
   * @returns this
   * @memberof Filelink
   */
  negative() {
    return this.addTask('negative', true);
  }

  /**
   * Adds tags transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#tags
   * @returns this
   * @memberof Filelink
   */
  tags() {
    return this.addTask('tags', true);
  }

  /**
   * Adds sfw transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#sfw
   * @returns this
   * @memberof Filelink
   */
  sfw() {
    return this.addTask('sfw', true);
  }

  /**
   * Add animate transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#animate-images-to-gif
   * @param params
   * @returns this
   * @memberof Filelink
   */
  animate(params: AnimationParams) {
    return this.addTask('animate', params);
  }

  /**
   * Adds store transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#store
   * @param {(StoreParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  store(params?: StoreParams | boolean) {
    return this.addTask('store', params);
  }

  /**
   * Adds cache transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#cache
   * @param {(CacheParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  cache(params: CacheParams | boolean) {
    return this.addTask('cache', params);
  }

  /**
   * Adds resize transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#resize
   * @param {ResizeParams} params
   * @returns this
   * @memberof Filelink
   */
  resize(params: ResizeParams) {
    return this.addTask('resize', params);
  }

  /**
   * Adds crop transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#crop
   * @param {CropParams} params
   * @returns this
   * @memberof Filelink
   */
  crop(params: CropParams) {
    return this.addTask('crop', params);
  }

  /**
   * Adds rotate transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#rotate
   * @param {RotateParams} params
   * @returns this
   * @memberof Filelink
   */
  rotate(params: RotateParams) {
    return this.addTask('rotate', params);
  }

  /**
   * Adds detect_faces transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#facial-detection
   * @param {(DetectFacesParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  detectFaces(params?: DetectFacesParams | boolean) {
    return this.addTask('detect_faces', params);
  }

  /**
   * Adds crop faces transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#crop-faces
   * @param {CropFacesParams} params
   * @returns this
   * @memberof Filelink
   */
  cropFaces(params: CropFacesParams) {
    return this.addTask('crop_faces', params);
  }

  /**
   * Adds pixelate faces transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#pixelate-faces
   * @param {PixelateFacesParams} params
   * @returns this
   * @memberof Filelink
   */
  pixelateFaces(params: PixelateFacesParams) {
    return this.addTask('pixelate_faces', params);
  }

  /**
   * Adds blur faces transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#blur-faces
   * @param {BlurFacesParams} params
   * @returns this
   * @memberof Filelink
   */
  blurFaces(params: BlurFacesParams) {
    return this.addTask('blur_faces', params);
  }

  /**
   * Adds rounded corners transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#rounded-corners
   * @param {(RoundedCornersParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  roundedCorners(params?: RoundedCornersParams | boolean) {
    return this.addTask('rounded_corners', params);
  }

  /**
   * Adds polaroid transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#polaroid
   * @param {(PolaroidParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  polaroid(params?: PolaroidParams | boolean) {
    return this.addTask('polaroid', params);
  }

  /**
   * Adds vignette transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#vignette
   * @param {(VignetteParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  vignette(params?: VignetteParams | boolean) {
    return this.addTask('vignette', params);
  }

  /**
   * Adds torn edges transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#torn-edges
   * @param {(TornEdgesParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  tornEdges(params?: TornEdgesParams | boolean) {
    return this.addTask('torn_edges', params);
  }

  /**
   * Adds shadow transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#shadow
   * @param {(ShadowParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  shadow(params?: ShadowParams | boolean) {
    return this.addTask('shadow', params);
  }

  /**
   * Adds circle transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#circle
   * @param {(CircleParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  circle(params?: CircleParams | boolean) {
    return this.addTask('circle', params);
  }

  /**
   * Adds border transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#border
   * @param {(BorderParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  border(params?: BorderParams | boolean) {
    return this.addTask('border', params);
  }

  /**
   * Adds sharpen transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#sharpen
   * @param {(SharpenParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  sharpen(params?: SharpenParams | boolean) {
    return this.addTask('sharpen', params);
  }

  /**
   * Adds blur transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#blur
   * @param {(BlurParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  blur(params?: BlurParams | boolean) {
    return this.addTask('blur', params);
  }

  /**
   * Adds blackwhite transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#blackwhite
   * @param {(BlackwhiteParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  blackwhite(params?: BlackwhiteParams | boolean) {
    return this.addTask('blackwhite', params);
  }

  /**
   * Adds sepia transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#sepia
   * @param {(SepiaParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  sepia(params?: SepiaParams | boolean) {
    return this.addTask('sepia', params);
  }

  /**
   * Adds pixelate transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#pixelate
   * @param {(PixelateParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  pixelate(params?: PixelateParams | boolean) {
    return this.addTask('pixelate', params);
  }

  /**
   * Adds oilpaint transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#oil-paint
   * @param {(OilPaintParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  oilPaint(params?: OilPaintParams | boolean) {
    return this.addTask('oil_paint', params);
  }

  /**
   * Adds modulate transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#modulate
   * @param {(ModulateParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  modulate(params?: ModulateParams | boolean) {
    return this.addTask('modulate', params);
  }

  /**
   * Adds partial pixelate transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#partial-pixelate
   * @param {PartialPixelateParams} params
   * @returns this
   * @memberof Filelink
   */
  partialPixelate(params: PartialPixelateParams) {
    return this.addTask('partial_pixelate', params);
  }

  /**
   * Adds partial blur transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#partial-blur
   * @param {PartialBlurParams} params
   * @returns this
   * @memberof Filelink
   */
  partialBlur(params: PartialBlurParams) {
    return this.addTask('partial_blur', params);
  }

  /**
   * Adds collage transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#collage
   * @param {CollageParams} params
   * @returns this
   * @memberof Filelink
   */
  collage(params: CollageParams) {
    return this.addTask('collage', params);
  }

  /**
   * Adds upscale transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#upscale
   * @param {(UpscaleParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  upscale(params?: UpscaleParams | boolean) {
    return this.addTask('upscale', params);
  }

  /**
   * Adds ascii transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#ascii
   * @param {(AsciiParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  ascii(params?: AsciiParams | boolean) {
    return this.addTask('ascii', params);
  }

  /**
   * Adds quality transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#quality
   * @param {QualityParams} params
   * @returns this
   * @memberof Filelink
   */
  quality(params: QualityParams) {
    return this.addTask('quality', params);
  }

  /**
   * Adds security transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#security
   * @param {SecurityParams} params
   * @returns this
   * @memberof Filelink
   */
  security(params: SecurityParams) {
    return this.addTask('security', params);
  }

  /**
   * Adds output transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#output
   * @param {OutputParams} params
   * @returns this
   * @memberof Filelink
   */
  output(params: OutputParams) {
    return this.addTask('output', params);
  }

  /**
   * Adds video convert transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#video-convert
   * @param {VideoConvertParams} params
   * @returns this
   * @memberof Filelink
   */
  videoConvert(params: VideoConvertParams) {
    return this.addTask('video_convert', params);
  }

  /**
   * Adds URLScreenshot transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#urlscreenshot
   * @param {(URLScreenshotParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  URLScreenshot(params?: URLScreenshotParams | boolean) {
    return this.addTask('urlscreenshot', params);
  }

  /**
   * Adds pdfinfo transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#pdfinfo
   * @param {(PdfInfoParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  PDFInfo(params?: PdfInfoParams | boolean) {
    return this.addTask('pdfinfo', params);
  }

  /**
   * Adds pdfconvert transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#pdfconvert
   * @param {(PdfConvertParams | boolean)} params
   * @returns this
   * @memberof Filelink
   */
  PDFConvert(params?: PdfConvertParams | boolean) {
    return this.addTask('pdfconvert', params);
  }

  /**
   * Adds fallback transformation
   *
   * @see https://www.filestack.com/docs/api/processing/#fallback
   * @param {(FallbackParams)} params
   * @returns this
   * @memberof Filelink
   */
  fallback(params: FallbackParams) {
    return this.addTask('fallback', params);
  }

  /**
   * Add zip transformation which create a zip package on files
   * used on actual context
   *
   * @see https://www.filestack.com/docs/api/processing/#zip
   * @returns this
   * @memberof Filelink
   */
  zip() {
    return this.addTask('zip', true);
  }

  /**
   * Add task which minify a css file
   *
   * @returns this
   * @memberof Filelink
   */
  minifyCss(params: MinifyCssParams) {
    return this.addTask('minify_css', params);
  }

  /**
   * Add task which minify a javascript file.
   * For better handling of 'targets' param, use with b64 flag enabled.
   *
   * @returns this
   * @memberof Filelink
   */
  minifyJs(params: MinifyJsParams) {
    return this.addTask('minify_js', params);
  }

  /**
   * Checks if source is external
   *
   * @private
   * @returns {boolean}
   * @memberof Filelink
   */
  private isSourceExternal(): boolean {
    if (!this.source) {
      throw new FilestackError('Source not Set');
    }

    let toTest = Array.isArray(this.source) ? this.source : [this.source];
    for (let i in toTest) {
      /* istanbul ignore next */
      if (!toTest.hasOwnProperty(i)) {
        continue;
      }

      if (toTest[i].indexOf('src:') === 0 || (toTest[i].indexOf('http') === 0 && toTest[i].indexOf('filestackcontent') === -1)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate every task against schema
   *
   * @private
   * @param {object[]} transformations - object which contain all transformations
   * @returns {void}
   * @memberof Filelink
   */
  private validateTasks(transformations: object[]): void {
    const res = Filelink.validator(this.arrayToObject(transformations, 'name', 'params'));
    if (res.errors.length) {
      throw new FilestackError(`Params validation error`, res.errors, FilestackErrorType.VALIDATION);
    }

    return;
  }

  /**
   * Returns correct cdn url with cname support
   *
   * @private
   * @returns {string}
   * @memberof Filelink
   */
  private getCdnHost(): string {
    let urls = Object.assign({}, config.urls);

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
    if (typeof values === 'undefined') {
      return key;
    }

    // if we just want to enable feature
    if (typeof values === 'boolean') {
      if (!values && key === 'cache') {
        return 'cache=false';
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

  /**
   * Escape params values
   *
   * @private
   * @param {string} value
   * @returns {string}
   * @memberof Filelink
   */
  private escapeValue(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }

    if (value.indexOf('/') > -1 || value.indexOf(',') > -1) {
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

  /**
   * Converts array of objects to object
   *
   * @private
   * @example [{name: 'resize', params: {height: 125}}] => {resize: {height: 125}}
   * @param arr - any array
   */
  private arrayToObject = (array: object[] = [], nameKey: string, dataKey: string) => {
    return array.reduce((obj, item) => {
      obj[item[nameKey]] = item[dataKey];
      return obj;
    }, {});
  }
}
