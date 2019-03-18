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

import { Filelink } from './filelink';

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
  describe('simple transform flow', () => {
    let filelink = new Filelink(defaultSource, defaultApikey);
    // beforeAll(() => {
    //   let filelink = new Filelink(defaultSource, defaultApikey);
    // });
    // beforeEach(() => {
    //   let filelink = new Filelink(defaultSource, defaultApikey);
    // });
    afterEach(() => {
      filelink = null;
      filelink = new Filelink(defaultSource, defaultApikey);
    });
    it('should be able to create filelink when handle is base64', () => {
      filelink.setBase64(true);
      expect(filelink.toString()).toBe('https://cdn.filestackcontent.com/CmrB9kEilS1SQeHIDf3wtz/b64://NWFZa0VRSlNRQ21ZU2hzb0NuWk4=');
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
  });
});
