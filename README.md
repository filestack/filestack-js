filestack-js
======================

Official browser client to the Filestack API's. Available via NPM and CDN script.

Filestack documentation can be found here: https://filestack.com/docs/

## Installation
```sh
npm install --save filestack-js
```
## Usage

Via ES6 modules:
```js
import filestack from 'filestack-js';

const apikey = 'abc';
const client = filestack.init(apikey);
```

Via script tag:
```HTML
<script src="http://static.filestackapi.com/v3/filestack.js"></script>
<script>
  const apikey = 'abc';
  const client = filestack.init(apikey);
</script>
```

# API Reference
  
* [filestack](#module_filestack)
    * [~version](#module_filestack..version) ⇒ <code>string</code>
    * [~init(apikey, [security])](#module_filestack..init) ⇒ <code>object</code>
    	* [.getSecurity()](#module_filestack..init.getSecurity) ⇒ <code>object</code>
        * [.setSecurity(security)](#module_filestack..init.setSecurity) ⇒ <code>object</code>
        * [.pick([options])](#exp_module_pick--pick) ⇒ <code>Promise</code>
       	* [.storeURL(url, [options])](#module_filestack..init.storeURL) ⇒ <code>Promise</code>
        * [.retrieve(handle, [options])](#module_filestack..init.retrieve) ⇒ <code>Promise</code>
        * [.remove(handle)](#module_filestack..init.remove) ⇒ <code>Promise</code>
        * [.metadata(handle, [options])](#module_filestack..init.metadata) ⇒ <code>Promise</code>
        * [.transform(url, options)](#module_filestack..init.transform) ⇒ <code>string</code>
        * [.upload(file, [uploadOptions], [storeOptions])](#module_filestack..init.upload) ⇒ <code>Promise</code>
    * [~TransformOptions](#module_filestack..TransformOptions) : <code>object</code>
    * [~progressCallback](#module_filestack..progressCallback) : <code>function</code>
    * [~retryCallback](#module_filestack..retryCallback) : <code>function</code>


<a name="module_filestack..version"></a>

### filestack~version ⇒ <code>string</code>
Gets current version.

**Kind**: inner property of <code>[filestack](#module_filestack)</code>  
**Example**  
```js
import filestack from 'filestack-js';
console.log(filestack.version);
```
<a name="module_filestack..init"></a>

### filestack~init(apikey, [security]) ⇒ <code>object</code>
Initializes the client.

**Kind**: inner method of <code>[filestack](#module_filestack)</code>  
**Returns**: <code>object</code> - Object containing the available methods documented below.  
**Params**
  - apikey <code>string</code> - Filestack API key. Get a free key [here](https://dev.filestack.com/register/free).  
  - [security] <code>object</code> - Read about [security policies](https://www.filestack.com/docs/security).  
    - .policy <code>string</code> - Filestack security policy encoded in base64.  
    - .signature <code>string</code> - HMAC-SHA256 sIgnature for the security policy.  

<a name="exp_module_pick--pick"></a>
  
<a name="module_filestack..init.getSecurity"></a>

### client.getSecurity() ⇒ <code>object</code>
Get current security parameters.

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Returns**: <code>object</code> - Object containing current security parameters  
<a name="module_filestack..init.setSecurity"></a>

### client.setSecurity(security) ⇒ <code>object</code>
Set security parameters -- useful for changing policy on instantiated client.

**Note:** Does not currently work with `pick`. You will need to re-init the client if you want to propagate new security parameters to the picker.

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Returns**: <code>object</code> - Object containing current session parameters  
**Params**

- security <code>object</code> - Read about [security policies](https://www.filestack.com/docs/security).
    - .policy <code>string</code> - Filestack security policy encoded in base64.
    - .signature <code>string</code> - HMAC-SHA256 sIgnature for the security policy.

**Example**  
```js
client.setSecurity({ policy: 'policy', signature: 'signature' });
```

### client.pick([options]) ⇒ <code>Promise</code> ⏏
Opens the picker UI.

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Object contains keys `filesUploaded` and `filesFailed` which are both arrays of file metadata.  
**Params**

- [options] <code>object</code>
    - .fromSources <code>Array.&lt;string&gt;</code> - Valid sources are:
      - `local_file_system` - __Default__
      - `imagesearch` - __Default__
      - `facebook` - __Default__
      - `instagram` - __Default__
      - `googledrive` - __Default__
      - `dropbox` - __Default__
      - `evernote`
      - `flickr`
      - `box`
      - `github`
      - `gmail`
      - `picasa`
      - `onedrive`
      - `clouddrive`
    - .accept <code>string</code> | <code>Array.&lt;string&gt;</code> - Restrict file types that are allowed to be picked. Formats accepted:
      - `.pdf` <- any file extension
      - `image/jpeg` <- any mime type commonly known by browsers
      - `image/*` <- special mime type accepting all types of images
      - `video/*` <- special mime type accepting all types of video files
      - `audio/*` <- special mime type accepting all types of audio files
    - .preferLinkOverStore <code>boolean</code> <code> = false</code> - For cloud sources whether to __link__ or __store__ files.
    - .lang <code>string</code> <code> = &quot;en&quot;</code> - Sets locale. Accepts: `da`, `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `ru`, `zh`.
    - .minFiles <code>number</code> <code> = 1</code> - Minimum number of files required to start uploading.
    - .maxFiles <code>number</code> <code> = 1</code> - Maximum number of files allowed to upload.
    - .startUploadingWhenMaxFilesReached <code>boolean</code> <code> = false</code> - Whether to start uploading automatically when maxFiles is hit.
    - .hideWhenUploading <code>boolean</code> <code> = false</code> - Hide the picker UI once uploading begins.
    - .uploadInBackground <code>boolean</code> <code> = true</code> - Start uploading immediately on file selection.
    - .disableTransformer <code>boolean</code> <code> = false</code> - When true removes ability to edit images with transformer UI.
    - .transformOptions <code>object</code> - Options to be passed to the transformer UI.
      - .minDimensions <code>array</code> - Minimum dimensions for picked image. Image will be upscaled if smaller. (e.g. [200, 300])
      - .maxDimensions <code>array</code> - Maximum dimensions for picked image. Image will be downscaled if smaller. (e.g. [200, 300])
      - .transformations <code>object</code> - Enable and set options for various transformations.
          - .crop <code>boolean</code> | <code>object</code> - Enable crop.
              - .aspectRatio <code>number</code> - Maintain aspect ratio for crop selection. (e.g. 16/9 or 4/3)
        - .rotate <code>boolean</code> - Enable rotate.
        - .circle <code>boolean</code> - Enable circle.
        - .monochrome <code>boolean</code> - Enable monochrome.
        - .sepia <code>boolean</code> - Enable sepia.
    - .storeTo <code>object</code> - Options for file storage.
        - .location <code>string</code> <code> = &quot;s3&quot;</code> - One of `s3`, `gcs`, `rackspace`, `azure`, `dropbox`.
        - [.region] <code>string</code> - Valid S3 region for the selected container (S3 only).
        - .container <code>string</code>
        - .path <code>string</code>
        - .access <code>string</code> - One of `public` or `private`.
    - .onFileSelected <code>[onFileSelected](#module_pick--pick..onFileSelected)</code> - Called whenever user selects a file.
    - .onFileUploadStarted <code>[onFileUploadStarted](#module_pick--pick..onFileUploadStarted)</code> - Called when a file begins uploading.
    - .onFileUploadProgress <code>[onFileUploadProgress](#module_pick--pick..onFileUploadProgress)</code> - Called during multi-part upload progress events.
    - .onFileUploadFinished <code>[onFileUploadFinished](#module_pick--pick..onFileUploadFinished)</code> - Called when a file is done uploading.
    - .onFileUploadFailed <code>[onFileUploadFailed](#module_pick--pick..onFileUploadFailed)</code> - Called when uploading a file fails.

**Example**
```js
client.pick({
  maxFiles: 20,
  fromSources: ['local_file_system', 'facebook'],
}).then(res => console.log(res));
```
<a name="module_pick--pick..onFileSelected"></a>

#### client.pick~onFileSelected : <code>function</code>
**Kind**: inner typedef of <code>[pick](#exp_module_pick--pick)</code>

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

#### client.pick~onFileUploadStarted : <code>function</code>
**Kind**: inner typedef of <code>[pick](#exp_module_pick--pick)</code>

**Params**

- file <code>object</code> - File metadata.

<a name="module_pick--pick..onFileUploadFinished"></a>

#### client.pick~onFileUploadFinished : <code>function</code>
**Kind**: inner typedef of <code>[pick](#exp_module_pick--pick)</code>

**Params**

- file <code>object</code> - File metadata.

<a name="module_pick--pick..onFileUploadFailed"></a>

#### client.pick~onFileUploadFailed : <code>function</code>
**Kind**: inner typedef of <code>[pick](#exp_module_pick--pick)</code>

**Params**

- file <code>object</code> - File metadata.
- error <code>error</code> - Error instance for this upload.

<a name="module_pick--pick..onFileUploadProgress"></a>

#### client.pick~onFileUploadProgress : <code>function</code>
**Kind**: inner typedef of <code>[pick](#exp_module_pick--pick)</code>

**Params**

- file <code>object</code> - File metadata.
- event <code>object</code> - Progress event.
    - .totalProgressPercent <code>number</code> - Percent of total upload.
    - .progressTotal <code>number</code> - Total number of bytes uploaded thus far across all parts.
    - .part <code>number</code> - Part #.
    - .loaded <code>number</code> - Amount of data in this part that has been uploaded.
    - .byteLength <code>number</code> - Total number of bytes in this part.

<a name="module_filestack..init.storeURL"></a>

### client.storeURL(url, [options]) ⇒ <code>Promise</code>
Interface to the Filestack [Store API](https://www.filestack.com/docs/rest-api/store). Used for storing from a URL.

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Metadata of stored file.  
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

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Metadata of stored file or stored file, depending on metadata / head option.  
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

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Result of remove.  
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

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Result of metadata.  
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

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Returns**: <code>string</code> - A new URL that points to the transformed resource.  
**Params**

- url <code>string</code> - Valid URL to an image.
- options <code>[TransformOptions](#module_filestack..TransformOptions)</code> - Transformations are applied in the order specified by this object.

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
<a name="module_filestack..init.upload"></a>

### client.upload(file, [uploadOptions], [storeOptions]) ⇒ <code>Promise</code>
Initiates a multi-part upload flow.

**Kind**: static method of <code>[init](#module_filestack..init)</code>  
**Fulfil**: <code>object</code> - Metadata of uploaded file.  
**Reject**: <code>error</code> - An error object depending on where the flow halted.  
**Params**

- file <code>File</code> - must be a valid [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
- [uploadOptions] <code>object</code>
    - [.partSize] <code>number</code> <code> = 5 * 1024 * 1024</code> - Size of each uploaded part.
    - [.maxConcurrentUploads] <code>number</code> <code> = 5</code> - Max number of concurrent uploads.
    - [.retryOptions] <code>object</code> - params for retry settings
        - [.retries] <code>number</code> <code> = 10</code> - max number of retries
        - [.factor] <code>number</code> <code> = 2</code> - the exponential factor to use
        - [.minTimeout] <code>number</code> <code> = 1 * 1000</code> - ms before starting first retry
        - [.maxTimeout] <code>number</code> <code> = 60 * 1000</code> - max ms between two retries
    - [.onStart] <code>function</code> - Called when the flow begins (before Filestack handshake request is made).
    - [.onUploadStart] <code>function</code> - Called when an upload begins (after S3 request is made).
    - [.onProgress] <code>[progressCallback](#module_filestack..progressCallback)</code> - Called on progress event.
    - [.onRetry] <code>[retryCallback](#module_filestack..retryCallback)</code> - Called if upload fails and retry is occurring
    - [.onUploadComplete] <code>function</code> - Called when an upload is completing (before final completion request).
- [storeOptions] <code>object</code> - Configure where the file is stored.
    - .location <code>string</code> - Valid options are: `s3`, `gcs`, `dropbox`, `azure`, `rackspace`.
    - .container <code>string</code> - Name of the storage container.
    - [.region] <code>string</code> - Valid S3 region for the selected container (S3 only).
    - .path <code>string</code> - Path where the file will be stored. A trailing slash will put the file in that folder path.
    - .access <code>string</code> - Valid options are `private` or `public`.
    
**Example**  
```js
client.upload(file).then(res => console.log(res));
```
<a name="module_filestack..TransformOptions"></a>

### filestack~TransformOptions : <code>object</code>
**Kind**: inner typedef of <code>[filestack](#module_filestack)</code>  
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

<a name="module_filestack..progressCallback"></a>

### filestack~progressCallback : <code>function</code>
**Kind**: inner typedef of <code>[filestack](#module_filestack)</code>  
**Params**

- event <code>object</code> - Progress event.
    - .totalProgressPercent <code>number</code> - Percent of total upload.
    - .progressTotal <code>number</code> - Total number of bytes uploaded thus far across all parts.
    - .part <code>number</code> - Part #.
    - .loaded <code>number</code> - Amount of data in this part that has been uploaded.
    - .byteLength <code>number</code> - Total number of bytes in this part.
    
### filestack~retryCallback : <code>function</code>
**Kind**: inner typedef of <code>[filestack](#module_filestack)</code>  
**Params**

- attempt <code>number</code> - Which attempt the upload is currently on.
- nextAttempt <code>number</code> - ms before the attempt will start


* * *

&copy; 2017 Filestack.
