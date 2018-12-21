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
import * as t from './transform';
import { btoa } from 'abab';

declare var ENV: any;
const session = ENV.session;
const secureSession = ENV.secureSession;
const cdnUrl = session.urls.cdnUrl;

describe('transform', () => {
  const transform = (url: string, options: any, b64: Boolean = false) => t.transform(session, url, options, b64);
  const transformSecure = (url: string, options: any, b64: Boolean = false) => t.transform(secureSession, url, options, b64);

  const url = ENV.filelink;

  it('should throw an error if invalid options are provided', () => {
    assert.throws(() => transform(url, { invalidKey: 'ignored' }));
  });

  it('should construct URL parameters from specified transforms', () => {
    const testConfig = {
      vignette: {
        amount: 100,
        blurmode: 'linear',
      },
      shadow: {
        blur: 10,
        opacity: 35,
        vector: [25, 25],
      },
    };
    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/vignette=amount:100,blurmode:linear/shadow=blur:10,opacity:35,vector:[25,25]/${url}`;
    assert.equal(result, expected);
  });

  it('should construct URL parameters properly with primitive options', () => {
    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
      compress: false,
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/polaroid/flop/${url}`;
    assert.equal(result, expected);
  });

  it('should construct URL with security properly', () => {
    const testConfig = {
      polaroid: true,
    };
    const result = transformSecure(url, testConfig);
    const expected = `${cdnUrl}/polaroid/security=policy:${secureSession.policy},signature:${secureSession.signature}/${url}`;
    assert.equal(result, expected);
  });

  it('should return base url if there are no transforms', () => {
    const testConfig = {};
    const result = transform(url, testConfig);

    assert.equal(result, `${cdnUrl}/${url}`);
  });

  it('should return flatten nested options array', () => {
    const testConfig = {
      partial_pixelate: {
        objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/partial_pixelate=objects:[[10,20,200,250],[275,91,500,557]]/${url}`;
    assert.equal(result, expected);
  });

  it('should handle camelCased params', () => {
    const testConfig = {
      partialPixelate: {
        objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/partial_pixelate=objects:[[10,20,200,250],[275,91,500,557]]/${url}`;
    assert.equal(result, expected);
  });

  it('should handle storage with url handle', () => {
    const storeAlias = 'https://test.com/file.js';

    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
    };

    const result = transform(storeAlias, testConfig);
    const expected = `${cdnUrl}/${session.apikey}/polaroid/flop/"${storeAlias}"`;
    assert.equal(result, expected);
  });

  it('should handle storage with http url handle', () => {
    const storeAlias = 'http://test.com/file.js';

    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
    };

    const result = transform(storeAlias, testConfig);
    const expected = `${cdnUrl}/${session.apikey}/polaroid/flop/"${storeAlias}"`;
    assert.equal(result, expected);
  });

  it('should throw exception when storage alias is provided without apikey', () => {
    const sessionCopy = JSON.parse(JSON.stringify(session));
    sessionCopy.apikey = null;
    const testConfig = {};

    assert.throws(() => t.transform(sessionCopy, 'src:test', testConfig));
  });

  it('should handle store aliases', () => {
    const storeAlias = 'src://my-s3/mydoc.pdf';

    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
    };

    const result = transform(storeAlias, testConfig);
    const expected = `${cdnUrl}/${session.apikey}/polaroid/flop/"${storeAlias}"`;
    assert.equal(result, expected);
  });

  it('should validate float ranges in options', () => {
    const testConfig = {
      detect_faces: {
        minsize: 0.2,
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/detect_faces=minsize:0.2/${url}`;
    assert.equal(result, expected);
  });

  it('should return base url with handle if there is empty transform option', () => {
    const testConfig = {
      polaroid: {},
    };

    const result = transform(url, testConfig);
    assert.equal(result, `${cdnUrl}/polaroid/${url}`);
  });

  it('should handle store without params', () => {
    const options = {};
    const result = transform(url, { store: options });

    assert.equal(result, `${cdnUrl}/store/${url}`);
  });

  it('should return correct store URL with "/" in path', () => {
    const options = { filename: 'test.jpg' , path: 'test/path' };
    const result = transform(url, { store: options });

    assert.equal(result, `${cdnUrl}/store=filename:test.jpg,path:"test/path"/fakelink`);
  });

  it('should handle upper cased path', () => {
    const options = { filename: 'test.jpg' , path: 'tEsT/path' };
    const result = transform(url, { store: options });

    assert.equal(result, `${cdnUrl}/store=filename:test.jpg,path:"tEsT/path"/fakelink`);
  });

  describe('blackwhite', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        blackwhite: {
          threshold: 100,
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/blackwhite=threshold:100/${url}`;
      assert.equal(result, expected);
    });
  });

  describe('crop', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        crop: {
          dim: [0, 0, 200, 200],
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/crop=dim:[0,0,200,200]/${url}`;
      assert.equal(result, expected);
    });
  });

  describe('rotate', () => {
    it('should construct valid parameters', () => {
      const testConfig: t.TransformOptions = {
        rotate: {
          deg: 'exif',
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/rotate=deg:exif/${url}`;
      assert.equal(result, expected);
    });
  });

  describe('output', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        output: {
          background: 'black',
          density: 250,
          compress: true,
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/output=background:black,density:250,compress:true/${url}`;
      assert.equal(result, expected);
    });
  });

  describe('cache', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        cache: false,
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/cache=false/${url}`;
      assert.equal(result, expected);

      const testConfig2 = {
        cache: {
          expiry: 12345,
        },
      };

      const result2 = transform(url, testConfig2);
      const expected2 = `${cdnUrl}/cache=expiry:12345/${url}`;
      assert.equal(result2, expected2);
    });
  });

  describe('compress', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        compress: true,
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/compress/${url}`;
      assert.equal(result, expected);
    });
  });
});

describe('transform b64', () => {
  const transform = (url: string, options: any, b64: Boolean = true) => t.transform(session, url, options, b64);
  const transformSecure = (url: string, options: any, b64: Boolean = true) => t.transform(secureSession, url, options, b64);

  const url = ENV.filelink;

  it('should throw an error if invalid options are provided', () => {
    assert.throws(() => transform(url, { invalidKey: 'ignored' }));
  });

  it('should construct URL parameters from specified transforms', () => {
    const testConfig = {
      vignette: {
        amount: 100,
        blurmode: 'linear',
      },
      shadow: {
        blur: 10,
        opacity: 35,
        vector: [25, 25],
      },
    };

    const result = transform(url, testConfig, true);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'vignette',
        params: {
          amount: 100,
          blurmode: 'linear',
        },
      }, {
        name: 'shadow',
        params: {
          blur: 10,
          opacity: 35,
          vector: [25, 25],
        },
      },
    ]))}/b64://${btoa(url)}`;
    assert.equal(result, expected);
  });

  it('should construct URL parameters properly with primitive options', () => {
    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
      compress: false,
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'polaroid',
      },
      {
        name: 'flop',
      },
    ]))}/b64://${btoa(url)}`;
    assert.equal(result, expected);
  });

  it('should construct URL with security properly', () => {
    const testConfig = {
      polaroid: true,
    };

    const result = transformSecure(url, testConfig);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'polaroid',
      },
      {
        name: 'security',
        params: {
          policy: secureSession.policy,
          signature: secureSession.signature,
        },
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should return base url if there are no transforms', () => {
    const testConfig = {};
    const result = transform(url, testConfig);

    const expected = `${cdnUrl}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should return flatten nested options array', () => {
    const testConfig = {
      partial_pixelate: {
        objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'partial_pixelate',
        params: {
          objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
        },
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should handle camelCased params', () => {
    const testConfig = {
      partialPixelate: {
        objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'partial_pixelate',
        params: {
          objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
        },
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should handle transform with url handle', () => {
    const storeAlias = 'https://test.com/file.js';

    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
    };

    const result = transform(storeAlias, testConfig);
    const expected = `${cdnUrl}/fakekey/b64/${btoa(JSON.stringify([
      {
        name: 'polaroid',
      }, {
        name: 'flop',
      },
    ]))}/b64://${btoa(storeAlias)}`;

    assert.equal(result, expected);
  });

  it('should handle store aliases', () => {
    const storeAlias = 'src://my-s3/mydoc.pdf';

    const testConfig = {
      polaroid: true,
      flip: false,
      flop: true,
    };

    const result = transform(storeAlias, testConfig);
    const expected = `${cdnUrl}/fakekey/b64/${btoa(JSON.stringify([
      {
        name: 'polaroid',
      }, {
        name: 'flop',
      },
    ]))}/b64://${btoa(storeAlias)}`;

    assert.equal(result, expected);
  });

  it('should validate float ranges in options', () => {
    const testConfig = {
      detect_faces: {
        minsize: 0.2,
      },
    };

    const result = transform(url, testConfig);
    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'detect_faces',
        params: {
          minsize: 0.2,
        },
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should return base url with handle if there is empty transform option', () => {
    const testConfig = {
      polaroid: {},
    };

    const result = transform(url, testConfig);

    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'polaroid',
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should handle store without params', () => {
    const options = {};
    const result = transform(url, { store: options });

    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'store',
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should return correct store URL with "/" in path', () => {
    const options = { filename: 'test.jpg' , path: 'test/path' };
    const result = transform(url, { store: options });

    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'store',
        params: options,
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  it('should handle upper cased path', () => {
    const options = { filename: 'test.jpg' , path: 'tEsT/path '};
    const result = transform(url, { store: options });

    const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
      {
        name: 'store',
        params: options,
      },
    ]))}/b64://${btoa(url)}`;

    assert.equal(result, expected);
  });

  describe('blackwhite', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        blackwhite: {
          threshold: 100,
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'blackwhite',
          params: {
            threshold: 100,
          },
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);
    });
  });

  describe('crop', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        crop: {
          dim: [0, 0, 200, 200],
        },
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'crop',
          params: {
            dim: [0, 0, 200, 200],
          },
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);
    });
  });

  describe('rotate', () => {
    it('should construct valid parameters', () => {
      const testConfig: t.TransformOptions = {
        rotate: {
          deg: 'exif',
        },
      };

      const result = transform(url, testConfig);

      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'rotate',
          params: {
            deg: 'exif',
          },
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);
    });
  });

  describe('output', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        output: {
          background: 'black',
          density: 250,
          compress: true,
        },
      };

      const result = transform(url, testConfig);

      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'output',
          params: {
            background: 'black',
            density: 250,
            compress: true,
          }
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);
    });
  });

  describe('cache', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        cache: false,
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'cache',
          params: {
            expiry: 0,
          },
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);

      const testConfig2 = {
        cache: {
          expiry: 12345,
        },
      };

      const result2 = transform(url, testConfig2);
      const expected2 = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'cache',
          params: {
            expiry: 12345,
          },
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result2, expected2);
    });
  });

  describe('compress', () => {
    it('should construct valid parameters', () => {
      const testConfig = {
        compress: true,
      };

      const result = transform(url, testConfig);
      const expected = `${cdnUrl}/b64/${btoa(JSON.stringify([
        {
          name: 'compress',
        },
      ]))}/b64://${btoa(url)}`;

      assert.equal(result, expected);
    });
  });
});
