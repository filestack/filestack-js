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

import { Security } from '../client';
import { WebhookValidatePayload, SecurityOptions } from './security';
import { FilestackError, FilestackErrorType } from './../../filestack_error';
import { getValidator, SecurityParamsSchema } from './../../schema';
import * as crypto from 'crypto';

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
  const validateRes = getValidator(SecurityParamsSchema)(policyOptions);

  if (validateRes.errors.length) {
    throw new FilestackError(`Invalid security params`, validateRes.errors, FilestackErrorType.VALIDATION);
  }

  const policy = Buffer.from(JSON.stringify(policyOptions)).toString('base64');
  const signature = crypto.createHmac('sha256', appSecret)
                   .update(policy)
                   .digest('hex');

  return { policy, signature };
};

/**
 * Check webhook signature
 *
 * @param secret - app secred
 * @param rawBody - unchanged raw webhook body
 * @param toCompare - data from wh response headers
 */
export const validateWebhookSignature = (secret: string, rawBody: string, toCompare: WebhookValidatePayload) => {
  const hash = crypto.createHmac('sha256', secret)
                .update(`${toCompare.timestamp}.${rawBody}`)
                .digest('hex');

  return hash === toCompare.signature;
};
