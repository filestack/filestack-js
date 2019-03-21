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

import { Filelink, ShapeType, VideoAccessMode } from './filelink';
import { TransformSchema } from './../schema/transforms.schema';

const globalAny: any = global;

globalAny.btoa = (str) => {
  return Buffer.from(str).toString('base64');
};

describe('filelink', () => {
  const defaultSource = '5aYkEQJSQCmYShsoCnZN';
  const defaultApikey = 'CmrB9kEilS1SQeHIDf3wtz';
  it('should properly instantiate Filelink', () => {
    const filelink = new Filelink(defaultSource);
    expect(filelink).toBeDefined();
    expect(filelink).toBeInstanceOf(Filelink);
  });
  it('should throw error when handle is invalid', () => {
    const source = '*/5aYkEQJSQCmYShsoCnZN';
    let filelink;
    expect(() => { filelink = new Filelink(source); }).toThrow('Invalid filestack source provided');
  });
  it('should throw error when external handle and without apikey', () => {
    const source = 'src://test123/flug_8-trans_atlantik-300dpi.jpg';
    let filelink;
    expect(() => { filelink = new Filelink(source); }).toThrow('External sources requires apikey to handle transforms');
  });
  it('should be able to convert filelink to string', () => {
    const filelink = new Filelink(defaultSource);
    const result = filelink.toString();
    expect(result).toBe('https://cdn.filestackcontent.com/5aYkEQJSQCmYShsoCnZN');
  });
  it('should create filelink with apikey when is provided', () => {
    const filelink = new Filelink(defaultSource, defaultApikey);
    const result = filelink.toString();
    expect(result).toBe('https://cdn.filestackcontent.com/CmrB9kEilS1SQeHIDf3wtz/5aYkEQJSQCmYShsoCnZN');
  });
  it('should be able to use many tasks at once and reset them', () => {
    const filelink = new Filelink(defaultSource);
    const resizeParams = {
      width: 200,
    };
    const rotateParams = {
      deg: 90,
    };
    filelink.resize(resizeParams).rotate(rotateParams).crop({
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
    filelink.resize(resizeParams).rotate(rotateParams).crop({
      dim: [20, 20, 250, 250],
    });
    const expected = [{ 'name': 'resize', 'params': { 'width': 200 } }, { 'name': 'rotate', 'params': { 'deg': 90 } }, { 'name': 'crop', 'params': { 'dim': [20, 20, 250, 250] } }];
    expect(filelink.getTransformations()).toEqual(expected);
  });
  it('should be able to getValidationSchema', () => {
    const filelink = new Filelink(defaultSource);
    const result = filelink.getValidationSchema();
    expect(result).toEqual(TransformSchema);
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
    const sourceArr = ['src://test123/flug_8-trans_atlantik-300dpi.jpg', 'src://test123/flug_9-trans_atlantik-400dpi.jpg'];
    const filelink = new Filelink(sourceArr, defaultApikey);
    expect(filelink.toString()).toEqual('https://cdn.filestackcontent.com/CmrB9kEilS1SQeHIDf3wtz/["src://test123/flug_8-trans_atlantik-300dpi.jpg","src://test123/flug_9-trans_atlantik-400dpi.jpg"]');
  });
  it('should throw error if task params are not valid', () => {
    const filelink = new Filelink(defaultSource);
    expect(() => { filelink.resize({}); }).toThrow('Task \"resize\" validation error, Params: {}');
  });
  it('should throw error if source does not exists', () => {
    expect(() => { return new Filelink(''); }).toThrow('Source not Set');
  });
  describe('Different tasks', () => {
    let filelink = new Filelink(defaultSource, defaultApikey);
    afterEach(() => {
      filelink = new Filelink(defaultSource, defaultApikey);
    });
    it('should be able to create filelink when handle is base64', () => {
      filelink.upscale();
      filelink.setBase64(true);
      expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/CmrB9kEilS1SQeHIDf3wtz/b64/W3sibmFtZSI6InVwc2NhbGUifV0=/b64://NWFZa0VRSlNRQ21ZU2hzb0NuWk4=');
    });
    it('should be able to use custom cname', () => {
      const cname = 'http://newcname.com';
      filelink.setCname(cname);
      expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/CmrB9kEilS1SQeHIDf3wtz/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to use custom domain', () => {
      const customDomain = 'https://customDomain.com';
      filelink.setCustomDomain(customDomain);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to add flip', () => {
      filelink.flip();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/flip/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to add flop', () => {
      filelink.flop();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/flop/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to enhance', () => {
      filelink.enhance();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/enhance/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to redeye', () => {
      filelink.redeye();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/redeye/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to monochrome', () => {
      filelink.monochrome();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/monochrome/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to negative', () => {
      filelink.negative();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/negative/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to tags', () => {
      filelink.tags();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/tags/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sfw', () => {
      filelink.sfw();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/sfw/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to store', () => {
      const storeParams = {};
      filelink.store(storeParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/store/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to disable cache', () => {
      filelink.cache(false);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/cache=false/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to set cache params', () => {
      const cacheParams = {
        expiry: 666,
      };
      filelink.cache(cacheParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/cache=expiry:666/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to resize', () => {
      const resizeParams = {
        width: 200,
      };
      filelink.resize(resizeParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/resize=width:200/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to crop', () => {
      filelink.crop({
        dim: [20, 20, 250, 250],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/crop=dim:[20,20,250,250]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to rotate', () => {
      const rotateParams = {
        deg: 90,
      };
      filelink.rotate(rotateParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/rotate=deg:90/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to detect faces', () => {
      filelink.detectFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/detect_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to crop faces', () => {
      filelink.cropFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/crop_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to pixelate faces', () => {
      filelink.pixelateFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/pixelate_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blur faces', () => {
      const blurFacesParams = {
        amount: 3,
        blur: 5,
        type: ShapeType.oval,
      };
      filelink.blurFaces(blurFacesParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/blur_faces=amount:3,blur:5,type:oval/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to round cornerns', () => {
      const roundedCornersParams = {
        radius: 50,
        blur: 5,
      };
      filelink.roundedCorners(roundedCornersParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/rounded_corners=radius:50,blur:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to polaroid', () => {
      const polaroidParams = {
        color: 'ff0000',
        rotate: 50,
      };
      filelink.polaroid(polaroidParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/polaroid=color:ff0000,rotate:50/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to vignette', () => {
      const vignetteParams = {
        background: 'ff0000',
        amount: 5,
      };
      filelink.vignette(vignetteParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/vignette=background:ff0000,amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to tornEdges', () => {
      filelink.tornEdges({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/torn_edges/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to shadow', () => {
      filelink.shadow();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/shadow/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to circle', () => {
      filelink.circle({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/circle/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to border', () => {
      filelink.border();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/border/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to vignette', () => {
      filelink.vignette({});
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/vignette/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sharpen', () => {
      const sharpenParams = {
        amount: 5,
      };
      filelink.sharpen(sharpenParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/sharpen=amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blur', () => {
      const blurParams = {
        amount: 5,
      };
      filelink.blur(blurParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/blur=amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blackwhite', () => {
      const blackwhiteParams = {
        threshold: 50,
      };
      filelink.blackwhite(blackwhiteParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/blackwhite=threshold:50/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sepia', () => {
      filelink.sepia();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/sepia/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to pixelate', () => {
      filelink.pixelate();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/pixelate/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to oilPaint', () => {
      filelink.oilPaint();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/oil_paint/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to modulate', () => {
      filelink.modulate();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/modulate/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to partialPixelate', () => {
      filelink.partialPixelate({
        objects: [
          [20, 20, 50, 50],
        ],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/partial_pixelate=objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to partialBlur', () => {
      filelink.partialBlur({
        amount: 5,
        objects: [
          [20, 20, 50, 50],
        ],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/partial_blur=amount:5,objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to collage', () => {
      filelink.collage({
        files: [
          'http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg',
        ],
        width: 200,
        height: 200,
      });
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/collage=files:[\"http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg\"],width:200,height:200/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to upscale', () => {
      filelink.upscale();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/upscale/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to ascii', () => {
      filelink.ascii();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/ascii/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to quality', () => {
      const qualityParams = {
        value: 5,
      };
      filelink.quality(qualityParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/quality=value:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to use security', () => {
      const securityParams = {
        policy: 'blablabla',
        signature: 'blablabla',
      };
      filelink.security(securityParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/security=policy:blablabla,signature:blablabla/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able output', () => {
      const outputParams = {
        format: 'png',
      };
      filelink.output(outputParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/output=format:png/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to videoConvert', () => {
      const videoConvertParams = {
        aspect_mode: VideoAccessMode.letterbox,
        upscale: true,
      };
      filelink.videoConvert(videoConvertParams);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/video_convert=aspect_mode:letterbox,upscale:true/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to URLScreenshot', () => {
      filelink.URLScreenshot();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/urlscreenshot/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to PDFInfo', () => {
      filelink.PDFInfo();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/pdfinfo/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to PDFConvert', () => {
      filelink.PDFConvert();
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/pdfconvert/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to force cache', () => {
      filelink.cache(true);
      expect(filelink.toString()).toBe('https://customDomain.com/CmrB9kEilS1SQeHIDf3wtz/cache/5aYkEQJSQCmYShsoCnZN');
    });
  });
});
