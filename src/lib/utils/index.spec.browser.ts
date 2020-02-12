/*
 * Copyright (c) 2019 by Filestack.
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
import * as utils from './index';

describe('utils:index', () => {
  describe('getVersion', () => {
    it('should return version string to replace', () => {
      expect(utils.getVersion()).toEqual(`JS-@{VERSION}`);
    });
  });

  describe('isFacebook', () => {
    const originalAgent = navigator.userAgent;

    const mockAgent = _value => ({
      get: () => _value,
      set: (v) => _value = v,
    });

    const defineAgent = (agent) => {
      try {
        Object.defineProperty(navigator, 'userAgent', mockAgent(agent));
      } catch (e) {
        navigator = Object.create(navigator, {
          userAgent: mockAgent(agent),
        });
      }
    };

    beforeEach(() => {
      mockAgent(originalAgent);
    });

    describe('should recognize all of facebook browser useragents', () => {
      const agents = [
        'Mozilla/5.0 (Linux; Android 7.1.1; Build/LMY47O.H18; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/127.0.0.22.69;]',
        'Mozilla/5.0 (Linux; Android 7.0; SM-G930F Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/127.0.0.22.69;]',
        'Mozilla/5.0 (Linux; Android 7.0; MHA-L29 Build/HUAWEIMHA-L29; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/127.0.0.22.69;]',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 [FBAN/FBIOS;FBAV/96.0.0.45.70;FBBV/60548545;FBDV/iPhone7,2;FBMD/iPhone;FBSN/iOS;FBSV/10.3.2;FBSS/2;FBCR/E-Plus;FBID/phone;FBLC/de_DE;FBOP/5;FBRV/0]',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 [FBAN/FBIOS;FBAV/90.0.0.51.69;FBBV/56254015;FBDV/iPhone6,2;FBMD/iPhone;FBSN/iOS;FBSV/10.2;FBSS/2;FBCR/1&1;FBID/phone;FBLC/de_DE;FBOP/5;FBRV/0]',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 [FBAN/FBIOS;FBAV/96.0.0.45.70;FBBV/60548545;FBDV/iPhone8,1;FBMD/iPhone;FBSN/iOS;FBSV/10.3.2;FBSS/2;FBCR/o2-de;FBID/phone;FBLC/de_DE;FBOP/5;FBRV/0]',
        'Mozilla/5.0 (Linux; Android 4.4.4; G7-L01 Build/HuaweiG7-L01) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/121.0.0.15.70;]',
      ];

      for (let i in agents) {
        it(`Should accept: ${agents[i]} as correct`, () => {
          defineAgent(agents[i]);
          expect(utils.isFacebook()).toBeTruthy();
        });
      }
    });

    describe('should not recognize user agent as facebook', () => {
      const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
        'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
      ];

      for (let i in agents) {
        it(`Should accept: ${agents[i]} as wrong`, () => {
          defineAgent(agents[i]);
          expect(utils.isFacebook()).toBeTruthy();
        });
      }
    });
  });

  describe('md5', () => {
    it('should return correct md5 value', () => {
      expect(utils.md5(Buffer.from('test'))).toEqual('CY9rzUYh03PK3k6DJie09g==');
    });
  });

  describe('b64', () => {
    it('should return correct b65 value', () => {
      expect(utils.b64('testtext')).toEqual('dGVzdHRleHQ=');
    });

    it('should escape chars to make b64 url without safe mode - char "+"', () => {
      expect(utils.b64('*0eijATh#"I$PR)s<uTa}{t>E"LC:L', false)).toEqual('KjBlaWpBVGgjIkkkUFIpczx1VGF9e3Q+RSJMQzpM');
    });

    it('should escape chars to make b64 url with safe mode - char "+"', () => {
      expect(utils.b64('*0eijATh#"I$PR)s<uTa}{t>E"LC:L', true)).toEqual('KjBlaWpBVGgjIkkkUFIpczx1VGF9e3Q-RSJMQzpM');
    });
  });
});
