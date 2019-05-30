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

import * as assert from 'assert';
import { getValidator, PickerParamsSchema } from './';

import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;

describe('Picker Params Schema', () => {
  const validator = getValidator(PickerParamsSchema);

  const validate = params => {
    const res = validator(params);

    // if (res.errors.length) {
    //   console.log(res.errors);
    // }

    return res.errors.length === 0 ? true : false;
  };

  const assertFail = res => assert.ok(!res);

  it('should validate allow manual retry', () => {
    assert.ok(validate({ allowManualRetry: true }));
    assertFail(validate({ allowManualRetry: {} }));
  });

  it('should validate accept param', () => {
    assert.ok(validate({ accept: 'image/jpeg' }));
    assert.ok(validate({ accept: ['image/jpeg', 'image/png', '*'] }));
    assertFail(validate({ accept: {} }));
  });

  it('should validate fromSources param', () => {
    assert.ok(validate({ fromSources: ['url', 'facebook'] }));
    assertFail(validate({ fromSources: ['wrong_source'] }));
  });

  it('should validate container param', () => {
    assert.ok(validate({ container: 'test' }));

    const nodeDiv = JSDOM.fragment(`<div>Hello</div>`).querySelector('div');
    const nodeP = JSDOM.fragment(`<p>Hello</p>`).querySelector('p');
    assert.ok(validate({ container: nodeDiv }));
    assert.ok(validate({ container: nodeP }));
    assertFail(validate({ container: {} }));
  });

  it('should validate cleanupImageExif param', () => {
    assert.ok(validate({ cleanupImageExif: true }));
    assert.ok(
      validate({
        cleanupImageExif: {
          keepOrientation: true,
        },
      })
    );
    assertFail(
      validate({
        cleanupImageExif: {
          test: 1,
        },
      })
    );
  });

  it('should validate displayMode param', () => {
    assert.ok(validate({ displayMode: 'inline' }));
    assert.ok(validate({ displayMode: 'overlay' }));
    assert.ok(validate({ displayMode: 'dropPane' }));
    assertFail(validate({ displayMode: 'test' }));
  });

  it('should validate imageDim param', () => {
    assert.ok(validate({ imageDim: [100, 100] }));
    assertFail(validate({ imageDim: [0, 1] }));
    assertFail(validate({ imageDim: [100, 100, 3] }));
  });

  it('should validate storeTo Params', () => {
    assert.ok(
      validate({
        storeTo: {
          filename: 'test',
          location: 's3',
          path: '/test/',
          region: 'test',
          access: 'public',
          workflows: ['test'],
        },
      })
    );

    assert.ok(
      validate({
        storeTo: {
          filename: 'test',
          location: 's3',
          path: '/test/',
          region: 'test',
          access: 'private',
          workflows: [
            {
              id: 'test',
            },
          ],
        },
      })
    );

    assertFail(
      validate({
        storeTo: {
          workflows: {},
          access: 'none',
        },
      })
    );
  });

  it('should validate transformations param', () => {
    assert.ok(
      validate({
        transformations: {
          circle: true,
          rotate: true,
          crop: true,
        },
      })
    );

    assert.ok(
      validate({
        transformations: {
          circle: false,
          rotate: false,
          crop: {
            force: true,
            aspectRatio: 1 / 2,
          },
        },
      })
    );

    assertFail(
      validate({
        transformations: {
          test: 123,
        },
      })
    );
  });

  it('should validate customText param', () => {
    assert.ok(
      validate({
        customText: {
          sometest: 'testtext',
        },
      })
    );
    assertFail(validate({ customText: ['test', 'ts1'] }));
  });

  it('should validate customAuthText param', () => {
    assert.ok(
      validate({
        customAuthText: {
          test: {
            top: 'test',
            bottom: 'test2',
          },
        },
      })
    );

    assertFail(
      validate({
        customAuthText: {
          test: {
            top: 'test',
          },
        },
      })
    );

    assertFail(
      validate({
        customAuthText: {
          test: '123',
        },
      })
    );
  });

  it('should validate ', () => {
    assert.ok(
      validate({
        uploadConfig: {
          partSize: 5 * 1024 * 1024,
          intelligent: true,
          onProgress: () => console,
        },
      })
    );

    assert.ok(
      validate({
        uploadConfig: {
          intelligent: 'fallback',
        },
      })
    );

    assertFail(
      validate({
        uploadConfig: {
          partSize: 100,
        },
      })
    );

    assertFail(
      validate({
        uploadConfig: {
          progressInterval: 0,
        },
      })
    );

    assertFail(
      validate({
        uploadConfig: {
          concurrency: 0,
        },
      })
    );
  });
});
