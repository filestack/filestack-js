/**
 * S3 Uploader ripped from release-o-tron
 */

const { runOnEachFile, browserBuildDir, version } = require('./utils');
const Path = require('path');
const Fs = require('fs').promises;
const { S3Client, PutObjectCommand, S3ServiceException } = require("@aws-sdk/client-s3");
const mime = require('mime-types');
const git = require('git-state');

const s3Client = new S3Client({region: process.env.AWS_REGION});
// const DEPLOY_BRANCH = 'master';
const path = './';
const repositoryExists = git.isGitSync(path);
const currentBranch = git.checkSync();

console.log('CURRENT BRANCH IS: ', currentBranch);

const figureOutFileMimetype = (filePath) => {
  const type = mime.lookup(Path.extname(filePath));
  if (type !== false) {
    return type;
  }

  return 'application/octet-stream';
};

const pushOneFileToS3 = (basePath, to, cacheControll = 1) => {
  return new Promise(async (resolve, reject) => {
    file = Path.basename(basePath);

    // full path to read file
    const uploadKey = `${to.path}/${file}`;
    const content = await Fs.readFile(basePath);

    const options = {
      Bucket: to.bucket,
      Key: uploadKey,
      Body: content,
      CacheControl: `max-age=${cacheControll * 60 * 60 * 24}` || 'max-age=86400',
      ContentType: figureOutFileMimetype(basePath),
    };

    const command = new PutObjectCommand(options);

    try {
      await s3Client.send(command);
      resolve(`File: ${file} has been uploaded to: ${to.bucket}/${uploadKey}`);
    } catch (err) {
      if (err instanceof S3ServiceException) {
        console.error('Upload ERROR:', err);
        reject(err);
      } else {
        reject(err);
      }
    }
  });
};

const canDeploy = () => {

  if (!repositoryExists) {
    throw new Error('Cannot read repository')
  }

  // if we cant get info about branch stop deploy
  if (!currentBranch) {
    throw new Error('Cant get info about branch');
  }

  console.log('CURRENT_BRANCH_INFO', currentBranch);

  return true;
}

const upload = async (bucket, path, cacheControll) => {
  return runOnEachFile(
    browserBuildDir,
    {
      realpath: true,
    },
    (file, incOptions) => pushOneFileToS3(file, incOptions, cacheControll),
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
      paths.push({
        bucket,
        path: `filestack-js/${major}.x.x`,
        cacheControll: 1,
      });
    }
  }

  if (args.indexOf('--current') > -1) {
    console.log(`publish current version ${version}`);
    if (canDeploy()) {
      paths.push({
        bucket,
        path: `filestack-js/${version}`,
        cacheControll: 30
      });
    }
  }

  if (args.indexOf('--beta') > -1) {
    console.log(`publish beta version`);
    paths.push({
      bucket,
      path: `filestack-js/beta`,
      cacheControll: 0
    })
  }

  if (args.indexOf('--stage') > -1) {
    console.log(`publish stage version`);
    paths.push({
      bucket,
      path: `filestack-js/stage`,
      cacheControll: 0
    })
  }

  if (args.indexOf('--beta.v4') > -1) {
    console.log(`publish beta v4 version`);
    paths.push({
      bucket,
      path: `filestack-js/beta-v4`,
      cacheControll: 0
    })
  }

  Promise.all(paths.map((data) => upload(data.bucket, data.path, data.cacheControll))).then((res) => console.log(res))
})();
