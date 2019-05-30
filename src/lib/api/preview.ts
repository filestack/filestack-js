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

import { Security, Session } from '../client';
import { removeEmpty } from '../utils';
import { getValidator, PreviewParamsSchema } from './../../schema';
import { FilestackError, FilestackErrorType } from './../../filestack_error';

export interface PreviewOptions {
  /**
   * Id for DOM element to embed preview into.
   * Omit this to open the preview in a new tab
   */
  id: string;
  /**
   * URL to custom CSS
   */
  css?: string;
}

/**
 * Returns file preview url
 *
 * @private
 * @param session
 * @param handle
 * @param opts
 * @param security
 */
export const getUrl = (
  session: Session,
  handle: string,
  opts?: any,
  security?: Security
) => {
  const options = { ...opts };
  const policy = security && security.policy || session.policy;
  const signature = security && security.signature || session.signature;
  const hasSecurity = signature && policy;
  const baseUrl = [session.urls.cdnUrl];
  const css = options.css && encodeURIComponent(`"${options.css}"`);
  const previewTask = css ? `preview=css:${css}` : 'preview';

  // @todo move to utils?
  if (handle.indexOf('src:') !== -1) {
    baseUrl.push(`${session.apikey}/${previewTask}`);
  } else {
    baseUrl.push(previewTask);
  }
  if (hasSecurity) {
    baseUrl.push(`security=policy:${policy},signature:${signature}`);
  }

  baseUrl.push(handle);
  return baseUrl.join('/');
};

/**
 * Appends image preview into page
 *
 * @private
 * @param session
 * @param handle
 * @param opts
 */
export const preview = (session: Session, handle?: string, opts?: PreviewOptions) => {
  if (!handle || typeof handle !== 'string') {
    throw new Error('A valid Filestack handle or storage alias is required for preview');
  }

  const validateRes = getValidator(PreviewParamsSchema)(opts);

  if (validateRes.errors.length) {
    throw new FilestackError(`Invalid preview params`, validateRes.errors, FilestackErrorType.VALIDATION);
  }

  const options = removeEmpty(opts || {});
  const url = getUrl(session, handle, options);

  if (options && options.id) {
    const id = options.id;
    const iframe = document.createElement('iframe');
    const domElement = document.getElementById(id);

    iframe.src = url;
    iframe.width = '100%';
    iframe.height = '100%';

    if (!domElement) {
      throw new Error(`DOM Element with id "${id}" not found.`);
    }
    return domElement.appendChild(iframe);
  }
  return window.open(url, handle);
};
