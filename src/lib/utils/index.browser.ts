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
import * as SparkMD5 from 'spark-md5';

const mobileRegexp = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;

/**
 * Calculates a MD5 checksum for passed buffer
 * @private
 * @param data  Data to be hashed
 * @returns     base64 encoded MD5 hash
 */
export const md5 = (data: any): string => {
  /* istanbul ignore next */
  return btoa(SparkMD5.ArrayBuffer.hash(data, true));
};

/**
 * return based string
 *
 * @param data
 */
export const b64 = (data: string, safeUrl: boolean = false): string => {
  const b64 = btoa(data);

  if (safeUrl) {
    return b64.replace(/\//g, '_').replace(/\+/g, '-');
  }

  return b64;
};

/**
 * Return currently used filestack-js sdk version
 */
export const getVersion = () => {
  return 'JS-@{VERSION}';
};

/**
 * Returns if browser is a mobile device (if node env always return false)
 */
/* istanbul ignore next */
export const isMobile = () => navigator && navigator.userAgent && mobileRegexp.test(navigator.userAgent);

/**
 * Check if application is runned in facebook browser
 */
export const isFacebook = () => navigator && navigator.userAgent && /\[FB.*;/i.test(navigator.userAgent);
