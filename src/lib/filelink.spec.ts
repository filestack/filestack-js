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
  const defaultApikey = 'DEFAULT_API_KEY';
  it('should properly instantiate Filelink', () => {
    const filelink = new Filelink(defaultSource);
    expect(filelink).toBeDefined();
    expect(filelink).toBeInstanceOf(Filelink);
  });
  it('should throw an error when handle is invalid', () => {
    const source = '*/5aYkEQJSQCmYShsoCnZN';
    let filelink;
    expect(() => { filelink = new Filelink(source); }).toThrow('Invalid filestack source provided');
  });
  it('should throw an error when external handle and without apikey', () => {
    const source = 'src://test123/example.jpg';
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
    const sourceArr = ['src://test123/example.jpg', 'src://test123/flug_9-trans_atlantik-400dpi.jpg'];
    const filelink = new Filelink(sourceArr, defaultApikey);
    expect(filelink.toString()).toEqual('https://cdn.filestackcontent.com/DEFAULT_API_KEY/["src://test123/example.jpg","src://test123/flug_9-trans_atlantik-400dpi.jpg"]');
  });
  it('should throw an error if task params are not valid', () => {
    const filelink = new Filelink(defaultSource);
    expect(() => { filelink.resize({}); }).toThrow('Task \"resize\" validation error, Params: {}');
  });
  it('should throw an error if source does not exists', () => {
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
      expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/DEFAULT_API_KEY/b64/W3sibmFtZSI6InVwc2NhbGUifV0=/b64://NWFZa0VRSlNRQ21ZU2hzb0NuWk4=');
    });
    it('should be able to use custom cname', () => {
      const cname = 'newcname.com';
      filelink.setCname(cname);
      expect(filelink.toString()).toBe('https://cdn.newcname.com/DEFAULT_API_KEY/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to use custom domain', () => {
      const customDomain = 'https://customDomain.com';
      filelink.setCustomDomain(customDomain);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to add flip', () => {
      filelink.flip();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/flip/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to add flop', () => {
      filelink.flop();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/flop/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to enhance', () => {
      filelink.enhance();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/enhance/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to redeye', () => {
      filelink.redeye();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/redeye/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to monochrome', () => {
      filelink.monochrome();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/monochrome/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to negative', () => {
      filelink.negative();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/negative/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to tags', () => {
      filelink.tags();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/tags/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sfw', () => {
      filelink.sfw();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/sfw/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to store', () => {
      const storeParams = {};
      filelink.store(storeParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/store/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to disable cache', () => {
      filelink.cache(false);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/cache=false/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to set cache params', () => {
      const cacheParams = {
        expiry: 666,
      };
      filelink.cache(cacheParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/cache=expiry:666/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to resize', () => {
      const resizeParams = {
        width: 200,
      };
      filelink.resize(resizeParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/resize=width:200/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to crop', () => {
      filelink.crop({
        dim: [20, 20, 250, 250],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/crop=dim:[20,20,250,250]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to rotate', () => {
      const rotateParams = {
        deg: 90,
      };
      filelink.rotate(rotateParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/rotate=deg:90/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to detect faces', () => {
      filelink.detectFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/detect_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to crop faces', () => {
      filelink.cropFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/crop_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to pixelate faces', () => {
      filelink.pixelateFaces({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/pixelate_faces/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blur faces', () => {
      const blurFacesParams = {
        amount: 3,
        blur: 5,
        type: ShapeType.oval,
      };
      filelink.blurFaces(blurFacesParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/blur_faces=amount:3,blur:5,type:oval/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to round cornerns', () => {
      const roundedCornersParams = {
        radius: 50,
        blur: 5,
      };
      filelink.roundedCorners(roundedCornersParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/rounded_corners=radius:50,blur:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to polaroid', () => {
      const polaroidParams = {
        color: 'ff0000',
        rotate: 50,
      };
      filelink.polaroid(polaroidParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/polaroid=color:ff0000,rotate:50/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to vignette', () => {
      const vignetteParams = {
        background: 'ff0000',
        amount: 5,
      };
      filelink.vignette(vignetteParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/vignette=background:ff0000,amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to tornEdges', () => {
      filelink.tornEdges({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/torn_edges/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to shadow', () => {
      filelink.shadow();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/shadow/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to circle', () => {
      filelink.circle({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/circle/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to border', () => {
      filelink.border();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/border/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to vignette', () => {
      filelink.vignette({});
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/vignette/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sharpen', () => {
      const sharpenParams = {
        amount: 5,
      };
      filelink.sharpen(sharpenParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/sharpen=amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blur', () => {
      const blurParams = {
        amount: 5,
      };
      filelink.blur(blurParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/blur=amount:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to blackwhite', () => {
      const blackwhiteParams = {
        threshold: 50,
      };
      filelink.blackwhite(blackwhiteParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/blackwhite=threshold:50/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to sepia', () => {
      filelink.sepia();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/sepia/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to pixelate', () => {
      filelink.pixelate();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/pixelate/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to oilPaint', () => {
      filelink.oilPaint();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/oil_paint/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to modulate', () => {
      filelink.modulate();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/modulate/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to partialPixelate', () => {
      filelink.partialPixelate({
        objects: [
          [20, 20, 50, 50],
        ],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/partial_pixelate=objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to partialBlur', () => {
      filelink.partialBlur({
        amount: 5,
        objects: [
          [20, 20, 50, 50],
        ],
      });
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/partial_blur=amount:5,objects:[[20,20,50,50]]/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to collage', () => {
      filelink.collage({
        files: [
          'http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg',
        ],
        width: 200,
        height: 200,
      });
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/collage=files:[\"http://welcome-swiss.com/wp-content/uploads/2015/12/Swiss-landscape.jpg\"],width:200,height:200/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to upscale', () => {
      filelink.upscale();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/upscale/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to ascii', () => {
      filelink.ascii();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/ascii/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to quality', () => {
      const qualityParams = {
        value: 5,
      };
      filelink.quality(qualityParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/quality=value:5/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to use security', () => {
      const securityParams = {
        policy: 'examplePolicy',
        signature: 'exampleSignature',
      };
      filelink.security(securityParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/security=policy:examplePolicy,signature:exampleSignature/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able output', () => {
      const outputParams = {
        format: 'png',
      };
      filelink.output(outputParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/output=format:png/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to videoConvert', () => {
      const videoConvertParams = {
        aspect_mode: VideoAccessMode.letterbox,
        upscale: true,
      };
      filelink.videoConvert(videoConvertParams);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/video_convert=aspect_mode:letterbox,upscale:true/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to URLScreenshot', () => {
      filelink.URLScreenshot();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/urlscreenshot/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to PDFInfo', () => {
      filelink.PDFInfo();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/pdfinfo/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to PDFConvert', () => {
      filelink.PDFConvert();
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/pdfconvert/5aYkEQJSQCmYShsoCnZN');
    });
    it('should be able to force cache', () => {
      filelink.cache(true);
      expect(filelink.toString()).toBe('https://customDomain.com/DEFAULT_API_KEY/cache/5aYkEQJSQCmYShsoCnZN');
    });
  });
});
