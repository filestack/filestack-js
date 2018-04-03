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

import * as SparkMD5 from 'spark-md5';
import * as abab from 'abab';

/**
 * Calculates a MD5 checksum for passed buffer
 * @private
 * @param data  Data to be hashed
 * @returns     base64 encoded MD5 hash
 */
export const calcMD5 = (data: any): string => {
  return abab.btoa(SparkMD5.ArrayBuffer.hash(data, true));
};
