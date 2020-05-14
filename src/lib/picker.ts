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

import { loadModule, FILESTACK_MODULES } from '@filestack/loader';
import { FilestackError, FilestackErrorType } from './../filestack_error';
import { Client } from './client';
import { FSProgressEvent, UploadOptions, WorkflowConfig } from './api/upload/types';
import { getValidator, PickerParamsSchema } from './../schema';

export interface PickerInstance {
  /**
   * Close picker. This operation is idempotent.
   */
  close: () => Promise<void>;

  /**
   * Cancel picker uploads. This operation is idempotent.
   */
  cancel: () => Promise<void>;

  /**
   * Open picker. This operation is idempotent.
   */
  open: () => Promise<void>;

  /**
   * Specify a list of files to open in the picker for cropping
   *
   * ### Example
   *
   * ```js
   * // <input id="fileSelect" type="file">
   *
   * const inputEl = document.getElementById('fileSelect');
   * const picker = client.picker({
   *   onUploadDone: res => console.log(res),
   * });
   *
   * inputEl.addEventListener('change', (e) => {
   *   picker.crop(e.target.files);
   * });
   *
   * // Or pass an array of URL strings
   * const urls = [
   *   'https://d1wtqaffaaj63z.cloudfront.net/images/fox_in_forest1.jpg',
   *   'https://d1wtqaffaaj63z.cloudfront.net/images/sail.jpg',
   * ];
   * picker.crop(urls);
   * ```
   */
  crop: (files: any[]) => Promise<void>;
}

export interface PickerCroppedData {
  cropArea: {
    /**
     * [x, y]
     */
    position: [number, number];
    /**
     * [width, height]
     */
    size: [number, number];
  };
    /**
     * [width, height]
     */
  originalImageSize: [number, number];
}

export enum RotateDirection {
  cw = 'CW',
  ccw= 'CCW',
}

export interface PickerRotatedData {
  /**
   * Amount rotated in degrees.
   */
  value: number;
  /**
   * Can be CW or CCW (clockwise / counter-clockwise)
   */
  direction: RotateDirection;
}

export interface PickerFileMetadata {
  /**
   * The cloud container for the uploaded file.
   */
  container?: string;
  /**
   * Position and size information for cropped images.
   */
  cropped?: PickerCroppedData;
  /**
   * Name of the file.
   */
  filename: string;
  /**
   * Filestack handle for the uploaded file.
   */
  handle: string;
  /**
   * The hash-prefixed cloud storage path.
   */
  key?: string;
  /**
   * The MIME type of the file.
   */
  mimetype: string;
  /**
   * Properties of the local binary file. Also see the pick option `exposeOriginalFile` if you want the underlying `File` object.
   */
  originalFile?: object | File;
  /**
   * The origin of the file, e.g. /Folder/file.jpg.
   */
  originalPath: string;
  /**
   * Direction and value information for rotated images.
   */
  rotated?: PickerRotatedData;
  /**
   * Size in bytes of the uploaded file.
   */
  size: number;
  /**
   * The source from where the file was picked.
   */
  source: string;
  /**
   * Indicates Filestack transit status.
   */
  status?: string;
  /**
   * A uuid for tracking this file in callbacks.
   */
  uploadId: string;
  /**
   * The Filestack CDN URL for the uploaded file.
   */
  url: string;
}

export interface CustomAuthTextOptions {
  [key: string]: {
    top?: string[],
    bottom?: string[]
  };
}

export interface PickerResponse {
  filesUploaded: PickerFileMetadata[];
  filesFailed: PickerFileMetadata[];
}

export interface PickerFileCallback {
  (file: PickerFileMetadata): void | Promise<any>;
}

export interface PickerFileErrorCallback {
  (file: PickerFileMetadata, error: Error): void;
}

export interface PickerFileProgressCallback {
  (file: PickerFileMetadata, event: FSProgressEvent): void;
}

export interface PickerUploadStartedCallback {
  (files: PickerFileMetadata[]): void;
}

export interface PickerUploadDoneCallback {
  (files: PickerResponse): void;
}

export enum PickerDisplayMode {
  inline = 'inline',
  overlay = 'overlay',
  dropPane = 'dropPane',
}

