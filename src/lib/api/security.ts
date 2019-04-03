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

import * as crypto from 'crypto';
import { Security } from '../client';
import { checkOptions } from '../utils';
import * as t from 'tcomb-validation';

/**
 * Configures a security policy
 *
 * @see https://www.filestack.com/docs/concepts/security
 */
export interface SecurityOptions {
  expiry?: number;
  call?: any[];
  handle?: string;
  url?: string;
  maxSize?: number;
  minSize?: number;
  path?: string;
  container?: string;
}
/**
 * Returns Filestack base64 policy and HMAC-SHA256 signature
 *
 * ### Example
 *
 * ```js
 * import * as filestack from 'filestack-js';
 *
 * const jsonPolicy = { 'expiry': 253381964415 };
 * const security = filestack.getSecurity(jsonPolicy, '<YOUR_APP_SECRET>');
 * ```
 *
 * @param policyOptions
 * @param appSecret
 */
export const getSecurity = (policyOptions: SecurityOptions, appSecret: string): Security => {
  const allowed = [
    { name: 'expiry', type: t.Integer },
    { name: 'call', type: t.list(t.enums.of('pick read stat write writeUrl store convert remove exif runWorkflow')) },
    { name: 'handle', type: t.String },
    { name: 'url', type: t.String },
    { name: 'maxSize', type: t.Integer },
    { name: 'minSize', type: t.Integer },
    { name: 'path', type: t.String },
    { name: 'container', type: t.String },
  ];

  checkOptions('Policy options', allowed, policyOptions);

  const policy = Buffer.from(JSON.stringify(policyOptions)).toString('base64');
  const signature = crypto.createHmac('sha256', appSecret)
                   .update(policy)
                   .digest('hex');

  return { policy, signature };
};
