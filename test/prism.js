/*
 * Copyright (c) 2017 by Filestack.
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

var connect = require('connect');
var prism = require('connect-prism');
var http = require('http');
var cors = require('cors');

const mode = process.argv[2] === '--record' ? 'mockrecord' : 'mock';
const mocksPath = './test/mocks';
const generateName = function(req) {
  if (req.url.indexOf('policy=') !== -1) {
    return req.method + '_' + 'secured';
  }
  return req.method;
};

prism.create({
  name: 'cloudApi',
  mode,
  mocksPath,
  context: '/cloud',
  https: true,
  port: 443,
  mockFilenameGenerator: function(config, req) {
    return generateName(req);
  },
  host: 'cloud-rc.filestackapi.com',
  changeOrigin: true,
});

prism.create({
  name: 'fileApi',
  mode,
  mocksPath,
  context: '/api/file',
  mockFilenameGenerator: function(config, req) {
    return generateName(req);
  },
  host: 'www-stage.filestackapi.com',
  changeOrigin: true,
});

prism.create({
  name: 'storeApi',
  mode,
  mocksPath,
  context: '/api/store',
  mockFilenameGenerator: function(config, req) {
    return generateName(req);
  },
  host: 'www-stage.filestackapi.com',
  changeOrigin: true,
});

prism.create({
  name: 'uploadApi',
  mode,
  mocksPath,
  context: '/upload',
  rewrite: {
    '^/upload': '',
  },
  mockFilenameGenerator: function(config, req) {
    const step = req.originalUrl.split('/').pop();
    return req.method + '_' + step;
  },
  host: 'upload-stage.filestackapi.com',
});

prism.create({
  name: 'intelligentUploadApi',
  mode,
  mocksPath,
  https: true,
  port: 443,
  context: '/intelligentUpload',
  rewrite: {
    '^/intelligentUpload': '',
  },
  mockFilenameGenerator: function(config, req) {
    const step = req.originalUrl.split('/').pop();
    return req.method + '_' + step;
  },
  host: 'rc-upload.filestackapi.com',
});

var app = connect().use(cors()).use(prism.middleware);
http.createServer(app).listen(3000);
