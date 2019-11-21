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
import { SecurityOptions, getSecurity, validateWebhookSignature, WebhookValidatePayload } from './lib/api/security';
import { Client, ClientOptions, Security } from './lib/client';
import { PickerOptions, PickerInstance, PickerUploadDoneCallback, PickerFileMetadata, PickerResponse, PickerDisplayMode } from './lib/picker';
import { TransformSchema } from './schema/transforms.schema';
import { TransformOptions } from './lib/api/transform';
import { RetrieveOptions, MetadataOptions } from './lib/api/file';
import { InputFile } from './lib/api/upload/file_tools';
import { UploadOptions } from './lib/api/upload/types';
import { StoreUploadOptions } from './lib/api/upload';
import { PreviewOptions } from './lib/api/preview';
import { FilestackError } from './filestack_error';
import { getMimetype } from './lib/utils/index';

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
export * from './lib/request';

export {
  TransformSchema,
  SecurityOptions,
  getSecurity,
  validateWebhookSignature,
  WebhookValidatePayload,
  ClientOptions,
  PickerOptions,
  PickerInstance,
  Security,
  TransformOptions,
  RetrieveOptions,
  InputFile,
  UploadOptions,
  StoreUploadOptions,
  MetadataOptions,
  PreviewOptions,
  PickerUploadDoneCallback,
  PickerFileMetadata,
  PickerResponse,
  Client,
  FilestackError,
  PickerDisplayMode,
  getMimetype
};
