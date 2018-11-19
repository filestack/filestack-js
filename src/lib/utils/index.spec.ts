/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Original implementation of throat by Forbes Lindesay
 * https://github.com/ForbesLindesay/throat
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

import * as assert from 'assert';
import * as t from 'tcomb-validation';
import { checkOptions, removeEmpty, resolveCdnUrl } from './index';
declare var ENV: any;

const session = ENV.session;

describe('resolveCdnUrl', () => {

  it('should throw exception when using http or src handle and there is no apiKey', () => {
    const sessionClone = JSON.parse(JSON.stringify(session));
    delete sessionClone.apikey;

    assert.throws(() => resolveCdnUrl(sessionClone, 'http://test.com'));
    assert.throws(() => resolveCdnUrl(sessionClone, 'src://test.com'));
  });
});

describe('checkOptions', () => {
  it('should throw exception when wrong option is provided', () => {
    const allowed = [
      { name: 'test', type: t.Boolean },
    ];

    const options = {
      notAllowed: 123,
    };

    assert.throws(() => checkOptions('retrieveOptions', allowed, options));
  });

  it('should throw exception when wrong option value is provided', () => {
    const allowed = [
      { name: 'test', type: t.Boolean },
    ];

    const options = {
      test: 123,
    };

    assert.throws(() => checkOptions('retrieveOptions', allowed, options));
  });
});

describe('removeEmpty', () => {
  it('should remove empty values from object', () => {
    const testObj = {
      test: 123,
      empty: null,
    };

    assert.equal(JSON.stringify(removeEmpty(testObj)), JSON.stringify({ test: 123, }));
  });
});
