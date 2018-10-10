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
import * as sinon from 'sinon';
import { upload } from './index';
import * as fs from 'fs';

declare var ENV: any;

const testFilePath = './test/data/testfile.txt';
const testImageFilePath = './test/data/fish.gif';
const session = ENV.session;
const secureSession = ENV.secureSession;
const makeFile = (data: string, type: string = 'image/gif') => {
  return ENV.isNode ? testFilePath : new Blob([data], { type });
};
const makeEmptyFile = () => {
  return ENV.isNode ? './test/data/emptyfile.txt' : new Blob([''], { type: 'application/text' });
};
const smallFile = makeFile('helloworld');
const emptyFile = makeEmptyFile();
const noFile = ENV.isNode ? './Idonotexist' : undefined;

const dataURI = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xL
  jEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy5
  3My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuc
  zppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjI0OC4yMjE2OSIKICAgaGVpZ2h0PSI2Ny4wODg0MzIiCiAgIHZpZXdCb3g9IjAgMCAyNDguMjIxNjkgNjcuMDg4NDM
  yIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczNzYwIgogICBzb2RpcG9kaTpkb2NuYW1lPSJmaWxlc3RhY2suc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjEgciI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhM
  zc2NCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmR
  mOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+Y29sb3I8L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0Y
  T4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncml
  kdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjMxOTAiC
  iAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTc2MiIKICAgICBpZD0ibmFtZWR2aWV3Mzc2MiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iNC4xNzgxNzY4IgogICAgIGlua3NjYXBlOmN4PSIxMTg
  uMzM2NjgiCiAgICAgaW5rc2NhcGU6Y3k9IjMzLjM0Njc1MyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpb
  mtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmczNzYwIgogICAgIGlua3NjYXBlOmxvY2tndWlkZXM9ImZhbHNlIiAvPgogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNDIgKDM2NzgxKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29
  tL3NrZXRjaCAtLT4KICA8dGl0bGUKICAgICBpZD0idGl0bGUzNzQyIj5jb2xvcjwvdGl0bGU+CiAgPGRlc2MKICAgICBpZD0iZGVzYzM3NDQiPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzN
  zQ2IiAvPgogIDxnCiAgICAgaWQ9IlBhZ2UtMSIKICAgICBzdHlsZT0iZmlsbDpub25lO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxIgogICAgIHRyYW5zZm9ybT0ic2NhbGUoMS4zOTkzODYyKSI+CiA
  gICA8ZwogICAgICAgaWQ9ImNvbG9yIj4KICAgICAgPHBhdGgKICAgICAgICAgZD0iTSAzNy40OTg4NzMsMzIuOTU5NjY1IFYgNC40OTQ0OTk3IEggNC40OTk4NjQ4IFYgNDMuNDQ2ODMxIEggMjYuOTk5MTg5IFYgNDcuOTQxMzMgSCA0M
  S45OTg3MzggViAzMi45NTk2NjUgWiBNIDAsMCBIIDQxLjk5ODczOCBWIDQ3Ljk0MTMzIEggMCBaIE0gMjkuOTk5MDk5LDM1Ljk1NTk5OCBIIDQxLjk5ODczOCBMIDI5Ljk5OTA5OSw0Ny45NDEzMyBaIE0gMTMuNDk5NTk0LDEzLjQ4MzQ
  5OSBoIDE0Ljk5OTU1IHYgNC40OTQ1IGggLTE0Ljk5OTU1IHogbSAwLDcuNDkwODMzIGggMTEuOTk5NjQgdiA0LjQ5NDUgaCAtMTEuOTk5NjQgeiBtIDAsNy40OTA4MzMgaCA0LjQ5OTg2NSB2IDQuNDk0NSBoIC00LjQ5OTg2NSB6IgogI
  CAgICAgICBpZD0iUmVjdGFuZ2xlLTM1NiIKICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgICAgc3R5bGU9ImZpbGw6I2VmNDkyNSIgLz4KICAgIDwvZz4KICA8L2c+CiAgPHRleHQKICAgICB4bWw
  6c3BhY2U9InByZXNlcnZlIgogICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTozMy4zMzMzMzIwNnB4O2xpb
  mUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6TW9udHNlcnJhdDstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidNb250c2VycmF0LCBOb3JtYWwnO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXB
  zOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDt0ZXh0LWFsaWduOnN0YXJ0O2xldHRlci1zcGFjaW5nOjBweDt3b3JkLXNwYWNpbmc6MHB4O3dyaXRpbmctbW9kZTpsc
  i10Yjt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiCiAgICAgeD0iNzQuMDE5MjI2IgogICAgIHk9IjQ2LjM4MTEyNiIKICAgICBpZD0idGV4dDM3MDAiPjx0c3BhbgogICAgICA
  gc29kaXBvZGk6cm9sZT0ibGluZSIKICAgICAgIGlkPSJ0c3BhbjM3MDIiCiAgICAgICB4PSI3NC4wMTkyMjYiCiAgICAgICB5PSI0Ni4zODExMjYiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vc
  m1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MzMuMzMzMzMyMDZweDtmb250LWZhbWlseTpNb250c2VycmF0Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J01vbnRzZXJyYXQsIE5
  vcm1hbCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO3RleHQtYWxpZ246c3Rhc
  nQ7d3JpdGluZy1tb2RlOmxyLXRiO3RleHQtYW5jaG9yOnN0YXJ0Ij5maWxlc3RhY2stanM8L3RzcGFuPjwvdGV4dD4KPC9zdmc+Cg==`;

const b64string = 'dGVzdA=='; // b64 for "test"

describe('upload', function uploadTest() {
  this.timeout(120000);

  it('should reject if a file is not a blob', (done) => {
    upload(session, 5).catch((err: Error) => {
      assert.ok(err);
      done();
    });
  });

  it('should reject if file is empty', (done) => {
    upload(session, emptyFile).catch((err: Error) => {
      assert.ok(err);
      done();
    });
  });

  it('should reject if file does not exist', (done) => {
    upload(session, noFile).catch((err: Error) => {
      assert.ok(err);
      done();
    });
  });

  it('(node) should upload file (buffer) successfully and return a handle (gif)', (done) => {
    if (!ENV.isNode) {
      return done();
    }

    const file = fs.readFileSync(testImageFilePath);

    upload(session, file, {
      retry: 0,
      partSize: 2000,
    }, {
      filename: 'filestack.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('(node) should upload (buffer) file successfully and return a handle (txt)', (done) => {
    if (!ENV.isNode) {
      return done();
    }

    const file = fs.readFileSync(testFilePath);

    upload(session, file, {
      retry: 0,
      partSize: 2000,
    }, {
      filename: 'filestack.txt',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('(node) should upload file (buffer) successfully without name and return a handle (txt)', (done) => {
    if (!ENV.isNode) {
      return done();
    }

    const file = fs.readFileSync(testFilePath);

    upload(session, file, {
      retry: 0,
      partSize: 2000,
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a dataURI successfully and return a handle', (done) => {
    if (ENV.isNode) {
      return done();
    }
    upload(session, dataURI, {
      retry: 0,
    }, {
      filename: 'filestack.svg',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a file successfully and return a handle', (done) => {
    upload(session, smallFile, {
      retry: 0,
      mimetype: 'image/gif',
    }, {
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should pause and resume upload', (done) => {
    const token: any = {};
    upload(session, smallFile, {
      retry: 0,
      mimetype: 'image/gif',
    }, {
      filename: 'dutton.gif',
    }, token)
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });

    setTimeout(() => {
      token.pause();
      setTimeout(() => token.resume());
    });
  });

  it('should upload a file and report progress', (done) => {
    const onProgress = sinon.spy();
    upload(session, smallFile, {
      retry: 0,
      onProgress,
      progressInterval: 10,
      mimetype: 'image/gif',
    }, {
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      assert.ok(onProgress.called);
      assert.equal(onProgress.lastCall.args[0].totalPercent, 100);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a file with intelligent ingestion', (done) => {
    upload(ENV.intelligentSession, smallFile, {
      intelligent: true,
      retry: 0,
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a file with intelligent ingestion and report progress', (done) => {
    const onProgress = sinon.spy();
    upload(ENV.intelligentSession, smallFile, {
      retry: 0,
      onProgress,
      progressInterval: 10,
      intelligent: true,
      mimetype: 'image/gif',
    }, {
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      assert.ok(onProgress.called);
      assert.equal(onProgress.lastCall.args[0].totalPercent, 100);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a file with intelligent ingestion fallback and report progress', (done) => {
    const onProgress = sinon.spy();
    upload(ENV.intelligentSession, smallFile, {
      retry: 0,
      onProgress,
      progressInterval: 10,
      intelligent: 'fallback',
      mimetype: 'image/gif',
    }, {
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      assert.ok(onProgress.called);
      assert.equal(onProgress.lastCall.args[0].totalPercent, 100);
      done();
    })
    .catch((err: Error) => {
      console.log(err);
      done(err);
    });
  });

  it('should upload a file with store options', (done) => {
    upload(session, smallFile, {
      retry: 0,
    }, {
      location: 's3',
      region: 'eu-west-1',
      container: 'filestack-uploads-staging-eu-west-1',
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should upload a file to a secured application', (done) => {
    upload(secureSession, smallFile, {
      retry: 0,
    }, {
      filename: 'dutton.gif',
    })
    .then((res: any) => {
      assert.ok(res.handle);
      assert.ok(res.url);
      done();
    })
    .catch((err: Error) => {
      done(err);
    });
  });

  it('should cancel uploading if token.cancel is called', (done) => {
    const token: any = {};

    upload(session, smallFile, {
      retry: 0,
      host: ENV.urls.proxySlow,
    }, {}, token)
    .then((res: any) => {
      done(res);
    })
    .catch((err: Error) => {
      assert.ok(err);
      done();
    });

    setTimeout(() => token.cancel());
  });
});

// Retry with failure simulation via toxy

if (ENV.testEnv === 'unit') {

  describe('upload failure simulation', () => {
    describe('4xx response', function retryFailures() {
      this.timeout(60000);
      it('should fail immediately', (done) => {
        const onRetry = sinon.spy();
        upload(session, smallFile, {
          host: ENV.urls.proxy400,
          retry: 0,
          onRetry,
        })
        .then(() => done('Error was not thrown'))
        .catch((err: any) => {
          assert.ok(!onRetry.called, 'onRetry was called');
          assert.ok(err);
          done();
        });
      });
    });

    describe('5xx response', function retryFailures() {
      this.timeout(60000);
      it('should retry and increment retry count', (done) => {
        const onRetry = sinon.spy();
        upload(session, smallFile, {
          host: ENV.urls.proxy500,
          onRetry,
          retry: 1,
        })
        .then(() => done('Retry was not called'))
        .catch((err: any) => {
          assert.equal(onRetry.firstCall.args[0].attempt, 1);
          assert.ok(err);
          done();
        });
      });
    });

    describe('intelligent ingestion server error', function intelligentSrvErr() {
      this.timeout(60000);
      it('should retry on server error and increment retry amount', (done) => {
        const onRetry = sinon.spy();
        upload(ENV.intelligentSession, smallFile, {
          host: ENV.urls.proxy500,
          onRetry,
          retry: 2,
          intelligent: true,
        })
        .then(() => done('Retry was not called.'))
        .catch((err: any) => {
          assert.equal(onRetry.firstCall.args[0].attempt, 1);
          assert.equal(onRetry.secondCall.args[0].attempt, 2);
          assert.ok(err);
          done();
        });
      });
    });

    describe('intelligent ingestion S3 network error', function intelligentNetErr() {
      this.timeout(60000);
      it('should retry and halve chunk size each time', (done) => {
        const onRetry = sinon.spy();
        const defaultChunkSize = (1 * 1024 * 1024) / 4;
        upload(ENV.intelligentSession, smallFile, {
          host: ENV.urls.proxyAbort,
          onRetry,
          intelligent: true,
          intelligentChunkSize: defaultChunkSize,
        })
        .then(() => done('Retry was not called.'))
        .catch((err: any) => {
          assert.equal(onRetry.firstCall.args[0].chunkSize, defaultChunkSize / 2);
          assert.equal(onRetry.secondCall.args[0].chunkSize, defaultChunkSize / 4);
          assert.ok(err);
          done();
        });
      });

      it('should fail when minimum chunk size is reached', (done) => {
        const onRetry = sinon.spy();
        const minChunkSize = 32 * 1024;
        upload(ENV.intelligentSession, smallFile, {
          host: ENV.urls.proxyAbort,
          onRetry,
          intelligent: true,
          intelligentChunkSize: minChunkSize * 2,
        })
        .then(() => done('Retry was not called.'))
        .catch((err: any) => {
          assert.equal(onRetry.lastCall.args[0].chunkSize, minChunkSize);
          assert.ok(err);
          done();
        });
      });

      it('should set intelligentOverride on part when in fallback mode', (done) => {
        const onRetry = sinon.spy();
        const minChunkSize = 32 * 1024;
        upload(ENV.intelligentSession, smallFile, {
          host: ENV.urls.proxyAbort,
          onRetry,
          intelligent: 'fallback',
          intelligentChunkSize: minChunkSize * 2,
        })
        .then(() => done('Did not fail'))
        .catch((err: any) => {
          assert.equal(onRetry.lastCall.args[0].parts[0].intelligentOverride, true);
          assert.ok(err);
          done();
        });
      });

      it('should upload a file successfully with provided workflows ids', (done) => {
        upload(session, smallFile, {
          retry: 0,
          mimetype: 'image/gif'
        }, {
          workflowIds: ['test', 'test1']
        })
        .then((res: any) => {
          assert.ok(res.handle);
          assert.ok(res.url);
          done();
        })
        .catch((err: Error) => {
          done(err);
        });
      });
    });
  });
}
