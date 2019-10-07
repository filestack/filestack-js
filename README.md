<p align="center">
  <a href="https://www.filestack.com"><img src="https://static.filestackapi.com/filestack-js.svg?refresh" align="center" width="250" /></a>  
</p>
<p align="center">
  <strong>Javascript SDK for the Filestack API and content management system.</strong>
</p>
<p align="center">
  <a href="https://codecov.io/gh/filestack/filestack-js">
    <img src="https://codecov.io/gh/filestack/filestack-js/branch/master/graph/badge.svg" />
  </a>

  <a href="https://travis-ci.org/filestack/filestack-js">
    <img src="https://travis-ci.org/filestack/filestack-js.svg?branch=master" />
  </a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/filestack-js"><img src="https://img.shields.io/npm/v/filestack-js.svg" /></a>
  <a href="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"><img src="https://img.badgesize.io/https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js?compression=gzip&color=green" /></a>
  <a href="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"><img src="https://img.badgesize.io/https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js?color=green" /></a>
  <img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm%2C%20cjs-green.svg" />
  <br/>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=11&safari=latest&iphone=latest" />
</p>
<hr/>

**Table of Contents**

<!-- toc -->
- [What's in the box?](#whats-in-the-box)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Usage](#usage)
  - [Browsers](#browsers)
    - [ES module](#es-module)
    - [UMD module](#umd-module)
    - [SRI](#sri)
  - [Node](#node)
    - [CommonJS module](#commonjs-module)
- [Module Overview](#module-overview)
- [Releases Info](#releases-info)
- [Live examples (JSFiddle)](#live-examples-jsfiddle)
- [Picker Quick Start](#picker-quick-start)
- [Polyfills](#polyfills)
- [Development](#development)
- [Debugging](#debugging)
  - [Node](#node-1)
  - [Browser](#browser)
  - [Error event](#error-event)
- [Sentry Integration](#sentry-integration)
- [Versioning](#versioning)
- [Contributing](#contributing)


## What's in the box?

* A multi-part uploader powered on the backend by the [Filestack CIN](https://www.filestack.com/products/content-ingestion-network).
* An interface to the [Filestack Processing Engine](https://www.filestack.com/docs/image-transformations) for transforming assets via URLs.
* The Filestack Picker - an upload widget for the web that integrates over a dozen cloud providers and provides pre-upload image editing. 


## Installation

```sh
npm install filestack-js
```

## API Documentation

[https://filestack.github.io/filestack-js/](https://filestack.github.io/filestack-js/)

## Usage

### Browsers

#### ES module
```js
import * as filestack from 'filestack-js';
const client = filestack.init('apikey');
```

#### UMD module
```HTML
<script src="//static.filestackapi.com/filestack-js/{MAJOR_VERSION}.x.x/filestack.min.js" crossorigin="anonymous"></script>
<script>
  const client = filestack.init('apikey');
</script>
```

where ```{MAJOR_VERSION}``` is one of the MAJOR versions of the filestack-js ie: 
```HTML
<script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js" crossorigin="anonymous"></script>
<script>
  const client = filestack.init('apikey');
</script>
```


#### SRI
Subresource Integrity (SRI) is a security feature that enables browsers to verify that files they fetch (for example, from a CDN) are delivered without unexpected manipulation. It works by allowing you to provide a cryptographic hash that a fetched file must match

To obtain sri hashes for filestack-js library check manifest.json file on CDN:

```
https://static.filestackapi.com/filestack-js/{LIBRARY_VERSION}/manifest.json
```

```HTML
<script src="//static.filestackapi.com/filestack-js/{LIBRARY_VERSION}/filestack.min.js.gz" integrity="{FILE_HASH}" crossorigin="anonymous"></script>
```

Where ```{LIBRARY_VERSION}``` is currently used library version and ```{FILE_HASH}``` is one of the hashes from integrity field in manifest.json file


### Node

#### CommonJS module
```js
const client = require('filestack-js').init('apikey');
```


## Module Overview 

The `package.json` specifies two separate modules: 

* `main` for the CommonJS module (intended for Node runtimes)
* `browser` for the pre-bundled ES module (intended for browser runtimes)

Node projects which depend on filestack-js will follow the `main` field in `package.json`. When building for the browser, newer tools (like Webpack, Rollup, and Parcel) follow the `browser` field, which will resolve to the pre-bundled ES module. Both modules follow the same API, but some methods behave differently based on their runtime. For example, `client.upload` treats the file argument as a file path in Node but in browsers it assumes a Blob object.

The pre-bundled browser module is also available in UMD format. This is useful if you are using script tags on a web page instead of bundling your application. It can be retrieved from both the Filestack CDN and the unpkg CDN:

* [Filestack CDN](https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js)
* [unpkg](https://unpkg.com/filestack-js@3.x.x)

## Releases Info

Major releases will bo listed (with detailed examples) in releases folder starting from version 3.0.0


## Live examples (JSFiddle)

[Upload image](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/upload)  
[Multiupload](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/multiupload)  
[Open picker](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/picker)  
[Open picker in inline mode](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/picker-inline)  
[Crop images](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/crop)  
[Multiple drop panes](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/multiple-drop-panes)  
[Preview](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/preview)  
[Import using RequireJS](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/requirejs)  
[Retrieve image data](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/retrieve)  
[Transform image](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/transform)  
[Custom Picker CSS](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/customization)  
[Assign file to user](https://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/assign-file-to-user)  

Examples can be run locally with: 
```
npm run examples
```

## Picker Quick Start

If you are here to use the picker widget, it can be initialized from the Filestack client by calling `client.picker(options)`. Options for the picker are [documented here](https://filestack.github.io/filestack-js/interfaces/pickeroptions.html).

The picker instance returned from `client.picker` can be controlled with a few methods:

* open - Create the application and mount it into the DOM based on the `displayMode`.
* close - Close the application and remove its resources from the DOM.
* crop(files) - Create the application, mount it, and pre-select the passed files for cropping.
* cancel - Cancel all uploads controlled by this instance.

Please see our examples above to learn more about customizing the picker for your use case.

## Polyfills

If you target IE11 or iOS before 8.0 you will need to add additional polyfills to your page or application.

Polyfills we recommend:**

Module (for bundling):
* https://babeljs.io/docs/en/babel-polyfill

Script (for script tag):
* https://polyfill.io/v3/polyfill.min.js?features=Promise%2CSymbol%2CSymbol.iterator%2CArray.from%2CObject.assign%2CNumber.isFinite%2CString.prototype.includes

## Development

Most tests in this library are expected to interface with actual backend services. Because we like to run tests during development, these services are mocked during unit testing.

All tests are using Jest. 

To run units:

```
npm test
```

## Debugging

Filestack-js uses [`debug`](https://github.com/visionmedia/debug), so just run with environmental variable `DEBUG` set to `fs.*`.

### Node
```js
DEBUG=fs.* node example_upload.js
```

### Browser
Debug's enable state is persisted by localStorage

```js
localStorage.debug = 'fs:*'
```

And then refresh the page.

### Error event
The ```upload.error``` event was added to sdk. To obtain every upload request error just add callback to it. 
Error contains details field with responseBody, responseHeaders, code (only when error type is FilestackErrorType.REQUEST)

```js
<script>
  const client = filestack.init('apikey');
  client.on('upload.error', (filestackError) => {
    console.log(filestackError);
  });
</script>
```

## Sentry Integration
filestack-js now using [@sentry/minimal](https://www.npmjs.com/package/@sentry/minimal) package.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/filestack/filestack-js/tags) on this repository.

## Contributing

We follow the [conventional commits](https://conventionalcommits.org/) specification to ensure consistent commit messages and changelog formatting.