export interface PickerDropPaneOptions {
  /**
   * Toggle the crop UI for dropped files.
   */
  cropFiles?: boolean;
  /**
   * Customize the text content in the drop pane.
   */
  customText?: string;
  /**
   * Disable the file input on click. This does not disable the `onClick` callback.
   */
  disableClick?: boolean;
  /**
   * Toggle the full-page drop zone overlay.
   */
  overlay?: boolean;
  onDragEnter?: (evt: DragEvent) => void;
  onDragLeave?: () => void;
  onDragOver?: (evt: DragEvent) => void;
  onDrop?: (evt: DragEvent) => void;
  /**
   * `onSuccess` must be used instead of `onUploadDone`. The drop pane uses its own callbacks for compatibility purposes. This might eventually change.
   */
  onSuccess?: (files: PickerFileMetadata[]) => void;
  onError?: (files: PickerFileMetadata[]) => void;
  onProgress?: (percent: number) => void;
  onClick?: (evt: any) => void;
  /**
   * Toggle icon element in drop pane.
   */
  showIcon?: boolean;
  /**
   * Toggle upload progress display.
   */
  showProgress?: boolean;
}

export interface PickerStoreOptions {
  /**
   * Location for stored file. One of 's3', 'gcs', 'azure', 'rackspace', or 'dropbox'.
   */
  location?: string;
  /**
   * Specify storage container.
   */
  container?: string;
  /**
   * Set container path. Indicate a folder by adding a trailing slash. Without a trailing slash all files will be stored to the same object.
   */
  path?: string;
  /**
   * Specify S3 region.
   */
  region?: string;
  /**
   * S3 container access. 'public' or 'private'.
   */
  access?: string;

  /**
   * Workflows ids to run after upload
   */
  workflows?: string[] | WorkflowConfig[];
}

export interface PickerCustomText {
  // Actions
  Upload?: string;
  'Upload more'?: string;
  'Deselect All'?: string;
  'View/Edit Selected'?: string;
  'Sign Out'?: string;

  // Source Labels
  'My Device'?: string;
  'Web Search'?: string;
  'Take Photo'?: string;
  'Link (URL)'?: string;
  'Record Video'?: string;
  'Record Audio'?: string;

  // Custom Source
  'Custom Source'?: string;

  // Footer Text
  Add?: string;
  'more file'?: string;
  'more files'?: string;

  // Cloud
  'Connect {providerName}'?: string;
  'Select Files from {providerName}'?: string;
  'You need to authenticate with {providerName}.'?: string;
  'A new page will open to connect your account.'?: string;
  'We only extract images and never modify or delete them.'?: string;
  'To disconnect from {providerName} click "Sign out" button in the menu.'?: string;
  'Sign in with Google'?: string;
  'Go back'?: string;
  'This folder is empty.'?: string;

  // Summary
  Files?: string;
  Images?: string;
  Uploaded?: string;
  Uploading?: string;
  Completed?: string;
  Filter?: string;
  'Cropped Images'?: string;
  'Edited Images'?: string;
  'Selected Files'?: string;
  'Crop is required on images'?: string;

  // Transform
  Crop?: string;
  Circle?: string;
  Rotate?: string;
  Mask?: string;
  Revert?: string;
  Edit?: string;
  Reset?: string;
  Done?: string;
  Save?: string;
  Next?: string;
  'Edit Image'?: string;
  'This image cannot be edited'?: string;

  // Retry messaging
  'Connection Lost'?: string;
  'Failed While Uploading'?: string;
  'Retrying in'?: string;
  'Try again'?: string;
  'Try now'?: string;

  // Local File Source
  'Drag and Drop, Copy and Paste Files'?: string;
  'or Drag and Drop, Copy and Paste Files'?: string;
  'Select Files to Upload'?: string;
  'Select From'?: string;
  'Drop your files anywhere'?: string;

  // Input placeholders
  'Enter a URL'?: string;
  'Search images'?: string;

  // Webcam Source
  'Webcam Disabled'?: string;
  'Webcam Not Supported'?: string;
  'Please enable your webcam to take a photo.'?: string;
  'Your current browser does not support webcam functionality.'?: string;
  'We suggest using Chrome or Firefox.'?: string;

