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

import { calcMD5 } from './md5';

describe('md5', () => {

  it('should calculate correct MD5 sum', () => {
    expect(calcMD5(new Buffer('qwertyuiop[]1234567890')) === 'zx9GtzC/khrBelx6tW5v/g==').toBeTruthy();
  });
});
