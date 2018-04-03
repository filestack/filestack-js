/**
 * S3 Uploader ripped from release-o-tron
 */

const path = require('path');
const AWS = require('aws-sdk');
const jetpack = require('fs-jetpack'); // kuba never dies
const mime = require('mime-types');
const version = require('../package.json').version;
const s3 = new AWS.S3();

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
    s3.putObject({
      Bucket: to.bucket,
      Key: path,
      Body: file.content,
      ContentType: figureOutFileMimetype(file),
    }, (err) => {
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

// Publish versions

const bucket = 'static.filestackapi.com';
const major = version.split('.').shift();

const latest = {
  bucket,
  folder: `filestack-js/${major}.x.x`,
};

const current = {
  bucket,
  folder: `filestack-js/${version}`,
};

[latest, current].forEach((version) => {
  upload({ cwd: './build/browser', matching: 'filestack*' }, version);
});
