require('dotenv').config();
const testEnv = process.env.TEST_ENV || 'unit';
const urls = require('./urls.json')[testEnv];
global.ENV = {
  isNode: true,
  session: {
    apikey: process.env.TEST_APIKEY || 'fakekey',
    urls,
  },
  cloudSession: {
    apikey: process.env.TEST_CLOUD_APIKEY || 'fakekey',
    urls: urls,
  },
  secureCloudSession: {
    apikey: process.env.TEST_CLOUD_SECURE_APIKEY || 'fakesecurekey',
    signature: process.env.TEST_CLOUD_SIGNATURE || 'fakesignature',
    policy: process.env.TEST_CLOUD_POLICY || 'fakepolicy',
    urls: urls,
  },
  intelligentSession: {
    apikey: process.env.TEST_INTELLIGENT_APIKEY || 'fakekey',
    urls: Object.assign({}, urls, { uploadApiUrl: urls.intelligentUploadApiUrl }),
  },
  secureSession: {
    apikey: process.env.TEST_SECURE_APIKEY || 'fakesecurekey',
    signature: process.env.TEST_SIGNATURE || 'fakesignature',
    policy: process.env.TEST_POLICY || 'fakepolicy',
    urls,
  },
  filelink: process.env.TEST_FILELINK || 'W1LOh6RdqHqolomhqMUQ',
  secureFilelink: process.env.TEST_SECURE_FILELINK || 'W1LOh6RdqHqolomhqMUQ',
  urls,
  testEnv,
};
