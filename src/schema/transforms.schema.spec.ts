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
import { getValidator, TransformSchema } from './';

describe('Transforms Schema', () => {

  const validator = getValidator(TransformSchema);

  const validate = (params) => {
    const res = validator(params);
    return res.errors.length === 0 ? true : false;
  };

  const assertFail = (res) => assert.ok(!res);

  it('should load json schema', () => {
    // console.log(schema);
  });

  describe('Watermark', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: 'top',
        },
      }));
    });

    it('should validate correct params (position array)', () => {
      assert.ok(validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: ['top', 'left'],
        },
      }));
    });

    it('should fail on wrong position params [top, bottom]', () => {
      assertFail(validate({
        watermark: {
          file: 'testfilehandle',
          size: 300,
          position: ['top', 'bottom'],
        },
      }));
    });
  });

  describe('Partial Blur', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        partial_blur: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: 18.2,
          blur: 12,
          type: 'rect',
        },
      }));
    });

    it('should fail on wrong params (amount, blur, type)', () => {
      assertFail(validate({
        partial_blur: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: -10,
          blur: 300,
          type: 'wrong_type',
        },
      }));
    });

    it('should fail on wrong params (objects)', () => {
      assertFail(validate({
        partial_blur: {
          objects: [
            [1, 1, 2],
            [1, 1, 32, 15, 32],
          ],
          amount: 10,
          blur: 20,
        },
      }));
    });
  });

  describe('Partial Pixelate', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: 100,
          blur: 12.2,
          type: 'oval',
        },
      }));
    });

    it('should fail on wrong params (amount, blur, type)', () => {
      assertFail(validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2, 2],
            [1, 1, 32, 15],
          ],
          amount: -10,
          blur: 300,
          type: 'wrong_type',
        },
      }));
    });

    it('should fail on wrong params (objects)', () => {
      assertFail(validate({
        partial_pixelate: {
          objects: [
            [1, 1, 2],
            [1, 1, 32, 15, 32],
          ],
          amount: 10,
          blur: 20,
        },
      }));
    });
  });

  describe('Crop', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        crop: {
          dim: [1, 1, 2, 2],
        },
      }));
    });

    it('should fail on empty dim params', () => {
      assertFail(validate({
        crop: {
          dim: [],
        },
      }));
    });

    it('should fail on wrong params (minimum value for 2 first items)', () => {
      assertFail(validate({
        crop: {
          dim: [2, 1, 0, 2],
        },
      }));
    });

    it('should fail on wrong params (5 items in array)', () => {
      assertFail(validate({
        crop: {
          dim: [1, 1, 2, 2, 4],
        },
      }));
    });
  });

  describe('Resize', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        resize: {
          width: 10,
          height: 20,
          fit: 'crop',
          align: ['top', 'left'],
        },
      }));
    });

    it('should validate correct when only one width or height is provided', () => {
      assert.ok(validate({
        resize: {
          width: 10,
          fit: 'crop',
          align: 'left',
        },
      }));

      assert.ok(validate({
        resize: {
          height: 10,
          fit: 'crop',
          align: 'left',
        },
      }));
    });

    it('should fail on wrong params (missing width and height)', () => {
      assertFail(validate({
        resize: {
          fit: 'crop',
          align: 'left',
        },
      }));
    });
  });

  describe('Resize', () => {
    it('should validate correct params', () => {
      assert.ok(validate({
        rotate: {
          deg: 'exif',
          exif: false,
          background: 'fff',
        },
      }));
    });

    it('should validate correct params', () => {
      assert.ok(validate({
        rotate: {
          deg: 200,
          exif: true,
          background: 'ffffff',
        },
      }));
    });

    it('should fail on wrong params (wrong exif rotation)', () => {
      assertFail(validate({
        rotate: {
          deg: 123,
          exif: 'true',
          background: 'ffffff',
        },
      }));
    });
  });

  describe('Pdfinfo', () => {
    it('should validate correct params with bool value', () => {
      assert.ok(validate({
        pdfinfo: true,
      }));
    });

    it('should validate correct params with color info', () => {
      assert.ok(validate({
        pdfinfo: {
          colorinfo: true,
        },
      }));
    });
  });

  describe('Pdfconvert', () => {
    describe('Pages', () => {
      [[1,2], ['1-', 3], ['-2']].forEach((val) => {
        it(`should validate on correct page "${val}"`, () => {
          assert.ok(validate({
            pdfconvert: {
              pages: val,
            },
          }));
        });
      });

      it('should return error on fail page "1a"', () => {
        assertFail(validate({
          pdfconvert: {
            pages: '1a',
          },
        }));
      });

    });

    describe('Page orientation', () => {
      it('should pass on correct orientation "landscape"', () => {
        assert.ok(validate({
          pdfconvert: {
            pageorientation: 'landscape',
          },
        }));
      });

      it('should pass on correct orientation "portrait"', () => {
        assert.ok(validate({
          pdfconvert: {
            pageorientation: 'portrait',
          },
        }));
      });

      it('should fail on wrong orientation "landscape1"', () => {
        assertFail(validate({
          pdfconvert: {
            pageorientation: 'landscape1',
          },
        }));
      });
    });

    describe('Page format', () => {
      ['a2', 'a3', 'a4', 'a5', 'b4', 'b5', 'letter', 'legal', 'tabloid'].forEach((val) => {
        it(`should when correct page format is provided ${val}`, () => {
          assert.ok(validate({
            pdfconvert: {
              pages: [1,2],
              pageformat: val,
            },
          }));
        });
      });

      it('should fail on wrong page format ie a22', () => {
        assertFail(validate({
          pdfconvert: {
            pageformat: 'a22',
          },
        }));
      });
    });
  });
});

