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

import { EventEmitter } from 'eventemitter3';
import * as Sentry from '@sentry/minimal';
import { config, Hosts } from '../config';
import { FilestackError } from './../filestack_error';
import { metadata, MetadataOptions, remove, retrieve, RetrieveOptions } from './api/file';
import { transform, TransformOptions } from './api/transform';
import { storeURL } from './api/store';
import { resolveHost, getVersion } from './utils';
import { Upload, InputFile, UploadOptions, StoreUploadOptions, UploadTags } from './api/upload';
import { preview, PreviewOptions } from './api/preview';
import { CloudClient } from './api/cloud';
import { Prefetch, PrefetchResponse, PrefetchOptions } from './api/prefetch';
import { StoreParams } from './filelink';

import { picker, PickerInstance, PickerOptions } from './picker';

/* istanbul ignore next */
Sentry.addBreadcrumb({ category: 'sdk', message: 'filestack-js-sdk scope' });

export interface Session {
  apikey: string;
  urls: Hosts;
  cname?: string;
  policy?: string;
  signature?: string;
  prefetch?: PrefetchResponse;
}

export interface Security {
  policy: string;
  signature: string;
}

export interface ClientOptions {
  [option: string]: any;
  /**
   * Security object with policy and signature keys.
   * Can be used to limit client capabilities and protect public URLs.
   * It is intended to be used with server-side policy and signature generation.
   * Read about [security policies](https://www.filestack.com/docs/concepts/security).
   */
  security?: Security;
  /**
   * Domain to use for all URLs. __Requires the custom CNAME addon__.
   * If this is enabled then you must also set up your own OAuth applications
   * for each cloud source you wish to use in the picker.
   */
  cname?: string;
  /**
   * Enable/disable caching of the cloud session token. Default is false.
   * This ensures that users will be remembered on your domain when calling the cloud API from the browser.
   * Please be aware that tokens stored in localStorage are accessible by other scripts on the same domain.
   */
  sessionCache?: boolean;

  /**
   * Enable forwarding error logs to sentry
   * @default false
   */
  forwardErrors?: boolean;
}

/**
 * The Filestack client, the entry point for all public methods. Encapsulates session information.
 *
 * ### Example
 * ```js
 * // ES module
 * import * as filestack from 'filestack-js';
 * const client = filestack.init('apikey');
 * ```
 *
 * ```js
 * // UMD module in browser
 * <script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
 * const client = filestack.init('apikey');
 * ```
 */
export class Client extends EventEmitter {
  public session: Session;
  private cloud: CloudClient;
  private prefetchInstance: Prefetch;

  private forwardErrors: boolean = true;

  constructor(apikey: string, options?: ClientOptions) {
    super();

    /* istanbul ignore if */
    if (options && options.forwardErrors) {
      this.forwardErrors = options.forwardErrors;
    }

    /* istanbul ignore next */
    Sentry.configureScope(scope => {
      scope.setTag('apikey', apikey);
      scope.setTag('sdk-version', getVersion());
      scope.setExtra('clientOptions', options);
    });

    if (!apikey || typeof apikey !== 'string' || apikey.length === 0) {
      throw new Error('An apikey is required to initialize the Filestack client');
    }
    const { urls } = config;
    this.session = { apikey, urls };

    if (options) {
      const { cname, security } = options;

      this.setSecurity(security);
      this.setCname(cname);
    }

    this.prefetchInstance = new Prefetch(this.session);
    this.cloud = new CloudClient(this.session, options);
  }

  /**
   * Make basic prefetch request to check permissions
   *
   * @param params
   */
  prefetch(params: PrefetchOptions) {
    return this.prefetchInstance.getConfig(params);
  }

  /**
   * Set security object
   *
   * @param {Security} security
   * @memberof Client
   */
  setSecurity(security: Security) {
    if (security && !(security.policy && security.signature)) {
      throw new FilestackError('Both policy and signature are required for client security');
    }

    if (security && security.policy && security.signature) {
      this.session.policy = security.policy;
      this.session.signature = security.signature;
    }
  }

  /**
   * Set custom cname
   *
   * @param {string} cname
   * @returns
   * @memberof Client
   */
  setCname(cname: string) {
    if (!cname || cname.length === 0) {
      return;
    }

    this.session.cname = cname;
    this.session.urls = resolveHost(this.session.urls, cname);
  }

