const glob = require('glob');
const version = require('../package.json').version;
const path = require('path');

const browserBuildDir = `build/browser/*`;

const getRootPath = () => {
  return path.dirname(path.join(require.main.filename || process.mainModule.filename, '..'));
}

const getFiles = (dir, globOpts = {}) => {
  return new Promise((resolve, reject) => {
    globOpts.cwd = getRootPath();

    glob(dir, globOpts, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files);
    })
  });
}

const runOnEachFile = async (path, globOpts, fn, fnOptions) => {
  const files = await getFiles(path, globOpts);
  return Promise.all(files.map((file) => fn(file, fnOptions)));
}

module.exports = { browserBuildDir, getFiles, runOnEachFile, version };