// import * as assert from 'assert';
// import { getValidator, TransformSchema } from './';

// describe('Transforms Schema', () => {

//   const validate = getValidator(TransformSchema);

//   const assertFail = (val) => assert.ok(!val);

//   it('should load json schema', () => {
//     // console.log(schema);
//   });

//   describe('Watermark', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         watermark: {
//           file: 'testfilehandle',
//           size: 300,
//           position: 'top',
//         },
//       }));
//     });

//     it('should validate correct params (position array)', () => {
//       assert.ok(validate({
//         watermark: {
//           file: 'testfilehandle',
//           size: 300,
//           position: ['top', 'left'],
//         },
//       }));
//     });

//     it('should fail on wrong position params [top, bottom]', () => {
//       assertFail(validate({
//         watermark: {
//           file: 'testfilehandle',
//           size: 300,
//           position: ['top', 'bottom'],
//         },
//       }));
//     });
//   });

//   describe('Partial Blur', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         partial_blur: {
//           objects: [
//             [1, 1, 2, 2],
//             [1, 1, 32, 15],
//           ],
//           amount: 18.2,
//           blur: 12,
//           type: 'rect',
//         },
//       }));
//     });

//     it('should fail on wrong params (amount, blur, type)', () => {
//       assertFail(validate({
//         partial_blur: {
//           objects: [
//             [1, 1, 2, 2],
//             [1, 1, 32, 15],
//           ],
//           amount: -10,
//           blur: 300,
//           type: 'wrong_type',
//         },
//       }));
//     });

//     it('should fail on wrong params (objects)', () => {
//       assertFail(validate({
//         partial_blur: {
//           objects: [
//             [1, 1, 2],
//             [1, 1, 32, 15, 32],
//           ],
//           amount: 10,
//           blur: 20,
//         },
//       }));
//     });
//   });

//   describe('Partial Pixelate', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         partial_pixelate: {
//           objects: [
//             [1, 1, 2, 2],
//             [1, 1, 32, 15],
//           ],
//           amount: 100,
//           blur: 12.2,
//           type: 'oval',
//         },
//       }));
//     });

//     it('should fail on wrong params (amount, blur, type)', () => {
//       assertFail(validate({
//         partial_pixelate: {
//           objects: [
//             [1, 1, 2, 2],
//             [1, 1, 32, 15],
//           ],
//           amount: -10,
//           blur: 300,
//           type: 'wrong_type',
//         },
//       }));
//     });

//     it('should fail on wrong params (objects)', () => {
//       assertFail(validate({
//         partial_pixelate: {
//           objects: [
//             [1, 1, 2],
//             [1, 1, 32, 15, 32],
//           ],
//           amount: 10,
//           blur: 20,
//         },
//       }));
//     });
//   });

