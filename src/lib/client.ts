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

import { config, Hosts } from '../config';
import { metadata, MetadataOptions, remove, retrieve, RetrieveOptions } from './api/file';
import { transform, TransformOptions } from './api/transform';
import { storeURL } from './api/store';
import { upload, UploadOptions } from './api/upload';
import { preview, PreviewOptions } from './api/preview';
import { CloudClient } from './api/cloud';
import {
  picker,
  PickerInstance,
  PickerOptions,
} from './picker';

export interface Session {
  apikey: string;
  urls: Hosts;
  cname?: string;
  policy?: string;
  signature?: string;
}

export interface Security {
  policy: string;
  signature: string;
}

export interface StoreOptions {
  /**
   * Filename for stored file
   */
  filename?: string;
  /**
   * Location for stored file. One of 's3', 'gcs', 'azure', 'rackspace', or 'dropbox'.
   */
  location?: string;
  /**
   * Set container path.
   */
  path?: string;
  /**
   * Specify S3 region.
   */
  region?: string;
  /**
   * Specify storage container.
   */
  container?: string;
  /**
   * S3 container access. 'public' or 'private'.
   */
  access?: string;
}

export interface ClientOptions {
  [option: string]: any;
  /**
   * Security object with policy and signature keys.
   * Can be used to limit client capabilities and protect public URLs.
   * It is intended to be used with server-side policy and signature generation.
   * Read about [security policies](https://www.filestack.com/docs/security).
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
}

/**
 * The Filestack client, the entry point for all public methods. Encapsulates session information.
 *
 * ### Example
 * ```js
 * // ES module
 * import filestack from 'filestack-js';
 * const client = filestack.init('apikey');
 * ```
 *
 * ```js
 * // UMD module in browser
 * <script src="https://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js"></script>
 * const client = filestack.init('apikey');
 * ```
 */
export class Client {
  session: Session;
  private cloud: CloudClient;

  constructor(apikey: string, options?: ClientOptions) {
    if (!apikey || typeof apikey !== 'string' || apikey.length === 0) {
      throw new Error('An apikey is required to initialize the Filestack client');
    }
    const { urls } = config;
    this.session = { apikey, urls };
    if (options) {
      const { cname, security } = options;
      if (security && !(security.policy && security.signature)) {
        throw new Error('Both policy and signature are required for client security');
      }
      if (security && security.policy && security.signature) {
        this.session.policy = security.policy;
        this.session.signature = security.signature;
      }
      if (cname) {
        const hosts = /filestackapi.com|filestackcontent.com/i;
        this.session.cname = cname;
        Object.keys(urls).forEach((key) => {
          this.session.urls[key] = urls[key].replace(hosts, cname);
        });
      }
    }

    this.cloud = new CloudClient(this.session, options);
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
   * Interface to the Filestack [Metadata API](https://www.filestack.com/docs/rest-api/meta-data).
   * Used for retrieving detailed data of stored files.
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
   * Interface to the Filestack [Remove API](https://www.filestack.com/docs/rest-api/remove).
   * Used for removing files, __requires a valid security policy and signature__. The policy and signature will be pulled from the client session, or it can be overridden with the security parameter.
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
   * @param handle Valid Filestack handle.
   * @param security Optional security override.
   */
  remove(handle: string, security?: Security): Promise<any> {
    /* istanbul ignore next */
    return remove(this.session, handle, security);
  }
  /**
   * Interface to the Filestack [Store API](https://www.filestack.com/docs/rest-api/store). Used for storing from a URL.
   * ### Example
   *
   * ```js
   * client
   *   .storeURL('https://d1wtqaffaaj63z.cloudfront.net/images/NY_199_E_of_Hammertown_2014.jpg')
   *   .then(res => console.log(res));
   * ```
   * @param url       Valid URL to a file.
   * @param options   Configure file storage.
   * @param token     Optional control token to call .cancel()
   * @param security  Optional security override.
   */
  storeURL(url: string, options?: StoreOptions, token?: any, security?: Security): Promise<Object> {
    /* istanbul ignore next */
    return storeURL(this.session, url, options, token, security);
  }

  /**
   * Interface to the Filestack Retrieve API. Used for accessing files via Filestack handles.
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
   * @param handle    Valid file handle
   * @param options   RetrieveOptions
   * @param security  Optional security override.
   * @throws          Error
   * @returns         Promise<json | Blob>
   */
  retrieve(handle: string, options?: RetrieveOptions, security?: Security): Promise<Object | Blob> {
    /* istanbul ignore next */
    return retrieve(this.session, handle, options, security);
  }

  /**
   * Interface to the Filestack [transformation engine](https://www.filestack.com/docs/image-transformations).
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
   * @param url     Valid URL (http(s)://), file handle, or storage alias (src://) to an image.
   * @param options Transformations are applied in the order specified by this object.
   * @returns       A new URL that points to the transformed resource.
   */
  transform(url: string, options: TransformOptions): string | null {
    /* istanbul ignore next */
    return transform(this.session, url, options);
  }

  /**
   * Initiates a multi-part upload flow.
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
   * token.pause();  // Pause flow
   * token.resume(); // Resume flow
   * token.cancel(); // Cancel flow (rejects)
   * ```
   * @param file           Must be a valid [File](https://developer.mozilla.org/en-US/docs/Web/API/File), Blob, base64 encoded string, or file path in Node.
   * @param uploadOptions  Uploader options.
   * @param storeOptions   Storage options.
   * @param token          A control token that can be used to call cancel(), pause(), and resume().
   * @param security       Optional security policy and signature override.
   *
   * @returns {Promise}
   */
  upload(file: any, options?: UploadOptions, storeOptions?: StoreOptions, token?: any, security?: Security) {
    /* istanbul ignore next */
    return upload(this.session, file, options, storeOptions, token, security);
  }
}
