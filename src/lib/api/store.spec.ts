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
import { storeURL } from './store';

declare var ENV: any;
const session = ENV.session;
const secureSession = ENV.secureSession;

describe('storeURL', function storeFunc() {
  this.timeout(30000);

  it('should throw an error if no url is set', () => {
    assert.throws(() => storeURL(session));
  });

  it('should support uppercase string options', (done) => {
    const options = { location: 'S3' };
    storeURL(session, ENV.urls.testImageUrl, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should replace ":" and "," with "_" in url', (done) => {
    const options = { filename: 'test:t,est.jpg' };
    storeURL(session, ENV.urls.testImageUrl, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid url', (done) => {
    storeURL(session, ENV.urls.testImageUrl)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid url and security', (done) => {
    storeURL(secureSession, ENV.urls.testImageUrl)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return the handle and mimetype as part of the response', (done) => {
    storeURL(session, ENV.urls.testImageUrl)
      .then((res: any) => {
        assert.ok(res.handle);
        assert.equal(res.url.split('/').pop(), res.handle);
        assert.equal(res.mimetype, res.type);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should reject on request error', (done) => {
    const sessionCopy = JSON.parse(JSON.stringify(session));
    sessionCopy.urls.cdnUrl = 'http://www.somebadurl.com';

    storeURL(sessionCopy, ENV.urls.testImageUrl)
      .then(() => {
        done(new Error('Success shouldnt be called'));
      })
      .catch((err) => {
        assert.ok(err instanceof Error);
        done();
      });
  });

  it('should cancel request', (done) => {
    const token = {
      cancel: () => console.log('cancel not implemented'),
    };

    setTimeout(() => {
      storeURL(session, ENV.urls.testImageUrl, {}, token)
      .then(() => {
        done(new Error('Success shouldnt be called'));
      })
      .catch((err) => {
        assert.ok(err instanceof Error);
        done();
      });
    }, 10);

    setTimeout(() => token.cancel(), 12);
  });

  it('should support workflows', (done) => {
    const options = { workflows: ['test', { id: 'test' }] };
    storeURL(session, ENV.urls.testImageUrl, options)
      .then((res) => {
        assert.ok(res);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
