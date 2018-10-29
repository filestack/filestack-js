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
import { CloudClient, PICKER_KEY } from './cloud';

declare var ENV: any;

const session = ENV.cloudSession;
const secureSession = ENV.secureCloudSession;
const mockClouds = {
  facebook: {
    path: '/',
  },
};

describe('cloud', function cloud() {
  this.timeout(60000);

  it('should construct an instance of CloudClient', () => {
    const client = new CloudClient(session);
    assert.ok(client.session = session);
    assert.ok(client instanceof CloudClient);
  });

  it('should call prefetch for application profile', (done) => {
    const client = new CloudClient(session);
    client.prefetch()
      .then((res: any) => {
        assert.ok(res);
        assert.ok(res.whitelabel);
        done();
      })
      .catch((err: any) => {
        done(err);
      });
  });

  it('should call list with security', (done) => {
    const client = new CloudClient(secureSession);
    client.list(mockClouds)
      .then((res: any) => {
        assert.ok(res);
        done();
      })
      .catch((err: any) => {
        done(err);
      });
  });

  it('should save token if sessionCache is true -- BROWSER ONLY', (done) => {
    if (typeof localStorage === 'undefined') {
      return done();
    }

    const client = new CloudClient(session, { sessionCache: true });
    client.list(mockClouds)
      .then((res: any) => {
        assert.ok(res);
        const cached = localStorage.getItem(PICKER_KEY);
        assert.ok(cached === res.token);
        done();
      })
      .catch((err: any) => {
        done(err);
      });
  });

});