//   describe('Crop', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         crop: {
//           dim: [1, 1, 2, 2],
//         },
//       }));
//     });

//     it('should fail on empty dim params', () => {
//       assertFail(validate({
//         crop: {
//           dim: [],
//         },
//       }));
//     });

//     it('should fail on wrong params (minimum value for 2 first items)', () => {
//       assertFail(validate({
//         crop: {
//           dim: [2, 1, 0, 2],
//         },
//       }));
//     });

//     it('should fail on wrong params (5 items in array)', () => {
//       assertFail(validate({
//         crop: {
//           dim: [1, 1, 2, 2, 4],
//         },
//       }));
//     });
//   });

//   describe('Resize', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         resize: {
//           width: 10,
//           height: 20,
//           fit: 'crop',
//           align: ['top', 'left'],
//         },
//       }));
//     });

//     it('should validate correct when only one width or height is provided', () => {
//       assert.ok(validate({
//         resize: {
//           width: 10,
//           fit: 'crop',
//           align: 'left',
//         },
//       }));

//       assert.ok(validate({
//         resize: {
//           height: 10,
//           fit: 'crop',
//           align: 'left',
//         },
//       }));
//     });

//     it('should fail on wrong params (missing width and height)', () => {
//       assertFail(validate({
//         resize: {
//           fit: 'crop',
//           align: 'left',
//         },
//       }));
//     });
//   });

//   describe('Resize', () => {
//     it('should validate correct params', () => {
//       assert.ok(validate({
//         rotate: {
//           deg: 'exif',
//           exif: false,
//           background: 'fff',
//         },
//       }));
//     });

//     it('should validate correct params', () => {
//       assert.ok(validate({
//         rotate: {
//           deg: 200,
//           exif: true,
//           background: 'ffffff',
//         },
//       }));
//     });

//     it('should fail on wrong params (wrong exif rotation)', () => {
//       assertFail(validate({
//         rotate: {
//           deg: 123,
//           exif: 'true',
//           background: 'ffffff',
//         },
//       }));
//     });
//   });

//   describe('Pdfinfo', () => {
//     it('should validate correct params with bool value', () => {
//       assert.ok(validate({
//         pdfinfo: true,
//       }));
//     });

//     it('should validate correct params with color info', () => {
//       assert.ok(validate({
//         pdfinfo: {
//           colorinfo: true,
//         },
//       }));
//     });
//   });

//   describe('Pdfconvert', () => {
//     describe('Pages', () => {
//       [[1,2], ['1-', 3], ['-2']].forEach((val) => {
//         it(`should validate on correct page "${val}"`, () => {
//           assert.ok(validate({
//             pdfconvert: {
//               pages: val,
//             },
//           }));
//         });
//       });

//       it('should return error on fail page "1a"', () => {
//         assertFail(validate({
//           pdfconvert: {
//             pages: '1a',
//           },
//         }));
//       });

//     });

//     describe('Page orientation', () => {
//       it('should pass on correct orientation "landscape"', () => {
//         assert.ok(validate({
//           pdfconvert: {
//             pageorientation: 'landscape',
//           },
//         }));
//       });

//       it('should pass on correct orientation "portrait"', () => {
//         assert.ok(validate({
//           pdfconvert: {
//             pageorientation: 'portrait',
//           },
//         }));
//       });

//       it('should fail on wrong orientation "landscape1"', () => {
//         assertFail(validate({
//           pdfconvert: {
//             pageorientation: 'landscape1',
//           },
//         }));
//       });
//     });

//     describe('Page format', () => {
//       ['a2', 'a3', 'a4', 'a5', 'b4', 'b5', 'letter', 'legal', 'tabloid'].forEach((val) => {
//         it(`should when correct page format is provided ${val}`, () => {
//           assert.ok(validate({
//             pdfconvert: {
//               pages: [1,2],
//               pageformat: val,
//             },
//           }));
//         });
//       });

//       it('should fail on wrong page format ie a22', () => {
//         assertFail(validate({
//           pdfconvert: {
//             pageformat: 'a22',
//           },
//         }));
//       });
//     });
//   });
// });
