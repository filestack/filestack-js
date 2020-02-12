/*
 * Copyright (c) 2019 by Filestack.
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
 * Calculates a MD5 checksum for passed buffer
 * @private
 * @param data  Data to be hashed
 * @returns     base64 encoded MD5 hash
 */
export const md5 = (data: any): string => {
  return require('crypto')
      .createHash('md5')
      .update(data)
      .digest('base64');
};

/**
 * return based string
 * @param data
 */
export const b64 = (data: string, safeUrl: boolean = false): string => {
  const b64 = Buffer.from(data).toString('base64');

  if (safeUrl) {
    return b64.replace(/\//g, '_').replace(/\+/g, '-');
  }

  return b64;
};

/**
 * Return currently used filestack-js sdk version
 */
export const getVersion = () => {
  const rootArr = __dirname.split('/');
  const fsIndex = rootArr.findIndex((e) => e === 'filestack-js');
  const rootDir = rootArr.splice(0, fsIndex + 1).join('/');

  return `JS-${require(`${rootDir}/package.json`).version}`;
};

/**
 * Returns if browser is a mobile device (if node env always return false)
 */
/* istanbul ignore next */
export const isMobile = () => false;

/**
 * Check if application is runned in facebook browser
 */
export const isFacebook = () => false;
