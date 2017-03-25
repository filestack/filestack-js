# filestack-js changelog

## 0.4.2 (2017-03-25)
- Fix regression with summary screen images
- Add Danish language support

## 0.4.1 (2017-03-22)
- Same as 0.4.0 - last release didn't include new bundle

## 0.4.0 (2017-03-22)
- Fix folder dragging in Chrome and Firefox
- Add ability to drag images from the web in Chrome and Firefox
- Fix bug where cloud logout prevented subsequent logins
- Add international language support
- Add S3 key and container to returned file metadata
- **Breaking change:** Rename `name` to `filename` in returned file metadata from `pick`

## 0.3.2 (2017-03-19)
- Update transformer UI styles
- Return unaltered source URL from transform when no options exist

## 0.3.1 (2017-03-15)
- Add correct handle to storeURL response

## 0.3.0 (2017-03-14)
- Add file size and upload progress in bytes to local files on summary screen
- Fix issue where edited images have no transformations
- Add behavior to show summary when maxFiles is reached
- Remove autofocus from image-search input
- Fix bug with security on process URLs
- Add missing region parameter to storeURL
- Throttle XHR events for performance gain
- Reduce bundle size by about 100KB

## 0.2.1 (2017-03-08)
- Expose getSecurity and setSecurity methods
- Fix drag and drop bug due to variable screen size
- Mobile style fixes
- Fix renaming via onFileSelected for local files

## 0.2.0 (2017-03-06)
- Change picker dependency to npm tarball

## 0.1.12 (2017-03-02)
- Bump picker to 0.2.12

## 0.1.11 (2017-03-02)
- Bump picker to 0.2.11, client to 0.2.1

## 0.1.10 (2017-03-01)
- Bump picker to 0.2.10

## 0.1.9 (2017-03-01)
- Bump client to 0.2.0

## 0.1.8 (2017-03-01)
- Bump picker to 0.2.9
- Add repository to package.json

## 0.1.7 (2017-03-01)
- Bump picker to 0.2.8, client to 0.1.3

## 0.1.6 (2017-02-27)
- Include new client in the bundle

## 0.1.5 (2017-02-27)
- Bump picker to 0.2.7, client to 0.1.2
- Fix typo in readme

## 0.1.4 (2017-02-26)
- Bump picker to 0.2.6

## 0.1.3 (2017-02-26)
- Update API methods
- Bump picker to 0.2.5

## 0.1.2 (2017-02-25)
- Bump picker to 0.2.4

## 0.1.1 (2017-02-25)
- Bump to latest picker and client
- Update to new security interface

## 0.1.0 (2017-02-24)
- Bump picker to 0.2.1, api-client to 0.0.17
- Add protocol agnostic picker URL

## 0.0.8 (2017-02-16)
- Bump picker to 0.1.8, api-client to 0.0.16

## 0.0.7 (2017-02-13)
- Return loader Promise instance from pick

## 0.0.6 (2017-02-12)
- Pin picker version and bump to 0.1.7

## 0.0.5 (2017-02-12)
- Bump api-client to 0.0.14

## 0.0.4 (2017-02-12)
- Update readme
- Bump api-client to 0.0.12

## 0.0.3 (2017-02-11)
- Fix S3 bucket name

## 0.0.2 (2017-02-11)
- Update api-client to 0.0.11
- Update interfaces, build configs, envs, and readme

## 0.0.1 (2016-12-27)
- Initial release