  // Error Notifications
  'File {displayName} is not an accepted file type. The accepted file types are {types}'?: string;
  'File {displayName} is too big. The accepted file size is less than {roundFileSize}'?: string;
  'Our file upload limit is {maxFiles} {filesText}'?: string;
  'No search results found for "{search}"'?: string;
  'An error occurred. Please try again.'?: string;
}

export interface PickerOptions {
  /**
   * Restrict file types that are allowed to be picked. Formats accepted:
   *  - .pdf <- any file extension
   *  - image/jpeg <- any mime type commonly known by browsers
   *  - image/* <- accept all types of images
   *  - video/* <- accept all types of video files
   *  - audio/* <- accept all types of audio files
   *  - application/* <- accept all types of application files
   *  - text/* <- accept all types of text files
   */
  accept?: string | string[];
  /**
   * Prevent modal close on upload failure and allow users to retry.
   */
  allowManualRetry?: boolean;
  /**
   *  Valid sources are:
   *  - local_file_system - Default
   *  - url - Default
   *  - imagesearch - Default
   *  - facebook - Default
   *  - instagram - Default
   *  - googledrive - Default
   *  - dropbox - Default
   *  - webcam - Uses device menu on mobile. Not currently supported in Safari and IE.
   *  - video - Uses device menu on mobile. Not currently supported in Safari and IE.
   *  - audio - Uses device menu on mobile. Not currently supported in Safari and IE.
   *  - box
   *  - github
   *  - gmail
   *  - picasa
   *  - onedrive
   *  - onedriveforbusiness
   *  - customsource - Configure this in your Filestack Dev Portal.
   */
  fromSources?: string[];
  /**
   * Container where picker should be appended. Only relevant for `inline` and `dropPane` display modes.
   */
  container?: string | Node;

  /**
   * Turn on cleaning JPEG image exif. Method can keep image orientation or color profiles
   * ```javascript
   * cleanupImageExif: {
   *   keepOrientation: true
   *   keepICCandAPP: true
   * }
   * ```
   */
  cleanupImageExif?: boolean | {
    keepOrientation?: boolean,
    keepICCandAPP?: boolean
  };
  /**
   * Customize the text on the cloud authentication screen in Picker.
   * Use a cloud source name (see [[PickerOptions.fromSources]])
   * or a 'default' as a key, then put your custom notice or consent
   * to the 'top' or the 'bottom' key to show it respectivly above or under 'Connect button'.
   *
   * ```javascript
   * customAuthText: {
   *   // use it for every cloud authentication screen
   *   default: {
   *     top: [
   *       'default top first line',
   *       'default top second line'
   *     ],
   *     bottom: [
   *       'default bottom first line',
   *       'default bottom second line'
   *     ]
   *   },
   *   // override a default bottom text for only gmail
   *   gmail: {
   *     bottom: [
   *       'We need your permission to access your data and',
   *       'process it with our machine learning system.'
   *     ]
   *   }
   * }
   * ```
   */
  customAuthText?: CustomAuthTextOptions;
  /**
   * Picker display mode, one of `'inline'`, `'overlay'`, `'dropPane'` - default is `'overlay'`.
   */
  displayMode?: PickerDisplayMode;
  /**
   * Max number of files to upload concurrently. Default is 4.
   */
  concurrency?: number;
  /**
   * Set the default container for your custom source.
   */
  customSourceContainer?: string;
  /**
   * Set the default path for your custom source container.
   */
  customSourcePath?: string;
  /**
   * Set the display name for the custom source.
   */
  customSourceName?: string;
  /**
   * Provide an object for mapping picker strings to your own strings.
   * Strings surrounded by brackets, `{ foobar }`, are interpolated with runtime values.
   * Source labels are also available to override, e.g. Facebook, Instagram, Dropbox, etc.
   */
  customText?: PickerCustomText;
  /**
   * set support email to display in case of error
   */
  supportEmail?: string;
  /**
   * When true removes the hash prefix on stored files.
   */
  disableStorageKey?: boolean;
  /**
   * When true removes ability to edit images.
   */
  disableTransformer?: boolean;
  /**
   * Disables local image thumbnail previews in the summary screen.
   */
  disableThumbnails?: boolean;
  /**
   * Configure the drop pane behavior, i.e. when `displayMode` is `dropPane`.
   */
  dropPane?: PickerDropPaneOptions;
  /**
   * When true the `originalFile` metadata will be the actual `File` object instead of a POJO
   */
  exposeOriginalFile?: boolean;
  /**
   * Toggle the drop zone to be active on all views. Default is active only on local file source.
   */
  globalDropZone?: boolean;
  /**
   * Hide the picker modal UI once uploading begins. Defaults to `false`.
   */
  hideModalWhenUploading?: boolean;

