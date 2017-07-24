<p align="center">
  <a href="https://www.filestack.com"><img src="http://static.filestackapi.com/filestack-js.svg?refresh" align="center" width="250" /></a>  
</p>
<p align="center">
  <strong>Official web SDK for the Filestack API and content management system.</strong>
</p>
<p align="center">
  <a href="https://npmjs.com/package/filestack-js"><img src="https://img.shields.io/npm/v/filestack-js.svg" /></a>
  <a href="https://static.filestackapi.com/v3/filestack.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/v3/filestack.js?compression=gzip&color=green" /></a>
  <a href="https://static.filestackapi.com/v3/filestack.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/v3/filestack.js?color=green" /></a>
  <img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" />
  <br/>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=11&safari=latest&iphone=latest" />
</p>
<hr/>


## What's in the box?

* A wrapper for the [Filestack REST API](https://www.filestack.com/docs/rest-api/retrieve).
* A multi-part uploader powered by the [Filestack CIN](https://www.filestack.com/products/content-ingestion-network).
* An interface to the [Filestack Transformation Engine](https://www.filestack.com/docs/image-transformations) for image processing.
* The Filestack Picker - an upload widget for the web that integrates over a dozen cloud providers.

## Installation

```sh
npm install --save filestack-js
```
## Usage

**ES module**:
```js
import filestack from 'filestack-js';

const apikey = 'abc';
const client = filestack.init(apikey);
```

**Script**:
```HTML
<script src="//static.filestackapi.com/v3/filestack-0.7.0.js"></script>
<script>
  const apikey = 'abc';
  const client = filestack.init(apikey);
</script>
```

## Promises

This library requires an environment that implements the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object spec. 
If you target IE11 you will need to add a `Promise` polyfill to your page or application.

**Polyfills we recommend:**

Module (for bundling):
* https://github.com/taylorhakes/promise-polyfill

Script (for script tag):
* https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise

## Known Issues

Currently the picker requires support for third-party cookies. End users will need to accept third-party cookies to authenticate with cloud sources.
We are actively working to change this.

# API Reference
  
* [filestack](#module_filestack)
  * [init(apikey, [security])](#module_filestack..init) ⇒ <code>object</code>
    * [.getSecurity()](#module_filestack..init.getSecurity) ⇒ <code>object</code>
    * [.setSecurity(security)](#module_filestack..init.setSecurity) ⇒ <code>object</code>
    * [.metadata(handle, [options])](#module_filestack..init.metadata) ⇒ <code>Promise</code>
    * [.pick([options])](#module_filestack..init.pick) ⇒ <code>Promise</code>
    * [.remove(handle)](#module_filestack..init.remove) ⇒ <code>Promise</code>
    * [.retrieve(handle, [options])](#module_filestack..init.retrieve) ⇒ <code>Promise</code>
    * [.storeURL(url, [options])](#module_filestack..init.storeURL) ⇒ <code>Promise</code>
    * [.transform(url, options)](#module_filestack..init.transform) ⇒ <code>string</code>
    * [.upload(file, [uploadOptions], [storeOptions])](#module_filestack..init.upload) ⇒ <code>Promise</code>
  * [version](#module_filestack..version) ⇒ <code>string</code>

<a name="module_filestack..init"></a>

### init(apikey, [security]) ⇒ <code>object</code>
Initializes the client.

**Returns**: <code>object</code> - Object containing client methods.  
**Params**
  - apikey <code>string</code> - Filestack API key. Get a free key [here](https://dev.filestack.com/register/free).  
  - [security] <code>object</code> - Read about [security policies](https://www.filestack.com/docs/security).  
    - .policy <code>string</code> - Filestack security policy encoded in base64.  
    - .signature <code>string</code> - HMAC-SHA256 signature for the security policy.  

<a name="module_filestack..version"></a>

### version ⇒ <code>string</code>
Gets current version.

**Example**  
```js
import filestack from 'filestack-js';
console.log(filestack.version);
```
<a name="module_filestack..init.getSecurity"></a>

### client.getSecurity() ⇒ <code>object</code>
Get current security parameters.

**Returns**: <code>object</code> - Object containing current security parameters  
<a name="module_filestack..init.setSecurity"></a>

### client.setSecurity(security) ⇒ <code>object</code>
Set security parameters -- useful for changing policy on instantiated client.

**Note:** Does not currently work with `pick`. You will need to init a new client if you want to propagate new security parameters to the picker.

**Returns**: <code>object</code> - Object containing current session parameters  
**Params**
  - security <code>object</code> - Read about [security policies](https://www.filestack.com/docs/security).
    - .policy <code>string</code> - Filestack security policy encoded in base64.
    - .signature <code>string</code> - HMAC-SHA256 signature for the security policy.

**Example**  
```js
client.setSecurity({ policy: 'policy', signature: 'signature' });
```

<a name="module_filestack..init.pick"></a>

### client.pick([options]) ⇒ <code>Promise</code>
Attaches and opens the picker UI in the current DOM.

**Resolve**: <code>object</code> - Object contains keys `filesUploaded` and `filesFailed` which are both arrays of file metadata.  
**Params**

- [options] <code>object</code>
    - .fromSources <code>Array.&lt;string&gt;</code> - Valid sources are:
      - `local_file_system` - __Default__
      - `url` - __Default__
      - `imagesearch` - __Default__
      - `facebook` - __Default__
      - `instagram` - __Default__
      - `googledrive` - __Default__
      - `dropbox` - __Default__
      - `webcam` - Desktop only. Not currently supported in Safari and IE.
      - `evernote`
      - `flickr`
      - `box`
      - `github`
      - `gmail`
      - `picasa`
      - `onedrive`
      - `clouddrive`
      - `customsource` - Configure this in your Filestack Dev Portal.
    - .accept <code>string</code> | <code>Array.&lt;string&gt;</code> - Restrict file types that are allowed to be picked. Formats accepted:
      - `.pdf` <- any file extension
      - `image/jpeg` <- any mime type commonly known by browsers
      - `image/*` <- accept all types of images
      - `video/*` <- accept all types of video files
      - `audio/*` <- accept all types of audio files
      - `application/*` <- accept all types of application files
      - `text/*` <- accept all types of text files
    - .customSourceContainer <code>string</code> - Set the default container for your custom source.
    - .customSourcePath <code>string</code> - Set the default path for your custom source container.
    - .preferLinkOverStore <code>boolean</code> <code> = false</code> - For cloud sources whether to __link__ or __store__ files.
    - .lang <code>string</code> <code> = &quot;en&quot;</code> - Sets locale. Accepts: `da`, `de`, `en`, `es`, `fr`, `it`, `ja`, `nl`, `pl`, `pt`, `ru`, `zh`.
    - .minFiles <code>number</code> <code> = 1</code> - Minimum number of files required to start uploading.
    - .maxFiles <code>number</code> <code> = 1</code> - Maximum number of files allowed to upload.
    - .maxSize <code>number</code> - Restrict selected files to a maximum number of bytes. (e.g. `10 * 1024 * 1024` for 1MB limit).
    - .startUploadingWhenMaxFilesReached <code>boolean</code> <code> = false</code> - Whether to start uploading automatically when maxFiles is hit.
    - .hideWhenUploading <code>boolean</code> <code> = false</code> - Hide the picker UI once uploading begins.
    - .uploadInBackground <code>boolean</code> <code> = true</code> - Start uploading immediately on file selection.
    - .disableTransformer <code>boolean</code> <code> = false</code> - When true removes ability to edit images.
    - .disableThumbnails <code>boolean</code> <code> = false</code> - Disables local image thumbnail previews in the summary screen.
    - .transformations <code>object</code> - Specify options for images passed to the crop UI.
        - .crop <code>boolean</code> | <code>object</code> <code> = true</code> - Enable crop.
            - .aspectRatio <code>number</code> - Maintain aspect ratio for crop selection. (e.g. 16/9, 800/600).
            - .force <code>boolean</code> - Force all images to be cropped before uploading.
        - .circle <code>boolean</code> <code> = true</code> - Enable circle crop. __Disabled if `crop.aspectRatio` is defined and not 1. Converts to PNG.__
        - .rotate <code>boolean</code> <code> = true</code> - Enable image rotation.
    - .imageDim <code>Array.&lt;number&gt;</code> - Specify image dimensions. e.g. `[800, 600]`. Only for JPEG, PNG, and BMP files.
  Local and cropped images will be resized (upscaled or downscaled) to the specified dimensions before uploading.
  The original height to width ratio is maintained. To resize all images based on the width, set [width, null], eg. [800, null].
  For the height set [null, height], eg [null, 600].
    - .imageMax <code>Array.&lt;number&gt;</code> - Specify maximum image dimensions. e.g. `[800, 600]`. Only for JPEG, PNG, and BMP files.
  Images bigger than the specified dimensions will be resized to the maximum size while maintaining the original aspect ratio.
  The output will not be exactly 800x600 unless the imageMax matches the aspect ratio of the original image.
    - .imageMin <code>Array.&lt;number&gt;</code> - Specify minimum image dimensions. e.g. `[800, 600]`. Only for JPEG, PNG, and BMP files.
  Images smaller than the specified dimensions will be upscaled to the minimum size while maintaining the original aspect ratio.
  The output will not be exactly 800x600 unless the imageMin matches the aspect ratio of the original image.
    - .storeTo <code>object</code> - Options for file storage.
        - .location <code>string</code> - One of `s3`, `gcs`, `rackspace`, `azure`, `dropbox`.
        - .region <code>string</code> - Valid S3 region for the selected S3 bucket. __S3 only__.
        - .container <code>string</code>
        - .path <code>string</code>
        - .access <code>string</code> - One of `public` or `private`.
    - .onFileSelected [<code>onFileSelected</code>](#module_pick--pick..onFileSelected) - Called whenever user selects a file.
    - .onFileUploadStarted [<code>onFileUploadStarted</code>](#module_pick--pick..onFileUploadStarted) - Called when a file begins uploading.
    - .onFileUploadProgress [<code>onFileUploadProgress</code>](#module_pick--pick..onFileUploadProgress) - Called during multi-part upload progress events. __Local files only__.
    - .onFileUploadFinished [<code>onFileUploadFinished</code>](#module_pick--pick..onFileUploadFinished) - Called when a file is done uploading.
    - .onFileUploadFailed [<code>onFileUploadFailed</code>](#module_pick--pick..onFileUploadFailed) - Called when uploading a file fails.
    - .onClose <code>function</code> - Called when the UI is exited.

**Example**
```js
client.pick({
  maxFiles: 20,
  fromSources: ['local_file_system', 'facebook'],
}).then(res => console.log(res));
```
<a name="module_pick--pick..onFileSelected"></a>

#### onFileSelected : <code>function</code>

**Params**

- file <code>object</code> - File metadata.

**Example**
```js
// Using to veto file selection
// If you throw any error in this function it will reject the file selection.
// The error message will be displayed to the user as an alert.
onFileSelected(file) {
  if (file.size > 1000 * 1000) {
    throw new Error('File too big, select something smaller than 1MB');
  }
}

// Using to change selected file name
onFileSelected(file) {
  file.name = 'foo';
  // It's important to return altered file by the end of this function.
  return file;
}
```
<a name="module_pick--pick..onFileUploadStarted"></a>

#### onFileUploadStarted : <code>function</code>

**Params**

- file <code>object</code> - File metadata.

<a name="module_pick--pick..onFileUploadFinished"></a>

#### onFileUploadFinished : <code>function</code>

**Params**

- file <code>object</code> - File metadata.

<a name="module_pick--pick..onFileUploadFailed"></a>

#### onFileUploadFailed : <code>function</code>

**Params**

- file <code>object</code> - File metadata.
- error <code>error</code> - Error instance for this upload.

<a name="module_pick--pick..onFileUploadProgress"></a>

#### onFileUploadProgress : <code>function</code>

**Params**

- file <code>object</code> - File metadata.
- event <code>object</code> - Progress event.
    - .totalPercent <code>number</code> - Percent of file uploaded.
    - .totalBytes <code>number</code> - Total number of bytes uploaded for this file.

<a name="module_filestack..init.storeURL"></a>

### client.storeURL(url, [options]) ⇒ <code>Promise</code>
Interface to the Filestack [Store API](https://www.filestack.com/docs/rest-api/store). Used for storing from a URL.

**Resolve**: <code>object</code> - Metadata of stored file.  
**Reject**: <code>error</code> - A Superagent error object.  
**Params**

- url <code>string</code> - Valid URL to a file.
- [options] <code>object</code>
    - .filename <code>string</code>
    - .location <code>string</code> <code> = &quot;s3&quot;</code> - One of `s3`, `gcs`, `rackspace`, `azure`, `dropbox`.
    - .mimetype <code>string</code>
    - .path <code>string</code>
    - .container <code>string</code>
    - .region <code>string</code> - Valid S3 region for the selected container (S3 only).
    - .access <code>string</code> - One of `public` or `private`.

**Example**  
```js
client
  .storeURL('https://d1wtqaffaaj63z.cloudfront.net/images/NY_199_E_of_Hammertown_2014.jpg')
  .then(res => console.log(res));
```
<a name="module_filestack..init.retrieve"></a>

### client.retrieve(handle, [options]) ⇒ <code>Promise</code>
Interface to the Filestack [Retrieve API](https://www.filestack.com/docs/rest-api/retrieve).
Used for accessing files via Filestack handles.

**Resolve**: <code>object</code> - Metadata of stored file or stored file, depending on metadata / head option.  
**Reject**: <code>error</code> - A Superagent error object.  
**Params**

- handle <code>string</code> - Valid Filestack handle.
- [options] <code>object</code>
    - .metadata <code>boolean</code> - return json of file metadata
    - .head <code>boolean</code> - perform a 'head' request instead of a 'get'
    - .dl <code>boolean</code> - X-File-Name will be returned
    - .extension <code>string</code> - add extension to handle

**Example**  
```js
client
  .retrieve('DCL5K46FS3OIxb5iuKby')
  .then((blob) => {
     var urlCreator = window.URL || window.webkitURL;
     var imageUrl = urlCreator.createObjectURL(blob);
     document.querySelector('#myImage').src = imageUrl;
  })
  .catch((err) => {
     console.log(err);
  }));
```
<a name="module_filestack..init.remove"></a>

### client.remove(handle) ⇒ <code>Promise</code>
Interface to the Filestack [Remove API](https://www.filestack.com/docs/rest-api/remove).
Used for removing files, __requires security to be enabled__.

**Resolve**: <code>object</code> - Result of remove.  
**Reject**: <code>error</code> - A Superagent error object.  
**Params**

- handle <code>string</code> - Valid Filestack handle.

**Example**  
```js
client
  .remove('DCL5K46FS3OIxb5iuKby')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  }));
```
<a name="module_filestack..init.metadata"></a>

### client.metadata(handle, [options]) ⇒ <code>Promise</code>
Interface to the Filestack [Metadata API](https://www.filestack.com/docs/rest-api/meta-data).
Used for retrieving detailed data of stored files.

**Resolve**: <code>object</code> - Result of metadata.  
**Reject**: <code>error</code> - A Superagent error object.  
**Params**

- handle <code>string</code> - Valid Filestack handle.
- [options] <code>object</code>
    - .size <code>boolean</code>
    - .mimetype <code>boolean</code>
    - .filename <code>boolean</code>
    - .width <code>boolean</code>
    - .height <code>boolean</code>
    - .uploaded <code>boolean</code>
    - .writeable <code>boolean</code>
    - .cloud <code>boolean</code>
    - .sourceUrl <code>boolean</code>
    - .md1 <code>boolean</code>
    - .sha1 <code>boolean</code>
    - .sha224 <code>boolean</code>
    - .sha256 <code>boolean</code>
    - .sha384 <code>boolean</code>
    - .sha512 <code>boolean</code>
    - .location <code>boolean</code>
    - .path <code>boolean</code>
    - .container <code>boolean</code>
    - .exif <code>boolean</code>

**Example**  
```js
client
  .metadata('DCL5K46FS3OIxb5iuKby')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  }));
```
<a name="module_filestack..init.transform"></a>

### client.transform(url, options) ⇒ <code>string</code>
Interface to the Filestack [transformation engine](https://www.filestack.com/docs/image-transformations).

**Returns**: <code>string</code> - A new URL that points to the transformed resource.  
**Params**

- url <code>string</code> - Valid URL to an image.
- options [<code>transformOptions</code>](#module_filestack..transformOptions) - Transformations are applied in the order specified by this object.

**Example**  
```js
const transformedUrl = client.transform(url, {
  crop: {
    dim: {
      x: 0,
      y: 50,
      width: 300,
      height: 300,
    },
  },
  vignette: {
    blurmode: 'gaussian',
    amount: 50,
  },
  flip: true,
};

// optionally store the new URL
client.storeURL(transformedUrl).then(res => console.log(res));
```
<a name="module_filestack..transformOptions"></a>

#### transformOptions : <code>object</code>
**Params**

- crop <code>object</code> - [Crop options.](https://www.filestack.com/docs/image-transformations/crop)
    - .dim <code>object</code> - Crop dimensions.
        - .x <code>number</code>
        - .y <code>number</code>
        - .width <code>number</code>
        - .height <code>number</code>
- resize <code>object</code> - [Resize options.](https://www.filestack.com/docs/image-transformations/resize) At least one option is __required__.
    - .width <code>number</code>
    - .height <code>number</code>
    - .fit <code>string</code> - One of `clip`, `crop`, `scale`, `max`.
    - .align <code>string</code> - One of `center`, `top`, `bottom`, `left`, `right`, `faces`, or align pair like `['top', 'left']`.
- rotate <code>object</code> - [Rotate options](https://www.filestack.com/docs/image-transformations/rotate). At least one option is __required__.
    - .deg <code>number</code> | <code>string</code> - Can be number in range 0-359 or `exif`.
    - .exif <code>boolean</code>
    - .background <code>string</code>
- flip <code>boolean</code> - [Flip](https://www.filestack.com/docs/image-transformations/rotate#flip) image
- flop <code>boolean</code> - [Flop](https://www.filestack.com/docs/image-transformations/rotate#flop) image
- roundedCorners <code>object</code> - [Rounded corners options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#rounded-corners)
    - .radius <code>number</code> | <code>string</code> - Can be number in range 1-10000 or `max`.
    - .blur <code>number</code>
    - .background <code>string</code>
- vignette <code>object</code> - [Vignette options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#vignette)
    - .amount <code>number</code>
    - .blurmode <code>string</code> - One of `linear` or `gaussian`.
    - .background <code>string</code>
- polaroid <code>object</code> - [Polaroid options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#polaroid)
    - .color <code>string</code>
    - .rotate <code>number</code>
    - .background <code>string</code>
- tornEdges <code>object</code> - [Torn edges options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#torn-edges)
    - .spread <code>Array.&lt;number&gt;</code> - Range format `[10, 50]`.
    - .background <code>string</code>
- shadow <code>object</code> - [Shadow options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#shadow)
    - .blur <code>number</code>
    - .opacity <code>number</code>
    - .vector <code>Array.&lt;number&gt;</code> - Range format `[25, 25]`.
    - .color <code>string</code>
    - .background <code>string</code>
- circle <code>object</code> - [Circle options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#circle)
    - .background <code>string</code>
- border <code>object</code> - [Border options.](https://www.filestack.com/docs/image-transformations/borders-and-effects#border)
    - .width <code>number</code>
    - .color <code>number</code>
    - .background <code>number</code>
- monochrome <code>boolean</code> - [Monochrome.](https://www.filestack.com/docs/image-transformations/filters#monochrome)
- sepia <code>object</code> - [Sepia.](https://www.filestack.com/docs/image-transformations/filters#sepia)
    - .tone <code>number</code>
- output <code>object</code> - [Output options.](https://www.filestack.com/docs/image-transformations/conversion)
    - .format <code>string</code>
    - .background <code>string</code>
    - .page <code>Array.&lt;number&gt;</code> - Range format `[1, 10000]`.
    - .density <code>Array.&lt;number&gt;</code> - Range format `[1, 500]`.
    - .compress <code>boolean</code>
    - .quality <code>number</code> | <code>string</code> - Can be number in range 1-100 or `input`.
    - .input <code>boolean</code>
    - .strip <code>boolean</code>
    - .colorspace <code>string</code> - One of `rgb`, `cmyk`, or `input`.
    - .secure <code>boolean</code>
    - .docinfo <code>boolean</code>
    - .pageformat <code>string</code> - One of `a3`, `a4`, `a5`, `b4`, `b5`, `letter`, `legal`, or `tabloid`.
    - .pageorientation <code>string</code> - One of `landscape` or `portrait`.

<a name="module_filestack..init.upload"></a>

### client.upload(file, [uploadOptions], [storeOptions], [token]) ⇒ <code>Promise</code>
Initiates a direct-to-S3 multi-part upload. Uses Filestack S3 by default. Read how to configure your own S3 buckets [here](https://www.filestack.com/docs/cloud-storage/s3).

**Resolve**: <code>object</code> - Metadata of uploaded file.  
**Reject**: <code>error</code> - An Error object depending on where the flow halted.  
**Params**

- file <code>Blob</code> | <code>string</code> - must be a valid [File](https://developer.mozilla.org/en-US/docs/Web/API/File), Blob, or base64 encoded string.
- [uploadOptions] <code>object</code>
    - [.partSize] <code>number</code> <code> = 6 * 1024 * 1024</code> - Size of each uploaded part.
    - [.concurrency] <code>number</code> <code> = 5</code> - Max number of concurrent parts uploading.
    - [.retry] <code>number</code> <code> = 10</code> - Number of times to retry a failed part of the flow.
    - [.progressInterval] <code>number</code> <code> = 1000</code> - Frequency (in milliseconds) at which progress events are dispatched.
    - [.onProgress] [<code>progressCallback</code>](#module_filestack..progressCallback) - Called regularly to give progress updates.
    - [.onRetry] [<code>retryCallback</code>](#module_filestack..retryCallback) - Called when a retry is initiated.
- [storeOptions] <code>object</code> - Configure where the file is stored.
    - [.filename] <code>string</code> - Define a custom filename for the Blob/File being uploaded.
    - [.location] <code>string</code> <code> = &quot;s3&quot;</code> - Valid options are: `s3`, `gcs`, `dropbox`, `azure`, `rackspace`.
    - [.region] <code>string</code> - Valid S3 region for the selected container (S3 only).
    - [.container] <code>string</code> - Name of the storage container.
    - [.path] <code>string</code> - Path where the file will be stored. A trailing slash will put the file in that folder path.
    - [.access] <code>string</code> - Valid options are `private` or `public`.
- [token] <code>object</code> - A control token that can be used to call cancel(), pause(), and resume().

**Example**  
```js
const token = {};
const onRetry = (obj) => {
  console.log(`Retrying ${obj.location} for ${obj.filename}. Attempt ${obj.attempt} of 10.`);
};

client.upload(file, { onRetry }, { filename: 'foobar.jpg' }, token)
  .then(res => console.log(res));

token.pause();  // Pause flow
token.resume(); // Resume flow
token.cancel(); // Cancel flow (rejects)
```
<a name="module_filestack..progressCallback"></a>

#### progressCallback : <code>function</code>
**Params**

- event <code>object</code> - Progress event.
    - .totalPercent <code>number</code> - Percent of total file upload progress.
    - .totalBytes <code>number</code> - Total number of bytes uploaded thus far across all parts.

<a name="module_filestack..retryCallback"></a>

#### retryCallback : <code>function</code>
**Params**

- retry <code>object</code> - Retry information object.
    - .location <code>string</code> - Which part of the flow is being retried.
    - .parts <code>Array.&lt;object&gt;</code> - Array of current parts at this point in the flow.
    - .filename <code>string</code> - Name of the file being retried.
    - .attempt <code>number</code> - Current attempt.


* * *

&copy; 2017 Filestack.
