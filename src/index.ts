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

import { SecurityOptions, getSecurity } from './lib/api/security';
import { Client, ClientOptions } from './lib/client';
import { TransformSchema } from './schema/transforms.schema';

/**
 * Initialize client with given config
 *
 * @param apikey
 * @param options
 */
export const init = (apikey: string, options?: ClientOptions): Client => {
  return new Client(apikey, options);
};

/**
 * filestack-js version. Interpolated at build time.
 */
export const version = '@{VERSION}';

export * from './lib/api/transform';
export * from './lib/filelink';
export * from './filestack_error';

export {
  TransformSchema,
  SecurityOptions,
  getSecurity,
};
