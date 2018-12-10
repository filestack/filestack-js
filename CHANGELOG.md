# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.8.2"></a>
## [1.8.2](https://github.com/filestack/filestack-js/compare/v1.8.1...v1.8.2) (2018-12-10)



<a name="1.8.1"></a>
## [1.8.1](https://github.com/filestack/filestack-js/compare/v1.8.0...v1.8.1) (2018-11-22)


### Bug Fixes

* **tslib:** move tslib to deps ([121d233](https://github.com/filestack/filestack-js/commit/121d233))



<a name="1.8.0"></a>
# [1.8.0](https://github.com/filestack/filestack-js/compare/v1.7.7...v1.8.0) (2018-11-21)


### Bug Fixes

* **har-validator:** fix har-validator in package json ([d4475a0](https://github.com/filestack/filestack-js/commit/d4475a0))
* **har-validator:** fix version for har-validator ([1a5d343](https://github.com/filestack/filestack-js/commit/1a5d343))
* **har-validator:** fix version in package-json lock ([#172](https://github.com/filestack/filestack-js/issues/172)) ([5f585a6](https://github.com/filestack/filestack-js/commit/5f585a6))
* **storeURL:** fix if statement for replacing special chars in store url ([41188ec](https://github.com/filestack/filestack-js/commit/41188ec))



<a name="1.7.7"></a>
## [1.7.7](https://github.com/filestack/filestack-js/compare/v1.7.6...v1.7.7) (2018-10-29)


### Bug Fixes

* **browser_utils:** fix slice file in browser utils ([#166](https://github.com/filestack/filestack-js/issues/166)) ([9210eb7](https://github.com/filestack/filestack-js/commit/9210eb7))



<a name="1.7.6"></a>
## [1.7.6](https://github.com/filestack/filestack-js/compare/v1.7.5...v1.7.6) (2018-10-25)


### Bug Fixes

* **workflows:** fix condition in workflows ([03738ba](https://github.com/filestack/filestack-js/commit/03738ba))



<a name="1.7.5"></a>
## [1.7.5](https://github.com/filestack/filestack-js/compare/v1.7.4...v1.7.5) (2018-10-25)


### Bug Fixes

* **workflows:** fix workflows in uploads ([95d90e1](https://github.com/filestack/filestack-js/commit/95d90e1))



<a name="1.7.4"></a>
## [1.7.4](https://github.com/filestack/filestack-js/compare/v1.7.3...v1.7.4) (2018-10-25)



<a name="1.7.3"></a>
## [1.7.3](https://github.com/filestack/filestack-js/compare/v1.7.2...v1.7.3) (2018-10-23)


### Bug Fixes

* **upload:** add signature and policy to complete upload event ([#164](https://github.com/filestack/filestack-js/issues/164)) ([7d98a27](https://github.com/filestack/filestack-js/commit/7d98a27))



<a name="1.7.2"></a>
## [1.7.2](https://github.com/filestack/filestack-js/compare/v1.7.1...v1.7.2) (2018-10-11)



<a name="1.7.1"></a>
## [1.7.1](https://github.com/filestack/filestack-js/compare/v1.7.0...v1.7.1) (2018-10-10)


### Bug Fixes

* **pickerOptions/workflows:** Fix workflowIds name in options ([#160](https://github.com/filestack/filestack-js/issues/160)) ([b53af12](https://github.com/filestack/filestack-js/commit/b53af12))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/filestack/filestack-js/compare/v1.6.1...v1.7.0) (2018-10-10)


### Features

* **workflows:** Add workflows ids to store options ([#159](https://github.com/filestack/filestack-js/issues/159)) ([4ca1b34](https://github.com/filestack/filestack-js/commit/4ca1b34))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/filestack/filestack-js/compare/v1.6.0...v1.6.1) (2018-10-05)


### Bug Fixes

* **picker/cname:** Load assets from given cname instead of fielstackapi domain - picker v1.2.2 ([#156](https://github.com/filestack/filestack-js/issues/156)) ([e3ea711](https://github.com/filestack/filestack-js/commit/e3ea711))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/filestack/filestack-js/compare/v1.5.1...v1.6.0) (2018-09-24)


### Features

* **workflows:** Add support for workflows ([#150](https://github.com/filestack/filestack-js/issues/150)) ([ddeb93a](https://github.com/filestack/filestack-js/commit/ddeb93a))



<a name="1.5.1"></a>
## [1.5.1](https://github.com/filestack/filestack-js/compare/v1.5.0...v1.5.1) (2018-08-13)


### Bug Fixes

* **ie11:** downgrade atob lib ([#139](https://github.com/filestack/filestack-js/issues/139)) ([d87c834](https://github.com/filestack/filestack-js/commit/d87c834))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/filestack/filestack-js/compare/v1.4.0...v1.5.0) (2018-08-08)


### Features

* Add support for buffers ([#137](https://github.com/filestack/filestack-js/issues/137)) ([7254ce4](https://github.com/filestack/filestack-js/commit/7254ce4))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/filestack/filestack-js/compare/v1.4.0...v1.4.1) (2018-07-25)

### Picker Updates

* fix issue with `storeTo` not being respected in `dropPane` mode with `cropFiles: true`



<a name="1.4.0"></a>
# [1.4.0](https://github.com/filestack/filestack-js/compare/v1.3.2...v1.4.0) (2018-07-19)


### Bug Fixes

* downgrade rollup to fix ES module bundling ([6c05b40](https://github.com/filestack/filestack-js/commit/6c05b40))
* respect empty values for transform tasks without props ([4b4f9a6](https://github.com/filestack/filestack-js/commit/4b4f9a6))


### Features

* add removeMetadata method to allow file delete calls with skip_storage param ([#125](https://github.com/filestack/filestack-js/issues/125)) ([45e628a](https://github.com/filestack/filestack-js/commit/45e628a))



<a name="1.3.2"></a>
## [1.3.2](https://github.com/filestack/filestack-js/compare/v1.3.1...v1.3.2) (2018-07-17)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/filestack/filestack-js/compare/v1.3.0...v1.3.1) (2018-07-17)


### Bug Fixes

* **transform:** Transform cache option can be boolean ([#127](https://github.com/filestack/filestack-js/issues/127)) ([b4e15d4](https://github.com/filestack/filestack-js/commit/b4e15d4))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/filestack/filestack-js/compare/v1.2.1...v1.3.0) (2018-07-17)


### Features

* **transforms:** add compress option ([#126](https://github.com/filestack/filestack-js/issues/126)) ([a2a0e2d](https://github.com/filestack/filestack-js/commit/a2a0e2d))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/filestack/filestack-js/compare/v1.2.0...v1.2.1) (2018-07-05)


### Bug Fixes

* resolve some issues with types ([1455632](https://github.com/filestack/filestack-js/commit/1455632))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/filestack/filestack-js/compare/1.1.0...1.2.0) (2018-07-02)

### Picker Updates

* add new option `customText` for replacing strings in the picker UI [Read more](https://filestack.github.io/filestack-js/interfaces/pickeroptions.html#customtext)
* add new `cropped` and `rotated` fields to the returned picker metadata [Read more](https://filestack.github.io/filestack-js/interfaces/pickerfilemetadata.html)
* fix issue related to minified CSS namespace collision in animations
* update Danish and Korean translations

<a name="1.1.0"></a>
# [1.1.0](https://github.com/filestack/filestack-js/compare/1.0.2...1.1.0) (2018-06-13)


### Features

* **transforms:** Add safe for work and tags transform ([#121](https://github.com/filestack/filestack-js/issues/121)) ([ed0f4c6](https://github.com/filestack/filestack-js/commit/ed0f4c6))



<a name="1.0.2"></a>
# [1.0.2](https://github.com/filestack/filestack-js/compare/1.0.1...1.0.2) (2018-06-11)


### Bug Fixes

* **transform:** correct typo in video locations enum ([6fcf41b](https://github.com/filestack/filestack-js/commit/6fcf41b))
* **picker:** fix bug where onUploadDone was called twice if allowManualRetry was true
* **picker:** fix issue where event listeners were being unnecessarily removed 

<a name="1.0.1"></a>
## [1.0.1](https://github.com/filestack/filestack-js/compare/1.0.0...1.0.1) (2018-05-31)


### Bug Fixes

* **picker:** fix syntax error in IE11 related to untransformed module import ([51e4873](https://github.com/filestack/filestack-js/commit/51e4873))

## 1.0.0 (2018-05-31)

The source code for this repository has been made available under the Apache 2.0 license. Contributions are more than welcome, and we will be working to improve
the contribution experience over time. It should be noted that the source code for the picker UI is not yet licensed for sharing. 

### Module Updates

* Browser and Node runtimes are now both supported. This is accomplished using the appropriate module fields in `package.json`. [Read more.](https://github.com/filestack/filestack-js#module-overview)
* All modules have been rewritten in TypeScript. Generated docs are now derived from the interfaces used within the source code. [API Docs](https://filestack.github.io/filestack-js/index.html)

### Breaking Changes

* `filestack.init` now takes 2 arguments, `apikey` and `options`. [Read more.](https://filestack.github.io/filestack-js/globals.html#init)
* No more default export. The ES module must be imported using qualified imports, such as `import * as filestack from 'filestack-js'`.
* Custom source in the picker must now use `customSourceName` to configure the name of the source in the UI. This is no longer pulled from the Filestack application.
* `rejectOnCancel` has been removed from the picker options.
* `hideWhenUploading` has been renamed to `hideModalWhenUploading`, since it applies only when `displayMode` is `'overlay'`
* `pick`, `makeDropPane`, and `cropFiles` have been replaced by a unifying `picker` instance that exposes methods for controlling the picker lifecycle. Supporting this change are two new picker options, `displayMode` and `container`, which allow users to configure how their pickers are integrated into the document.

#### Migration path for filestack.init:

```js
const security = {
  policy: '12345',
  signature: 'abcdef'
};

const cname = 'fs.mydomain.com';

// pre 1.0

filestack.init(apikey, security, cname);

// ---> 1.0

const options = {
  security,
  cname,
};

filestack.init(apikey, options);
```

### Picker Changes 

We have changed the interface for using the picker. This was necessitated by new features and motivated by developer feedback. Because the picker now supports being embedded in addition to being a one-time modal, the Promise interface has been removed. This means `client.pick` is replaced by `client.picker`, which returns a Picker instance that exposes methods `open`, `close`, `cancel`, and `crop`. The picker instance can be configured to open in `overlay`, `inline`, or `dropPane` modes. 

The recommended way moving forward is to replace your usage of `client.pick` with `picker.open` and set up any callbacks you need as options when instantiating the picker.

For example:

```js

// pre-1.0

const client = filestack.init('apikey');

const pickOptions = {
  accept: ['image/jpeg', '.jpg', '.jpeg'],
  maxFiles: 4,
  imageMax: [1280, 720]
  // etc.
};

client.pick(pickOptions).then(callback);


// ---> 1.0

const client = filestack.init('apikey');

const pickOptions = {
  accept: ['image/jpeg', '.jpg', '.jpeg'],
  maxFiles: 4,
  imageMax: [1280, 720],
  onUploadDone: callback, 
};

client.picker(pickOptions).open();
```

In line with this change, we have removed the helper methods `cropFiles` and `makeDropPane`, but the same functionality can still be retained.

The old `makeDropPane` method can be achieved with this adapter:

```js
const makeDropPane = (dropPaneOptions, pickerOptions) => {
  const options = {
    ...pickerOptions,
    displayMode: 'dropPane',
    container: dropPaneOptions.id, // container can be a CSS selector or DOM node
    dropPane: dropPaneOptions,
  };

  const picker = client.picker(options);
  picker.open();
  // close drop pane with picker.close()
};
```

`cropFiles` is replaced by the `crop` method on the picker instance. This can only be used when displayMode is overlay (default) or inline. The crop method will take the input files and apply the force crop mode automatically for those files.

```js
const pickerOptions = {
  onUploadDone: res => console.log(res),
};

const picker = client.picker(pickerOptions);
picker.crop('http://link-to-an-image'); // can pass an array of Blobs or URLs
```

### OAuth Changes

The OAuth flow for our cloud service has been updated to remove the need for cross-origin cookies. Unfortunately this is only possible by leveraging a feature of the OAuth 2 specification, which some cloud sources do not yet support. Because of this the following cloud sources are currently unsupported in the new picker:

* Flickr
* Evernote

Due to how these services implement OAuth we cannot reliably track end-user sessions in our system. These providers will still operate in previous versions, and we will continue to search for a solution moving forward.

### Picker Changes Summary

* New options `displayMode` and `container` to enable better DOM integration
* MutationObserver is now used to clean up picker resources when its root node is destroyed in the DOM
* `onOpen` now passes the picker instance and adds the `app` property to it which is a reference to the Vue instance
* Non-local source views can now be toggled between list and grid
* Shift-click for range selection is now supported in cloud source views
* Fix issue related to folder limit in drag events
* Fix issue where infinite scroll for some cloud sources made duplicate requests
* Fix issue where `accept` parameter was not passed to mobile local file selection
* Change `accept` to reject files without extensions if extension types are whitelisted
* The modal sidebar will now auto-hide if only one source exists in `fromSources`
* First-time render speed has been improved due to removing a blocking network request
* Cross-origin cookies have been removed in favor of localStorage. This should resolve issues in Safari 11 and removes the need for the OAuth relay hosted by Filestack. This also means that Filestack cloud sessions will not persist across separate domains.
* New option `customSourceName` for specifying the name of the custom source. This needs to be used if you were defining your custom source name in the dev portal. 
* `webcam`, `audio` and `video` sources on mobile are no longer hidden. Their behavior will be to open the device menu instead of using the desktop functionality.
* Update Dutch translations
* Add Catalan translations

### API Client Updates

* `transform` has been rewritten and now supports all image tasks from the Filestack catalog. [Read more.](https://filestack.github.io/filestack-js/interfaces/transformoptions.html)
* `preview` will now respect the CNAME option passed to the client when constructing URLs.
* New option `sessionCache` to enable/disable storing the Filestack Cloud API token in the browser. Defaults to false. When true then users will not need to re-authorize their cloud sources if their session has not expired yet on the backend.

## 0.11.2 (2018-01-24)
**Picker changes**
- Prevent ICC profile from being stripped on transformed images
- Update Norwegian translations

## 0.11.1 (2018-01-18)
**Picker changes**
- Fix a regression introduced in 0.10 where deselection of files prevented further uploads

## 0.11.0 (2018-01-12)
**Picker changes**
- Remove global event handlers from drop pane components on destroy

**Client changes**
- Update `preview` to use the new file viewer service (/preview instead of /api/preview)
- Update `preview` to support storage aliases (e.g. src://my-alias/my-file)
- Add preview option `v1` for users who wish to continue using the deprecated file viewer

**Note**
The new file viewer has been redesigned so custom CSS may no longer work as intended. Users can continue
using the old viewer by passing `{ v1: true }` in the `client.preview` options.

## 0.10.1 (2017-12-14)
**Picker changes**
- Fix regression with `uploadConfig.timeout` not being respected

## 0.10.0 (2017-12-07)
**Picker changes**
- Add new option `concurrency` to control maximum amount of running uploads
- Fix a memory issue related to image resize and upload concurrency
- Fix issue where `'fallback'` for intelligent uploads was not respected
- Fix issue where editing cloud images stripped EXIF metadata
- Fix `disableThumbnails` option to respect edited cloud images
- Refactor resize logic to provide better UX -- image resize operations no longer block user actions (like upload and edit)
- Update Polish and Mandarin translations
- Add Korean (`ko`), Norwegian (`no`), Swedish (`sv`), and Vietnamese (`vi`) translations

## 0.9.12 (2017-11-08)
**Client changes**
- Introduce `'fallback'` mode for intelligent uploads. When `intelligent: 'fallback'` is specified
parts will only go through the intelligent ingestion flow when network conditions are degraded. The default 
behavior of `intelligent: true` remains unchanged -- when true all parts go through the intelligent flow regardless of network state. 

Note: This feature still requires intelligent ingestion to be enabled on your Filestack application.

## 0.9.11 (2017-11-01)
**Client changes**
- Fix bug with form data being parsed incorrectly when storing URLs

## 0.9.10 (2017-11-01)
**Picker changes**
- Fix browser crash in Chrome when bulk resizing images
- Add some UX around currently resizing images in summary view (Upload button now says Resizing)

## 0.9.9 (2017-10-18)
**Picker changes**
- Disable drag mode on crop interface (only 0.9.8 had this behavior)
- Increase crop box drag anchor area to help mobile gestures

**Client changes**
- Add new `intelligentChunkSize` option to override the initial FII chunk size
- Increase default request timeout to 2 minutes

## 0.9.8 (2017-10-12)
**Picker changes**
- Add modalSize option for setting width and height of desktop modal
- Change image grid thumbnail styles to prevent stretching 
- Add support for CNAME for static picker files (thanks to @MichalPodeszwa)
- Fix duplicated uploads bug when `startUploadingWhenMaxFilesReached` and `uploadInBackground` are true
- Fix bug where infinite scroll would fetch files twice
- Fix issue with `exposeOriginalFile` not being respected in all callbacks
- Optimize all downloaded SVG assets for faster loading times

## 0.9.7 (2017-10-06)
**Picker changes**
- Fire all file callbacks regardless of uploadInBackground value
- Default global drop zone to false, add new option globalDropZone to enable it
- Add exposeOriginalFile option to give access to underlying File instances
- Fix bug with allowManualRetry and background uploads
- Fix UI bug with selected cloud files when uploadInBackground is true

## 0.9.6 (2017-10-05)
**Picker changes**
- Implement makeDropPane for mounting a drop zone into the DOM (see README for options)
- Implement cropFiles for using the picker's crop UI on a specific list of files
- Add new `uploadId` to file metadata for tracking the file in callbacks
- Add new `rootId` to pick options for specifying an id for the root DOM node
- Fix UX bug with background uploads and summary row styles

## 0.9.5 (2017-10-03)
- Fixed a possible race condition in the module loader. See [#57](https://github.com/filestack/filestack-js/issues/57).

## 0.9.4 (2017-09-26)
**Picker changes**
- Implement `allowManualRetry` option.

`allowManualRetry` will override the default picker behavior when failed uploads occur. The modal will remain open to let users retry failed files manually. Network interruptions are also detected when this option is true, and uploads that fail due to network disruption will be auto-retried until the network returns or until a user manually retries.

The UX for the summary screen has changed due to this feature, so users will now see completed, uploading, and failed files in separate sections. This change is visible to all users regardless of the option being enabled.

Manual retry for the single image flow will land in a later release. This option currently only applies to files viewed in the summary screen and not in the transformer.

**Client changes**
- Increase upload request timeout default to 60s
- Set an upper bound on exponential backoff interval
- Expose logout method to clear cloud sessions

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
