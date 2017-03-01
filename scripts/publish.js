/* eslint no-console:0 */

const jetpack = require('fs-jetpack');
const releaseOTron = require('release-o-tron');

const distDir = jetpack.dir('dist_cdn', { empty: true });

const envName = releaseOTron.utils.getEnvironmentForCurrentGitBranch();
const target = releaseOTron.utils.getPublishTargetForCurrentGitBranch();

const build = () => {
  return releaseOTron.utils.spawn('npm', ['run', 'build-cdn', '--', `--env=${envName}`]);
};

releaseOTron.utils.ensureRepoDoesNotHaveUncommitedChanges()
.then(releaseOTron.utils.ensureRepoInSyncWithOrigin)
.then(releaseOTron.utils.ensureNewReleaseWasCreated)
.then(build)
.then(() => {
  return releaseOTron.s3.upload({
    cwd: distDir.path(),
    matching: ['**/*'],
  }, {
    bucket: target.bucket,
    folder: target.folder,
  });
})
.catch(console.error);
