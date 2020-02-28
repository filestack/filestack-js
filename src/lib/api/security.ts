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

/**
 * Configures a security policy
 *
 * @see https://www.filestack.com/docs/concepts/security
 */
export interface SecurityOptions {
  expiry: number;
  call?: any[];
  handle?: string;
  url?: string;
  maxSize?: number;
  minSize?: number;
  path?: string;
  container?: string;
}

export interface WebhookValidatePayload {
  timestamp: string;
  signature: string;
}

export * from './security.node';