  /**
   * Specify image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
   * Local and cropped images will be resized (upscaled or downscaled) to the specified dimensions before uploading.
   * The original height to width ratio is maintained. To resize all images based on the width, set [width, null], e.g. [800, null].
   * For the height set [null, height], e.g. [null, 600].
   */
  imageDim?: [number, number];
  /**
   * Specify maximum image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
   * Images bigger than the specified dimensions will be resized to the maximum size while maintaining the original aspect ratio.
   * The output will not be exactly 800x600 unless the imageMax matches the aspect ratio of the original image.
   */
  imageMax?: [number, number];
  /**
   * Specify minimum image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
   * Images smaller than the specified dimensions will be upscaled to the minimum size while maintaining the original aspect ratio.
   * The output will not be exactly 800x600 unless the imageMin matches the aspect ratio of the original image.
   */
  imageMin?: [number, number];
  /**
   * Sets locale. Accepts: ca, da, de, en, es, fr, he, it, ja, ko, nl, no, pl, pt, sv, ru, vi, zh, tr
   */
  lang?: string;
  /**
   * Minimum number of files required to start uploading. Defaults to 1.
   */
  minFiles?: number;
  /**
   * Maximum number of files allowed to upload. Defaults to 1.
   */
  maxFiles?: number;
  /**
   * Restrict selected files to a maximum number of bytes. (e.g. 10 \* 1024 \* 1024 for 10MB limit).
   */
  maxSize?: number;

  /**
   * Default view type option for file browser
   */
  viewType?: 'grid' | 'list';

  /**
   * Timeout for error messages
   */
  errorsTimeout?: number;
  /**
   * Specify [width, height] in pixels of the desktop modal.
   */
  modalSize?: [number, number];
  /**
   * Called when all uploads in a pick are cancelled.
   */
  onCancel?: PickerUploadDoneCallback;
  /**
   * Called when the UI is exited.
   */
  onClose?: () => void;
  /**
   * Called when the UI is mounted.
   * @param PickerInstance application handle
   */
  onOpen?: (handle: PickerInstance) => void;
  /**
   * Called whenever user selects a file.
   * ### Example
   *
   * ```js
   * // Using to veto file selection
   * // If you throw any error in this function it will reject the file selection.
   * // The error message will be displayed to the user as an alert.
   * onFileSelected(file) {
   *   if (file.size > 1000 * 1000) {
   *     throw new Error('File too big, select something smaller than 1MB');
   *   }
   * }
   *
   * // Using to change selected file name
   * // NOTE: This currently only works for local uploads
   * onFileSelected(file) {
   *   // It's important to return a new file by the end of this function.
   *   return { ...file, name: 'foo' };
   * }
   * ```
   *
   * The callback function can also return a Promise to allow asynchronous validation logic.
   * You can pass a file object to `resolve` for changing the file name, it will behave the same as when
   * the file is returned from the non-async callback.
   *
   * ```js
   * onFileSelected(file) {
   *   return new Promise((resolve, reject) => {
   *     // Do something async
   *     resolve();
   *     // Or reject the selection with reject()
   *   });
   * }
   * ```
   */
  onFileSelected?: PickerFileCallback;
  /**
   * Called when a file begins uploading.
   */
  onFileUploadStarted?: PickerFileCallback;
  /**
   * Called when a file is done uploading.
   */
  onFileUploadFinished?: PickerFileCallback;
  /**
   * Called when uploading a file fails.
   */
  onFileUploadFailed?: PickerFileErrorCallback;
  /**
   * Called during multi-part upload progress events. Local files only.
   */
  onFileUploadProgress?: PickerFileProgressCallback;
  /**
   * Called when file is cropped in picker
   */
  onFileCropped?: PickerFileCallback;
  /**
   * Called when uploading starts (user initiates uploading).
   */
  onUploadStarted?: PickerUploadStartedCallback;
  /**
   * Called when all files have been uploaded.
   */
  onUploadDone?: PickerUploadDoneCallback;

