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
 * @private
 */
const PICKER_VERSION = '1.17.0';

/**
 * @private
 */
export interface Hosts {
  [url: string]: string;
  fileApiUrl: string;
  uploadApiUrl: string;
  cloudApiUrl: string;
  cdnUrl: string;
  pickerUrl: string;
  processUrl: string;
}

/**
 * @private
 */
export interface Config {
  urls: Hosts;
}

export const config = {
  urls: {
    processUrl: 'https://process.filestackapi.com',
    fileApiUrl: 'https://www.filestackapi.com/api/file',
    uploadApiUrl: 'https://upload.filestackapi.com',
    cloudApiUrl: 'https://cloud.filestackapi.com',
    cdnUrl: 'https://cdn.filestackcontent.com',
    pickerUrl: `https://static.filestackapi.com/picker/${PICKER_VERSION}/picker.js`,
  },
};
