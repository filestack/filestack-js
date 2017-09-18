# filestack-js changelog

## 0.9.3 (2017-09-18)
**Picker changes**
- Add `onedriveforbusiness` to sources
- Fix issue related to raven-js global instrumenting

## 0.9.2 (2017-09-07)
**Picker changes**
- Add new uploadConfig option to configure local file uploads
- Fix UX related to failed uploads in the summary view
- Update a few translations
- Add a new error screen for invalid apikey

**Client changes**
- Implement preview method to open document viewer for Filestack handles
- Add timeout to upload method options

## 0.9.1 (2017-08-30)
**Picker changes**
- Fix bug with customSourcePath on store and link calls
- Implement disableStorageKey option to remove prefixes on stored files
- Remove all argument mutation from the config parser

## 0.9.0 (2017-08-24)
**Picker changes**
- Convert originalFile in metadata from File to object
- Add onOpen and onUploadStarted callback options
- Fix cloud folder fetching to ensure entire folder selection
- Implement a fix for third-party cookie issues 

## 0.8.5 (2017-08-21)
**Picker changes**
- Put filename back into originalPath

## 0.8.4 (2017-08-18)
- Add cname option to init wrapper

## 0.8.3 (2017-08-18)
**Picker changes**
- Fix issue with originalPath for cloud folders not being human readable

**Client changes**
- Implement cname option in filestack.init
- Add option to enable/disable intelligent ingestion uploads
- Fix issues with how upload progress is reported

## 0.8.2 (2017-08-14)
- Force picker script URL to use HTTPS protocol

## 0.8.1 (2017-08-04)
**Picker changes**
- Implement audio and video sources
- Add `videoResolution` option for video source
- Fix CSS bugs on iOS 8 Safari
- Fix bug with cloud file selection/deselection

**Client changes**
- Uploads will no longer retry on HTTP 4xx responses

## 0.8.0 (2017-07-26)
**Picker changes**
- Fix typos in various languages including Italian and Danish
- Add Hebrew language as `he`
- Cancel uploads when the pick modal is closed (via close button or ESC key)
- Convert all image transformations to run on the client
- Implement force crop flow

**New pick options**
- `imageMax` -- set maximum dimensions for client-side image resizing 
- `imageMin` -- set minimum dimensions for client-side image resizing 
- `imageDim` -- set dimensions for client-side image resizing
- `rejectOnCancel` -- reject the Promise returned by `pick` on user cancel
- `transformations.crop.force` -- force all images to be cropped before uploading
- `transformations.rotate` -- enable/disable image rotation
- `transformations.circle` -- enable/disable image circle crop

**Deprecated pick options**

As of 0.8.0 the following options are no longer supported:

- `transformations.maxDimensions` -- Replaced by `imageMax`
- `transformations.minDimensions` -- Replaced by `imageMin`
- `transformations.crop.circle` -- Replaced by `transformations.circle`
- `transformations.filters` -- These are now gone, for now

**Client changes**
- `upload` will now accept a base64 encoded string which it will convert to a Blob.
- Added new transform option `output` for file conversion URL generation

## 0.7.1 (2017-07-10)
**Picker fixes**
- Fix bug with broken URL upload when security is enabled

## 0.7.0 (2017-07-03)
**Picker changes**
- Cloud folder UX and interface have been overhauled 
- Implemented Filestack whitelabel account feature (disable brand footer)
- Add new screen for blocked applications
- Add new option `disableThumbnails` to remove local file thumbnails for performance increase
- Add new sources `url` and `customsource` (plus `customSourcePath` and `customSourceContainer` options)
- Various style updates
- Bug fixes including removing a TypeError on extension checking

**Client changes**
- Fix module loader breaking in Node environments
- Fix memory leak in multi-part uploader
- Abort multi-part uploads if ETag header does not exist on first chunk response

**Breaking changes**

- Polyfills have been removed from the distributable. Please see the readme section [Promises](https://github.com/filestack/filestack-js#promises)
- `fsp-button-auth` is now `fsp-button--auth` 

## 0.6.3 (2017-05-30)
**Picker changes**
- Fix bug with file upload progress related to background uploads
- Fix issue with crop overlay dimensions being set incorrectly

## 0.6.2 (2017-05-26)
**Picker changes**
- Fix multiple file selection bug on mobile
- Fix bug where `uploadInBackground: false` was not respecting `storeTo` options
- Change crop selection area to behave more like a mask
- Fix issue when picker is loaded alongside a global Vue/Vuex instance

## 0.6.1 (2017-05-22)
- Add token parameter to upload method

## 0.6.0 (2017-05-10)
**Picker changes**
- Implement webcam source for taking pictures
- Remove sidebar pagination, implement sidebar scrolling
- Fix performance issue in summary screen related to thumbnails
- Implement onClose callback
- Add new field `originalPath` to file data returned from pick

**Breaking changes**

- The multi-part `upload` method was rewritten. Options to this method have slightly changed.
- The signature of progress events has also changed, please see the readme.

## 0.5.2 (2017-04-20)
- Fix one more transformations regression (sorry folks)

## 0.5.1 (2017-04-17)
- Fix transformations regression with security enabled

## 0.5.0 (2017-04-17)
- Implement single file/image flow in picker
- Add translations for sidebar sources
- Add Japanese locale
- Add missing mimetypes to accept option
- Fix grid style issue in Windows 10
- General style changes, e.g. close button has been moved into the modal
- Implemented several fixes for IE11
- __Breaking changes__: pick option `transformOptions` changed to `transformations`. See README

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