  /**
   * Clear all current cloud sessions in the picker.
   * Optionally pass a cloud source name to only log out of that cloud source.
   * This essentially clears the OAuth authorization codes from the Filestack session.
   * @param name Optional cloud source name.
   */
  logout(name?: string) {
    return this.cloud.logout(name);
  }
  /**
   * Retrieve detailed data of stored files.
   *
   * ### Example
   *
   * ```js
   * client
   *   .metadata('DCL5K46FS3OIxb5iuKby')
   *   .then((res) => {
   *     console.log(res);
   *   })
   *   .catch((err) => {
   *     console.log(err);
   *   }));
   * ```
   * @see [File API - Metadata](https://www.filestack.com/docs/api/file#metadata).
   * @param handle Valid Filestack handle.
   * @param options Metadata fields to enable on response.
   * @param security Optional security override.
   */
  metadata(handle: string, options?: MetadataOptions, security?: Security) {
    /* istanbul ignore next */
    return metadata(this.session, handle, options, security);
  }
  /**
   * Construct a new picker instance.
   */
  picker(options?: PickerOptions): PickerInstance {
    /* istanbul ignore next */
    return picker(this, options);
  }
  /**
   * Used for viewing files via Filestack handles or storage aliases, __requires Document Viewer addon to your Filestack application__.
   * Opens document viewer in new window if id option is not provided.
   *
   * ### Example
   *
   * ```js
   * // <div id="preview"></div>
   *
   * client.preview('DCL5K46FS3OIxb5iuKby', { id: 'preview' });
   * ```
   * @param handle Valid Filestack handle.
   * @param options Preview options
   */
  preview(handle: string, options?: PreviewOptions) {
    /* istanbul ignore next */
    return preview(this.session, handle, options);
  }
  /**
   * Remove a file from storage and the Filestack system.
   *
   * __Requires a valid security policy and signature__. The policy and signature will be pulled from the client session, or it can be overridden with the security parameter.
   *
   * ### Example
   *
   * ```js
   * client
   *   .remove('DCL5K46FS3OIxb5iuKby')
   *   .then((res) => {
   *     console.log(res);
   *   })
   *   .catch((err) => {
   *     console.log(err);
   *   }));
   * ```
   * @see [File API - Delete](https://www.filestack.com/docs/api/file#delete)
   * @param handle Valid Filestack handle.
   * @param security Optional security override.
   */
  remove(handle: string, security?: Security): Promise<any> {
    /* istanbul ignore next */
    return remove(this.session, handle, false, security);
  }
  /**
   * Remove a file **only** from the Filestack system. The file remains in storage.
   *
   * __Requires a valid security policy and signature__. The policy and signature will be pulled from the client session, or it can be overridden with the security parameter.
   *
   * ### Example
   *
   * ```js
   * client
   *   .removeMetadata('DCL5K46FS3OIxb5iuKby')
   *   .then((res) => {
   *     console.log(res);
   *   })
   *   .catch((err) => {
   *     console.log(err);
   *   }));
   * ```
   * @see [File API - Delete](https://www.filestack.com/docs/api/file#delete)
   * @param handle Valid Filestack handle.
   * @param security Optional security override.
   */
  removeMetadata(handle: string, security?: Security): Promise<any> {
    /* istanbul ignore next */
    return remove(this.session, handle, true, security);
  }
  /**
   * Store a file from its URL.
   *
   * ### Example
   *
   * ```js
   * client
   *   .storeURL('https://d1wtqaffaaj63z.cloudfront.net/images/NY_199_E_of_Hammertown_2014.jpg')
   *   .then(res => console.log(res));
   * ```
   * @see [File API - Store](https://www.filestack.com/docs/api/file#store)
   * @param url       Valid URL to a file.
   * @param options   Configure file storage.
   * @param token     Optional control token to call .cancel()
   * @param security  Optional security override.
   * @param uploadTags Optional tags visible in webhooks.
   */
  storeURL(url: string, storeParams?: StoreParams, token?: any, security?: Security, uploadTags?: UploadTags): Promise<Object> {
    return storeURL({
      session: this.session,
      url,
      storeParams,
      token,
      security,
      uploadTags,
    });
  }

  /**
   * Access files via their Filestack handles.
   *
   * If head option is provided - request headers are returned in promise
   * If metadata option is provided - metadata object is returned in promise
   * Otherwise file blob is returned
   * Metadata and head options cannot be mixed
   *
   * ### Example
   *
   * ```js
   * client.retrieve('fileHandle', {
   *  metadata: true,
   * }).then((response) => {
   *  console.log(response);
   * }).catch((err) => {
   *  console.error(err);
   * })
   * ```
   *
   * @see [File API - Download](https://www.filestack.com/docs/api/file#download)
   * @param handle    Valid file handle
   * @param options   RetrieveOptions
   * @param security  Optional security override.
   * @throws          Error
   */
  retrieve(handle: string, options?: RetrieveOptions, security?: Security): Promise<Object | Blob> {
    /* istanbul ignore next */
    return retrieve(this.session, handle, options, security);
  }

