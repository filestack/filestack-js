/*
 * Copyright (c) 2019 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Filelink, ShapeType, VideoAccessMode, AnimationParams, FitOptions, Align } from './filelink';
import { TransformSchema } from './../schema/transforms.schema';
import * as validator from '../schema';

const defaultSource = '5aYkEQJSQCmYShsoCnZN';
const defaultApikey = 'DEFAULT_API_KEY';

describe('filelink', () => {
  beforeAll(() => {
    spyOn(validator, 'getValidator').and.callThrough();
  });

  it('should properly instantiate Filelink', () => {
    const filelink = new Filelink(defaultSource);
    expect(filelink).toBeDefined();
    expect(filelink).toBeInstanceOf(Filelink);
  });

  it('should throw an error when handle is invalid', () => {
    const source = '*/5aYkEQJSQCmYShsoCnZN';
    expect(() => {
      const f = new Filelink(source);
    }).toThrow('Invalid filestack source provided');
  });

  it('should support workflows source', () => {
    const source = 'wf://975092d5-2eb3-460e-aca8-e7b00a0838d5/2ec47319-24c8-4ced-9ae3-10a6d450a736/1c04a766e53633f1256759f2d06a50a3';
    expect(() => {
      const f = new Filelink(source);
    }).not.toThrow();
  });

  it('should throw an error when external handle and without apikey', () => {
    const source = 'src://test123/example.jpg';

    expect(() => {
      const filelink = new Filelink(source);
    }).toThrow('External sources requires apikey to handle transforms');
  });

  it('should throw an error when handle is invalid', () => {
    const source = '*/5aYkEQJSQCmYShsoCnZN';
    expect(() => {
      const f = new Filelink(source);
    }).toThrow('Invalid filestack source provided');
  });

  it('should throw an error when external handle and without apikey', () => {
    const source = 'src://test123/example.jpg';

    expect(() => {
      const filelink = new Filelink(source);
    }).toThrow('External sources requires apikey to handle transforms');
  });

  it('should be able to convert filelink to string', () => {
    const filelink = new Filelink(defaultSource);
    const result = filelink.toString();
    expect(result).toBe('https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN');
  });

  it('should allow to set validator status with toString method', () => {
    const filelink = new Filelink(defaultSource);
    filelink.setUseValidator(false);

    expect(
      filelink
        .resize({
          // @ts-ignore
          t: 1,
        })
        .toString()
    ).toEqual('https://cdn.filestackcontent.com/resize=t:1/5aYkEQJSQCmYShsoCnZN');
  });

  it('should allow to set validator status with getTransformations method', () => {
    const filelink = new Filelink(defaultSource);
    filelink.setUseValidator(false);
    filelink.resize({
      // @ts-ignore
      t: 1,
    });

    expect(filelink.getTransformations()).toEqual([
      {
        name: 'resize',
        params: { t: 1 },
      },
    ]);
  });

  it('should create filelink with apikey when is provided', () => {
    const filelink = new Filelink(defaultSource, defaultApikey);
    const result = filelink.toString();
    expect(result).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to use many tasks at once and reset them', () => {
    const filelink = new Filelink(defaultSource);
    const resizeParams = {
      width: 200,
    };
    const rotateParams = {
      deg: 90,
    };
    filelink
      .resize(resizeParams)
      .rotate(rotateParams)
      .crop({
        dim: [20, 20, 250, 250],
      });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/resize=width:200/rotate=deg:90/crop=dim:[20,20,250,250]/5aYkEQJSQCmYShsoCnZN');
    filelink.reset();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to get transformations', () => {
    const filelink = new Filelink(defaultSource);
    const resizeParams = {
      width: 200,
    };
    const rotateParams = {
      deg: 90,
    };
    filelink
      .resize(resizeParams)
      .rotate(rotateParams)
      .crop({
        dim: [20, 20, 250, 250],
      });
    const expected = [
      { name: 'resize', params: { width: 200 } },
      { name: 'rotate', params: { deg: 90 } },
      { name: 'crop', params: { dim: [20, 20, 250, 250] } },
    ];
    expect(filelink.getTransformations()).toEqual(expected);
  });

  it('should be able to getValidationSchema', () => {
    const filelink = new Filelink(defaultSource);
    const result = filelink.getValidationSchema();
    expect(result).toEqual(TransformSchema);
  });

  it('should not require apikay on filestack external url', () => {
    const filelink = new Filelink('https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN');
    filelink.shadow(false).upscale();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/upscale/"https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN"');
  });

  it('should be able to disable selected task', () => {
    const filelink = new Filelink(defaultSource);
    filelink.shadow(false).upscale();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/upscale/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to create filelink for many handles', () => {
    const sourceArr = ['5aYkEQJSQCmYShsoCnZN', '4aYkEQJSQCmYShsoCnZN'];
    const filelink = new Filelink(sourceArr);
    expect(filelink.toString()).toEqual('https://cdn.filestackcontent.com/[5aYkEQJSQCmYShsoCnZN,4aYkEQJSQCmYShsoCnZN]');
    filelink.setBase64(true);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/b64://WzVhWWtFUUpTUUNtWVNoc29DblpOLDRhWWtFUUpTUUNtWVNoc29DblpOXQ==');
  });

  it('should be able to create filelink for many src handles', () => {
    const sourceArr = ['src://test123/example.jpg', 'src://test123/flug_9-trans_atlantik-400dpi.jpg'];
    const filelink = new Filelink(sourceArr, defaultApikey);
    expect(filelink.toString()).toEqual('https://cdn.filestackcontent.com/DEFAULT_API_KEY/["src://test123/example.jpg","src://test123/flug_9-trans_atlantik-400dpi.jpg"]');
  });

  it('should throw an error if task params are not valid', () => {
    const filelink = new Filelink(defaultSource);
    expect(() => {
      // @ts-ignore
      filelink.resize({ r: 2 }).toString();
    }).toThrow('Params validation error');
  });

  it('should omit transformations with empty options', () => {
    const filelink = new Filelink(defaultSource);
    filelink.upscale(false);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN');
  });

  it('should throw an error if source does not exists', () => {
    expect(() => {
      return new Filelink('');
    }).toThrow('Source not Set');
  });

  it('should be able to use custom cname', () => {
    const filelinkCname = new Filelink(defaultSource, defaultApikey);
    const cname = 'newcname.com';
    filelinkCname.setCname(cname);
    expect(filelinkCname.toString()).toBe('https://cdn.newcname.com/DEFAULT_API_KEY/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to use custom domain', () => {
    const filelinkCustomDomain = new Filelink(defaultSource, defaultApikey);
    const customDomain = 'https://customDomain.com';
    filelinkCustomDomain.setCustomDomain(customDomain);
    expect(filelinkCustomDomain.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/5aYkEQJSQCmYShsoCnZN');
  });
});

describe('Different tasks', () => {
  let filelink;

  beforeEach(() => {
    filelink = new Filelink(defaultSource, defaultApikey);
  });

  afterEach(() => {
    filelink = null;
  });

  it('should be able to create filelink when handle is base64', () => {
    filelink.upscale();
    filelink.setBase64(true);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/b64/W3sibmFtZSI6InVwc2NhbGUifV0=/b64://NWFZa0VRSlNRQ21ZU2hzb0NuWk4=');
  });

  it('should be able to autoImage transformation', () => {
    filelink.autoImage();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/auto_image/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add flip', () => {
    filelink.flip();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/flip/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add flop', () => {
    filelink.flop();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/flop/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to enhance', () => {
    filelink.enhance();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/enhance/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to redeye', () => {
    filelink.redeye();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/redeye/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to monochrome', () => {
    filelink.monochrome();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/monochrome/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to negative', () => {
    filelink.negative();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/negative/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to process tags', () => {
    filelink.tags();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/tags/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to sfw', () => {
    filelink.sfw();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/sfw/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to store', () => {
    const storeParams = {};
    filelink.store(storeParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/store/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to disable cache', () => {
    filelink.cache(false);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/cache=false/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to set cache params', () => {
    const cacheParams = {
      expiry: 666,
    };
    filelink.cache(cacheParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/cache=expiry:666/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able add animation transform', () => {
    const params: AnimationParams = {
      loop: 1,
      delay: 10,
      width: 10,
      height: 10,
      fit: FitOptions.scale,
      background: 'transparent',
      align: [Align.top, Align.center],
    };

    filelink.animate(params);
    expect(filelink.toString()).toBe(
      'https://cdn.filestackcontent.com/DEFAULT_API_KEY/animate=loop:1,delay:10,width:10,height:10,fit:scale,background:transparent,align:[top,center]/5aYkEQJSQCmYShsoCnZN'
    );
  });

  it('should be able to resize', () => {
    const resizeParams = {
      width: 200,
    };
    filelink.resize(resizeParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/resize=width:200/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to crop', () => {
    filelink.crop({
      dim: [20, 20, 250, 250],
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/crop=dim:[20,20,250,250]/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to rotate', () => {
    const rotateParams = {
      deg: 90,
    };
    filelink.rotate(rotateParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/rotate=deg:90/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to detect faces', () => {
    filelink.detectFaces({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/detect_faces/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to crop faces', () => {
    filelink.cropFaces({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/crop_faces/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to pixelate faces', () => {
    filelink.pixelateFaces({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/pixelate_faces/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to blur faces', () => {
    const blurFacesParams = {
      amount: 3,
      blur: 5,
      type: ShapeType.oval,
    };
    filelink.blurFaces(blurFacesParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/blur_faces=amount:3,blur:5,type:oval/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to round cornerns', () => {
    const roundedCornersParams = {
      radius: 50,
      blur: 5,
    };
    filelink.roundedCorners(roundedCornersParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/rounded_corners=radius:50,blur:5/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to polaroid', () => {
    const polaroidParams = {
      color: 'ff0000',
      rotate: 50,
    };
    filelink.polaroid(polaroidParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/polaroid=color:ff0000,rotate:50/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to vignette', () => {
    const vignetteParams = {
      background: 'ff0000',
      amount: 5,
    };
    filelink.vignette(vignetteParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/vignette=background:ff0000,amount:5/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to tornEdges', () => {
    filelink.tornEdges({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/torn_edges/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to shadow', () => {
    filelink.shadow();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/shadow/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to circle', () => {
    filelink.circle({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/circle/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to border', () => {
    filelink.border();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/border/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to vignette', () => {
    filelink.vignette({});
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/vignette/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to sharpen', () => {
    const sharpenParams = {
      amount: 5,
    };
    filelink.sharpen(sharpenParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/sharpen=amount:5/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to blur', () => {
    const blurParams = {
      amount: 5,
    };
    filelink.blur(blurParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/blur=amount:5/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to blackwhite', () => {
    const blackwhiteParams = {
      threshold: 50,
    };
    filelink.blackwhite(blackwhiteParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/blackwhite=threshold:50/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to sepia', () => {
    filelink.sepia();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/sepia/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to pixelate', () => {
    filelink.pixelate();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/pixelate/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to oilPaint', () => {
    filelink.oilPaint();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/oil_paint/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to modulate', () => {
    filelink.modulate();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/modulate/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to partialPixelate', () => {
    filelink.partialPixelate({
      objects: [[20, 20, 50, 50]],
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/partial_pixelate=objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to partialBlur', () => {
    filelink.partialBlur({
      amount: 5,
      objects: [[20, 20, 50, 50]],
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/partial_blur=amount:5,objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to collage', () => {
    filelink.collage({
      files: ['http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg'],
      width: 200,
      height: 200,
    });

    expect(filelink.toString()).toBe(
      'https://cdn.filestackcontent.com/DEFAULT_API_KEY/collage=files:["http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg"],width:200,height:200/5aYkEQJSQCmYShsoCnZN'
    );
  });

  it('should be able to upscale', () => {
    filelink.upscale();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/upscale/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to ascii', () => {
    filelink.ascii();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/ascii/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to quality', () => {
    const qualityParams = {
      value: 5,
    };
    filelink.quality(qualityParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/quality=value:5/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to use security', () => {
    const securityParams = {
      policy: 'examplePolicy',
      signature: 'exampleSignature',
    };
    filelink.security(securityParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/security=policy:examplePolicy,signature:exampleSignature/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able output', () => {
    const outputParams = {
      format: 'png',
    };
    filelink.output(outputParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/output=format:png/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to videoConvert', () => {
    const videoConvertParams = {
      aspect_mode: VideoAccessMode.letterbox,
      upscale: true,
    };
    filelink.videoConvert(videoConvertParams);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/video_convert=aspect_mode:letterbox,upscale:true/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to URLScreenshot', () => {
    filelink.URLScreenshot();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/urlscreenshot/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to PDFInfo', () => {
    filelink.PDFInfo();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/pdfinfo/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to PDFConvert', () => {
    filelink.PDFConvert();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/pdfconvert/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to force cache', () => {
    filelink.cache(true);
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/cache/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add fallback transformation', () => {
    filelink.fallback({
      handle: 'http:test.com',
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/fallback=handle:http:test.com/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add zip trnasformation', () => {
    filelink.zip();
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/zip/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add minify js transformation', () => {
    filelink.minifyJs({
      mangle: true,
      gzip: true,
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/minify_js=mangle:true,gzip:true/5aYkEQJSQCmYShsoCnZN');
  });

  it('should be able to add minify css transformation', () => {
    filelink.minifyCss({
      level: 1,
      gzip: true,
    });
    expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/minify_css=level:1,gzip:true/5aYkEQJSQCmYShsoCnZN');
  });
});
