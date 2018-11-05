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
import { schema } from './transforms.schema';

import { Validator } from 'jsonschema';

describe.only('Transforms Schema', () => {
  const v = new Validator();

  it('should load json schema', () => {
    // console.log(schema);
  });

  describe('Watermark', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: 'top',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should validate correct params (position array)', () => {
      const validation = v.validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: ['top', 'left'],
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should fail on wrong position params [top, bottom]', () => {
      const validation = v.validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: ['top', 'bottom'],
        },
      }, schema);
      assert.ok(validation.errors.length > 0);
    });
  });

  describe('Partial Blur', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        partial_blur: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: 18.2,
          blur: 12,
          type: 'rect',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should fail on wrong params (amount, blur, type)', () => {
      const validation = v.validate({
        partial_blur: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: -10,
          blur: 300,
          type: 'wrong_type',
        },
      }, schema);

      assert.ok(validation.errors.length === 3);
    });

    it('should fail on wrong params (objects)', () => {
      const validation = v.validate({
        partial_blur: {
          objects: [
            [1, 1, 2],
            [1, 1, 32, 15, 32],
          ],
          amount: 10,
          blur: 20,
        },
      }, schema);
      assert.ok(validation.errors.length === 1);
    });
  });

  describe('Partial Pixelate', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: 100,
          blur: 12.2,
          type: 'oval',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should fail on wrong params (amount, blur, type)', () => {
      const validation = v.validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: -10,
          blur: 300,
          type: 'wrong_type',
        },
      }, schema);

      assert.ok(validation.errors.length === 3);
    });

    it('should fail on wrong params (objects)', () => {
      const validation = v.validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2],
            [1, 1, 32, 15, 32],
          ],
          amount: 10,
          blur: 20,
        },
      }, schema);

      assert.ok(validation.errors.length === 1);
    });
  });

  describe('Crop', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        crop: {
          dim: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should fail on wrong params empty', () => {
      const validation = v.validate({
        crop: {
          dim: [],
        },
      }, schema);

      assert.ok(validation.errors.length === 1);
    });

    it('should fail on wrong params (objects)', () => {
      const validation = v.validate({
        crop: {
          dim: [
            [1, 1, 0, 0],
            [1, 1, 32, 15],
          ],
        },
      }, schema);

      assert.ok(validation.errors.length === 2);
    });
  });

  describe('Resize', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        resize: {
          width: 10,
          height: 20,
          fit: 'crop',
          align: ['top', 'left'],
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should validate correct when only one width or height is provided', () => {
      const validation = v.validate({
        resize: {
          width: 10,
          fit: 'crop',
          align: 'left',
        },
      }, schema);

      const validation1 = v.validate({
        resize: {
          height: 10,
          fit: 'crop',
          align: 'left',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
      assert.ok(validation1.errors.length === 0);
    });

    it('should fail on wrong params (missing width and height)', () => {
      const validation = v.validate({
        resize: {
          fit: 'crop',
          align: 'left',
        },
      }, schema);

      assert.ok(validation.errors.length === 1);
    });
  });

  describe('Resize', () => {
    it('should validate correct params', () => {
      const validation = v.validate({
        rotate: {
          deg: 'exif',
          exif: false,
          background: 'fff',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should validate correct params', () => {
      const validation = v.validate({
        rotate: {
          deg: 200,
          exif: true,
          background: 'ffffff',
        },
      }, schema);

      assert.ok(validation.errors.length === 0);
    });

    it('should fail on wrong params (wrong exif rotation)', () => {
      const validation = v.validate({
        rotate: {
          deg: 123,
          exif: 'true',
          background: 'ffffff',
        },
      }, schema);

      assert.ok(validation.errors.length === 1);
    });
  });
});