  /**
   * Interface to the Filestack [Processing API](https://www.filestack.com/docs/api/processing).
   * Convert a URL, handle, or storage alias to another URL which links to the transformed file.
   * You can optionally store the returned URL with client.storeURL.
   *
   * Transform params can be provided in camelCase or snakeCase style ie: partial_pixelate or partialPixelate
   *
   * ### Example
   *
   * ```js
   * const transformedUrl = client.transform(url, {
   *   crop: {
   *     dim: [x, y, width, height],
   *   },
   *   vignette: {
   *     blurmode: 'gaussian',
   *     amount: 50,
   *   },
   *   flip: true,
   *   partial_pixelate: {
   *     objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
   *   },
   * };
   *
   * // optionally store the new URL
   * client.storeURL(transformedUrl).then(res => console.log(res));
   * ```
   * @see [Filestack Processing API](https://www.filestack.com/docs/api/processing)
   * @param url     Single or multiple valid URLs (http(s)://), file handles, or storage aliases (src://) to an image.
   * @param options Transformations are applied in the order specified by this object.
   * @param b64     Use new more safe format for generating transforms url (default=false) Note: If there will be any issues with url please test it with enabled b64 support
   * @returns       A new URL that points to the transformed resource.
   */
  transform(url: string | string[], options: TransformOptions, b64: boolean = false) {
    /* istanbul ignore next */
    return transform(this.session, url, options, b64);
  }

  /**
   * Initiates a multi-part upload flow. Use this for Filestack CIN and FII uploads.
   *
   * In Node runtimes the file argument is treated as a file path.
   * Uploading from a Node buffer is not yet implemented.
   *
   * ### Example
   *
   * ```js
   * const token = {};
   * const onRetry = (obj) => {
   *   console.log(`Retrying ${obj.location} for ${obj.filename}. Attempt ${obj.attempt} of 10.`);
   * };
   *
   * client.upload(file, { onRetry }, { filename: 'foobar.jpg' }, token)
   *   .then(res => console.log(res));
   *
   * client.upload({file, name}, { onRetry }, { filename: 'foobar.jpg' }, token)
   *   .then(res => console.log(res));
   *
   * token.pause();  // Pause flow
   * token.resume(); // Resume flow
   * token.cancel(); // Cancel flow (rejects)
   * ```
   * @param {InputFile}    file           Must be a valid [File | Blob | Buffer | string]
   * @param uploadOptions  Uploader options.
   * @param storeOptions   Storage options.
   * @param token          A control token that can be used to call cancel(), pause(), and resume().
   * @param security       Optional security policy and signature override.
   *
   * @returns {Promise}
   */
  upload(file: InputFile, options?: UploadOptions, storeOptions?: StoreUploadOptions, token?: any, security?: Security) {
    let upload = new Upload(options, storeOptions);
    upload.setSession(this.session);

    if (token) {
      upload.setToken(token);
    }

    if (security) {
      upload.setSecurity(security);
    }

    /* istanbul ignore next */
    upload.on('error', e => {
      if (this.forwardErrors) {
        Sentry.withScope(scope => {
          scope.setExtras(e.details);
          scope.setExtras({ uploadOptions: options, storeOptions });
          Sentry.captureException(e);
        });
      }

      this.emit('upload.error', e);
    });

    return upload.upload(file);
  }

  /**
   * Initiates a multi-part upload flow. Use this for Filestack CIN and FII uploads.
   *
   * In Node runtimes the file argument is treated as a file path.
   * Uploading from a Node buffer is not yet implemented.
   *
   * ### Example
   *
   * ```js
   * const token = {};
   * const onRetry = (obj) => {
   *   console.log(`Retrying ${obj.location} for ${obj.filename}. Attempt ${obj.attempt} of 10.`);
   * };
   *
   * client.multiupload([file], { onRetry }, token)
   *   .then(res => console.log(res));
   *
   * client.multiupload([{file, name}], { onRetry }, token)
   *   .then(res => console.log(res));
   *
   * token.pause();  // Pause flow
   * token.resume(); // Resume flow
   * token.cancel(); // Cancel flow (rejects)
   * ```
   * @param {InputFile[]}  file           Must be a valid [File | Blob | Buffer | string (base64)]
   * @param uploadOptions  Upload options.
   * @param storeOptions   Storage options.
   * @param token          A control token that can be used to call cancel(), pause(), and resume().
   * @param security       Optional security policy and signature override.
   *
   * @returns {Promise}
   */
  multiupload(file: InputFile[], options?: UploadOptions, storeOptions?: StoreUploadOptions, token?: any, security?: Security) {
    let upload = new Upload(options, storeOptions);

    upload.setSession(this.session);

    if (token) {
      upload.setToken(token);
    }

    if (security) {
      upload.setSecurity(security);
    }

    /* istanbul ignore next */
    upload.on('error', e => {
      Sentry.withScope(scope => {
        scope.setExtras(e.details);
        scope.setExtras({ uploadOptions: options, storeOptions });
        Sentry.captureException(e);
      });

      this.emit('upload.error', e);
    });

    return upload.multiupload(file);
  }
}
