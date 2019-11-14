/**
 * S3 Uploader ripped from release-o-tron
 */

const path = require('path');
const AWS = require('aws-sdk');
const jetpack = require('fs-jetpack');
const mime = require('mime-types');
const version = require('../package.json').version;
const git = require('git-state');

const s3 = new AWS.S3();
const DEPLOY_BRANCH = 'master';

const figureOutFileMimetype = (file) => {
  const type = mime.lookup(path.extname(file.path));
  if (type !== false) {
    return type;
  }

  return 'application/octet-stream';
};

const getFilesToBeUploaded = (from) => {
  const cwd = jetpack.cwd(from.cwd);
  return cwd.findAsync({
      matching: from.matching
    })
    .then((paths) => {
      return paths.map((path) => {
        return {
          path,
          content: cwd.read(path, 'buffer'),
        };
      });
    });
};

const pushOneFileToS3 = (file, to) => {
  return new Promise((resolve, reject) => {
    const path = `${to.folder}/${file.path}`;
    const isGzip = file.path.indexOf('gz') > -1;

    const options = {
      Bucket: to.bucket,
      Key: path,
      Body: file.content,
      ContentType: figureOutFileMimetype(file),
    };

    if (isGzip) {
      options['ContentEncoding'] = 'gzip';
    }

    s3.putObject(options, (err) => {
      if (err) {
        console.error('Upload ERROR:', err);
        reject(err);
      } else {
        console.log(`Uploaded: ${path}`);
        resolve();
      }
    });
  });
};

const pushFilesToS3 = (files, to) => {
  const promises = files.map((file) => {
    return pushOneFileToS3(file, to);
  });
  return Promise.all(promises);
};

const upload = (from, to) => {
  return getFilesToBeUploaded(from)
    .then((files) => {
      return pushFilesToS3(files, to);
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

// Publish versions

const bucket = 'static.filestackapi.com';
const major = version.split('.').shift();

const args = process.argv.slice(2);
const versionsToPublish = [];

if (args.indexOf('--latest') > -1) {
  console.log(`publishing to latest version ${major}.x.x`);

  if (canDeploy()) {
    versionsToPublish.push({
      bucket,
      folder: `filestack-js/${major}.x.x`,
    });
  }
}

if (args.indexOf('--current') > -1) {
  console.log(`publishing to current version ${version}`);

  if (canDeploy()) {
    versionsToPublish.push({
      bucket,
      folder: `filestack-js/${version}`,
    });
  }
}

if (args.indexOf('--beta') > -1) {
  console.log(`publishing to beta version`);

  versionsToPublish.push({
    bucket,
    folder: `filestack-js/beta`,
  });
}


versionsToPublish.forEach((version) => {
  upload({ cwd: './build/browser', matching: 'filestack*' }, version);
  upload({ cwd: './build/browser', matching: 'manifest*' }, version);
});
