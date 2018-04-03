const cors = require('cors');
const toxy = require('toxy');
require('./setup_node.js');

const rules = toxy.rules;
const host = ENV.intelligentSession.urls.intelligentUploadApiUrl;

const proxy500 = toxy();
proxy500.use(cors());
proxy500
  .forward(host)
  .options({ forwardHost: true });
proxy500
  .post('/multipart/upload')
  .poison(toxy.poisons.inject({
    code: 500,
    body: '{"error": "toxy injected error"}',
    headers: { 'Content-Type': 'application/json' },
  }));
proxy500.all('/*');
proxy500.listen(3001);
console.log('Launched toxy proxy with HTTP 500 poison on http://localhost:3001');

const proxyAbort = toxy();
proxyAbort.use(cors());
proxyAbort
  .forward(host)
  .options({ forwardHost: true });
proxyAbort.put('/fakeS3').poison(toxy.poisons.abort());
proxyAbort.all('/*');
proxyAbort.listen(3002);
console.log('Launched toxy proxy with abort poison on http://localhost:3002');

const proxy400 = toxy();
proxy400.use(cors());
proxy400
  .forward(host)
  .options({ forwardHost: true });
proxy400
  .post('/multipart/upload')
  .poison(toxy.poisons.inject({
    code: 400,
    body: '{"error": "toxy injected error"}',
    headers: { 'Content-Type': 'application/json' },
  }));
proxy400.all('/*');
proxy400.listen(3003);
console.log('Launched toxy proxy with HTTP 400 poison on http://localhost:3003');

const proxySlowUpload = toxy();
proxySlowUpload.use(cors());
proxySlowUpload
  .forward(host)
  .options({ forwardHost: true });

proxySlowUpload.post('/multipart/upload')
  .poison(toxy.poisons.slowOpen({ delay: 2000 }))
proxySlowUpload.all('/*');
proxySlowUpload.listen(3004);
console.log('Launched toxy proxy with HTTP slowOpen on http://localhost:3004');

