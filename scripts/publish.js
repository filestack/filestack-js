/**
 * S3 Uploader ripped from release-o-tron
 */

const { runOnEachFile, browserBuildDir, version } = require('./utils');
const Path = require('path');
const Fs = require('fs').promises;
const AWS = require('aws-sdk');
const mime = require('mime-types');
const git = require('git-state');

const s3 = new AWS.S3();
const DEPLOY_BRANCH = 'master';

const figureOutFileMimetype = (filePath) => {
  const type = mime.lookup(Path.extname(filePath));
  if (type !== false) {
    return type;
  }

  return 'application/octet-stream';
};

const pushOneFileToS3 = (basePath, to) => {
  return new Promise(async (resolve, reject) => {
    file = Path.basename(basePath);

    // full path to read file
    const uploadKey = `${to.path}/${file}`;
    const content = await Fs.readFile(basePath);

    const options = {
      Bucket: to.bucket,
      Key: uploadKey,
      Body: content,
      ContentType: figureOutFileMimetype(basePath),
    };

    return s3.putObject(options, (err) => {
      if (err) {
        console.error('Upload ERROR:', err);
        reject(err);
      } else {
        resolve(`File: ${file} has been uploaded to: ${to.bucket}/${uploadKey}`);
      }
    });
  });
};

const canDeploy = () => {
  const path = './';
  const repositoryExists = git.isGitSync(path);

  if (!repositoryExists) {
    throw new Error('Cannot read repository')
  }

  const currentBranch = git.checkSync(path);

  // if we cant get info about branch stop deploy
  if (!currentBranch) {
    throw new Error('Cant get info about branch');
  }

  if (currentBranch.dirty > 0) {
    throw new Error('Current Branch is dirty');
  }

  if (currentBranch.branch !== DEPLOY_BRANCH) {
    throw new Error(`You cannot deploy application from: ${currentBranch.branch} branch. Use ${DEPLOY_BRANCH}`);
  }

  if (currentBranch.ahead > 0) {
    throw new Error(`Branch is ${currentBranch.ahead} commits ahead`);
  }

  return true;
}

const upload = async (bucket, path) => {
  return runOnEachFile(
    browserBuildDir,
    {
      realpath: true,
    },
    (file, incOptions) => pushOneFileToS3(file, incOptions),
    { bucket, path },
  );
};

(async () => {
  const bucket = 'static.filestackapi.com';
  const major = version.split('.').shift();

  const args = process.argv.slice(2);
  const paths = [];

  if (args.indexOf('--latest') > -1) {
    console.log(`publish latest version ${major}.x.x`);
    if (canDeploy()) {
      paths.push(`filestack-js/${major}.x.x`);
    }
  }

  if (args.indexOf('--current') > -1) {
    console.log(`publish current version ${version}`);
    if (canDeploy()) {
      paths.push(`filestack-js/${version}`)
    }
  }

  if (args.indexOf('--beta') > -1) {
    console.log(`publish beta version`);
    paths.push(`filestack-js/beta`)
  }

  Promise.all(paths.map((p) => upload(bucket, p))).then((res) => console.log(res))
})();
