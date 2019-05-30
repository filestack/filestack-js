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
import { transform } from './transform';
import { config } from './../../config';
import { Filelink } from './../filelink';

jest.mock('./../filelink');

const defaultApikey = 'EXAMPLE_API_KEY';
const defaultHandle = 'EXAMPLE_HANDLE';
const defaultSecurity = {
  policy: 'examplePolicy',
  signature: 'exampleSignature',
};

const sessionURls = config.urls;
const defaultSession = {
  apikey: defaultApikey,
  urls: sessionURls,
};

describe('OldTransforms', () => {
  it('should pass params to Filelink class', () => {
    transform(
      defaultSession,
      defaultHandle,
      {
        partial_pixelate: {
          amount: 2,
        },
      }
    );

    expect(Filelink.prototype.addTask).toHaveBeenCalledWith('partial_pixelate', {
      amount: 2,
    });
  });

  it('should respect security params', () => {
    transform(
      {
        ...defaultSession,
        ...defaultSecurity,
      },
      defaultHandle,
      {
        partial_pixelate: {
          amount: 2,
        },
      }
    );

    expect(Filelink.prototype.addTask).toHaveBeenCalledWith('security', defaultSecurity);
  });

  it('should respect cache=false transformation', () => {
    transform(
      defaultSession,
      defaultHandle,
      {
        // @ts-ignore
        cache: false,
      }
    );

    expect(Filelink.prototype.addTask).toHaveBeenCalledWith('cache', false);
  });

  it('should remove falsy parameters transformation', () => {
    transform(
      defaultSession,
      defaultHandle,
      {
        flip: false,
      }
    );

    expect(Filelink.prototype.addTask).not.toHaveBeenCalledWith('flip', false);
  });

  it('should change cammel case to snake case transformations', () => {
    transform(
      defaultSession,
      defaultHandle,
      {
        // @ts-ignore
        partialPixelate: {
          amount: 2,
        },
      }
    );

    expect(Filelink.prototype.addTask).toHaveBeenCalledWith('partial_pixelate', {
      amount: 2,
    });
  });

  it('return call toString on filelink when params are empty', () => {
    const testUrl = 'nanana';
    spyOn(Filelink.prototype, 'toString').and.callFake(() => testUrl);

    expect(transform(
      defaultSession,
      defaultHandle
    )).toEqual(testUrl);
  });

  it('should enable base64 on filelink', () => {
    transform(
      defaultSession,
      defaultHandle,
      {
        // @ts-ignore
        partialPixelate: {
          amount: 2,
        },
      },
      true
    );

    expect(Filelink.prototype.setBase64).toHaveBeenCalledWith(true);
  });
});
