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
import {
  metadata,
  remove,
  retrieve,
} from './file';
import { storeURL } from './store';

declare var ENV: any;

const session = ENV.session;
const secureSession = ENV.secureSession;
const filelink = ENV.filelink;
const secureFilelink = ENV.secureFilelink;

describe('metadata', function metadataFunc() {
  this.timeout(60000);

  it('should throw an error if no handle is set', () => {
    assert.throws(() => metadata(session));
  });

  it('should get an ok response with a valid handle', (done) => {
    metadata(session, filelink)
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid handle and options', (done) => {
    metadata(session, filelink, { md5: true, sourceUrl: true })
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid secure handle and options', (done) => {
    metadata(secureSession, secureFilelink)
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call promise catch with error', (done) => {
    const sessionClone = JSON.parse(JSON.stringify(session));
    sessionClone.urls.fileApiUrl = 'somebadurl';

    this.timeout(100);
    metadata(sessionClone, filelink)
      .then(() => {
        done(new Error('Request passed'));
      })
      .catch((err) => {
        assert.ok(err instanceof Error);
        done();
      });
  });
});

describe('retrieve', function metadataFunc() {
  this.timeout(60000);

  it('should throw an error if no handle is set', () => {
    assert.throws(() => retrieve(session, ''));
  });

  it('should throw an error metadata and head options are provided', () => {
    assert.throws(() => retrieve(session, filelink, {
      metadata: true,
      head: true,
    }));
  });

  it('should get an ok response with a valid handle', (done) => {
    retrieve(session, filelink)
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid handle and options', (done) => {
    retrieve(session, filelink, { metadata: true })
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a valid secure handle and options', (done) => {
    retrieve(secureSession, secureFilelink, { metadata: true })
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a head option', (done) => {
    retrieve(session, filelink, { head: true })
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response with a extension option', (done) => {
    retrieve(session, filelink, { extension: 'someextension.txt' })
      .then((result) => {
        assert.ok(result);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call promise catch with error', (done) => {
    const sessionClone = JSON.parse(JSON.stringify(session));
    sessionClone.urls.fileApiUrl = 'somebadurl';

    retrieve(sessionClone, filelink, { extension: 'someextension.txt' })
      .then(() => {
        done(new Error('Request passed'));
      })
      .catch((err) => {
        assert.ok(err instanceof Error);
        done();
      });
  });
});

describe('remove', function removeFunc() {
  this.timeout(60000);

  it('should throw an error if no handle is set', () => {
    assert.throws(() => remove(secureSession));
  });

  it('should throw an error if client is not secured', () => {
    assert.throws(() => remove(session, 'fakehandle'));
  });

  it('should get an ok response with a valid handle', (done) => {
    // have to create a file before we can test deleting it
    storeURL(secureSession, ENV.urls.testImageUrl)
      .then((res: any) => {
        const handle = res.handle;
        remove(secureSession, handle)
          .then((result: any) => {
            assert.equal(result.statusCode, 200);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get an ok response when skip_storage is true', (done) => {
    // have to create a file before we can test deleting it
    storeURL(secureSession, ENV.urls.testImageUrl)
      .then((res: any) => {
        const handle = res.handle;
        remove(secureSession, handle, true)
          .then((result: any) => {
            assert.equal(result.statusCode, 200);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call promise catch with error', (done) => {
    const sessionClone = JSON.parse(JSON.stringify(secureSession));
    sessionClone.urls.fileApiUrl = 'somebadurl';

    storeURL(secureSession, ENV.urls.testImageUrl)
      .then((res: any) => {
        const handle = res.handle;
        this.timeout(100);

        remove(sessionClone, handle)
        .then(() => {
          done(new Error('Request passed'));
        })
        .catch((err) => {
          assert.ok(err instanceof Error);
          done();
        });
      })
      .catch((err) => {
        done(err);
      });
  });
});