  /**
   * Define a unique id for the application mount point.
   * May be useful for more advanced use cases.
   * For example, if you wish to have more than one picker instance open at once,
   * then each will need their own unique rootId.
   *
   * **Note:** This option is ignored when `displayMode` is `dropPane`.
   */
  rootId?: string;
  /**
   * Whether to start uploading automatically when maxFiles is hit. Defaults to `false`.
   */
  startUploadingWhenMaxFilesReached?: boolean;
  /**
   * Options for file storage.
   */
  storeTo?: PickerStoreOptions;
  /**
   * Specify options for images passed to the crop UI.
   */
  transformations?: PickerTransformationOptions;
  /**
   * Options for local file uploads.
   */
  uploadConfig?: UploadOptions;
  /**
   * Start uploading immediately on file selection. Defaults to `true`.
   * @important The feature is can be enabled only if crop is disabled - disableTransformer: true
   */
  uploadInBackground?: boolean;
  /**
   * Sets the resolution of recorded video. One of "320x240", "640x480" or "1280x720". Default is `"640x480"`.
   */
  videoResolution?: string;
  /**
   * Use Sentry Breadcrumbs mechanism to log information about occured errors.
   * It can override global objects like console, error etc. Defaults to `true`.
   */
  useSentryBreadcrumbs?: boolean;
}

export interface PickerCropOptions {
  /**
   * Maintain aspect ratio for crop selection. (e.g. 16/9, 800/600).
   */
  aspectRatio?: number;
  /**
   * Force all images to be cropped before uploading.
   */
  force?: boolean;
}

export interface PickerTransformationOptions {
  /**
   * Enable crop. Defaults to `true`.
   */
  crop?: boolean | PickerCropOptions;
  /**
   * Enable circle crop. Disabled if crop.aspectRatio is defined and not 1. Converts to PNG. Defaults to `true`.
   */
  circle?: boolean;
  /**
   * Enable image rotation. Defaults to `true`.
   */
  rotate?: boolean;

  /**
   * Global force crop option. Can be use ie with circle
   */
  force?: boolean;
}

/**
 * @private
 * A synchronous-looking wrapper for loading the picker and calling its methods.
 * This is currently needed because the picker module is loaded asynchronously.
 * Eventually we should offer a bundle with the picker module included.
 */
class PickerLoader {

  private _initialized: Promise<PickerInstance>;
  constructor(client: Client, options?: PickerOptions) {
    const validateRes = getValidator(PickerParamsSchema)(options);

    if (validateRes.errors.length) {
      throw new FilestackError(`Invalid picker params`, validateRes.errors, FilestackErrorType.VALIDATION);
    }

    this._initialized = this.loadModule(client, options);
  }

  async open(): Promise<void> {
    const picker = await this._initialized;
    await picker.open();
  }

  async crop(files: any[]): Promise<void> {
    const picker = await this._initialized;
    await picker.crop(files);
  }

  async close(): Promise<void> {
    const picker = await this._initialized;
    await picker.close();
  }

  async cancel(): Promise<void> {
    const picker = await this._initialized;
    await picker.cancel();
  }

  private async loadModule(client: Client, options?: PickerOptions): Promise<PickerInstance> {
    const { session: { urls: { pickerUrl: url } } } = client;
    const Picker = await loadModule(FILESTACK_MODULES.PICKER, url);
    return new Picker(client, options);
  }
}

/**
 * Loads and creates picker instance
 *
 * @private
 * @param client
 * @param options
 */
export const picker = (client: Client, options?: PickerOptions): PickerInstance => {
  return new PickerLoader(client, options);
};
