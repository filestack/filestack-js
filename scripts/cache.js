/**
 * Clear fastly cache
 */

const { runOnEachFile, browserBuildDir } = require('./utils');
const version = require('../package.json').version;
const request = require('request');
const path = require('path');

const makePurgeRequest = (file, to) => {

  file = path.basename(file);
  const url = `https://${to.bucket}/${to.path}/${file}`;

  return new Promise((resolve, reject) => {
    console.log(`Make PURGE request to ${url}`);
    request(
      {
        method: 'PURGE',
        uri: url,
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }

        resolve(`PURGE request to ${url} finished`);
      },
    );
  });
};

const purge = (bucket, path) => {
  return runOnEachFile(
    browserBuildDir,
    {},
    (file, incOptions) => makePurgeRequest(file, incOptions),
    { bucket, path },
  );
};

(async () => {
  const bucket = 'static.filestackapi.com';
  const major = version.split('.').shift();

  const args = process.argv.slice(2);
  const paths = [];

  if (args.indexOf('--latest') > -1) {
    console.log(`clearing cache for latest version ${major}.x.x`);
    paths.push(`filestack-js/${major}.x.x`);
  }

  if (args.indexOf('--current') > -1) {
    console.log(`clearing cache for current version ${version}`);
    paths.push(`filestack-js/${version}`)
  }

  if (args.indexOf('--beta') > -1) {
    console.log(`clearing cache for beta version`);
    paths.push(`filestack-js/beta`)
  }

  if (args.indexOf('--stage') > -1) {
    console.log(`clearing cache for stage version`);
    paths.push(`filestack-js/stage`)
  }

  if (args.indexOf('--beta.v4') > -1) {
    console.log(`clearing cache for beta v4 version`);
    paths.push(`filestack-js/beta-v4`)
  }

  Promise.all(paths.map((p) => purge(bucket, p)), (res) => console.log(res))
})();
