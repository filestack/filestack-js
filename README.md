<p align="center">
  <a href="https://www.filestack.com"><img src="http://static.filestackapi.com/filestack-js.svg?refresh" align="center" width="250" /></a>  
</p>
<p align="center">
  <strong>Javascript SDK for the Filestack API and content management system.</strong>
</p>
<p align="center">
  <a href="https://npmjs.com/package/filestack-js"><img src="https://img.shields.io/npm/v/filestack-js.svg" /></a>
  <a href="https://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js?compression=gzip&color=green" /></a>
  <a href="https://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js"><img src="http://img.badgesize.io/http://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js?color=green" /></a>
  <img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm%2C%20cjs-green.svg" />
  <br/>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=11&safari=latest&iphone=latest" />
</p>
<hr/>

## What's in the box?

* A multi-part uploader powered on the backend by the [Filestack CIN](https://www.filestack.com/products/content-ingestion-network).
* An interface to the [Filestack Processing Engine](https://www.filestack.com/docs/image-transformations) for transforming assets via URLs.
* The Filestack Picker - an upload widget for the web that integrates over a dozen cloud providers and provides pre-upload image editing. 

## Installation

```sh
npm install filestack-js
```
## Usage

### Browsers

**ES module**:
```js
import * as filestack from 'filestack-js';
const client = filestack.init('apikey');
```

**UMD module**:
```HTML
<script src="//static.filestackapi.com/filestack-js/1.x.x/filestack.min.js"></script>
<script>
  const client = filestack.init('apikey');
</script>
```

### Node

**CommonJS module**:
```js
const client = require('filestack-js').init('apikey');
```

### Module Overview 

The `package.json` specifies two separate modules: 

* `main` for the CommonJS module (intended for Node runtimes)
* `browser` for the pre-bundled ES module (intended for browser runtimes)

Node projects which depend on filestack-js will follow the `main` field in `package.json`. When building for the browser, newer tools (like Webpack, Rollup, and Parcel) follow the `browser` field, which will resolve to the pre-bundled ES module. Both modules follow the same API, but some methods behave differently based on their runtime. For example, `client.upload` treats the file argument as a file path in Node but in browsers it assumes a Blob object.

The pre-bundled browser module is also available in UMD format. This is useful if you are using script tags on a web page instead of bundling your application. It can be retrieved from both the Filestack CDN and the unpkg CDN:

* [Filestack CDN](https://static.filestackapi.com/filestack-js/1.x.x/filestack.min.js)
* [unpkg](https://unpkg.com/filestack-js@1.x.x)

## Live examples (JSFiddle)

[Upload image](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/upload)  
[Open picker](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/picker)  
[Open picker in inline mode](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/picker-inline)  
[Crop images](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/crop)  
[Multiple drop panes](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/multiple-drop-panes)  
[Preview](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/preview)  
[Import using RequireJS](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/requirejs)  
[Retrieve image data](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/retrieve)  
[Transform image](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/transform)  
[Custom Picker CSS](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/customization)  
[Assign file to user](http://jsfiddle.net/gh/get/library/pure/filestack/filestack-js/tree/master/examples/assign-file-to-user)  

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

## API Documentation

[https://filestack.github.io/filestack-js/](https://filestack.github.io/filestack-js/)

### Promises

This library requires an environment that implements the [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object spec. 
If you target IE11 or iOS before 8.0 you will need to add a `Promise` polyfill to your page or application.

**Polyfills we recommend:**

Module (for bundling):
* https://github.com/taylorhakes/promise-polyfill

Script (for script tag):
* https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise

## Development

Most tests in this library are expected to interface with actual backend services. Because we like to run tests during development, these services are mocked 
during unit testing.

All tests are using Mocha. Browser tests are run with Karma.

To run units:

```
npm test
```

To run integration tests:

```
npm run test:integration
```

Integration tests require a `.env` file in the root of your project with the following fields:

```
BROWSERSTACK_USERNAME=
BROWSERSTACK_ACCESS_KEY=
TEST_APIKEY=
TEST_CLOUD_APIKEY=
TEST_INTELLIGENT_APIKEY=
TEST_SECURE_APIKEY=
TEST_SIGNATURE=
TEST_POLICY=
TEST_FILELINK=
TEST_SECURE_FILELINK=
```

You will need to acquire this data from a Filestack developer if you plan on running the integration suite.

## Contributing

We follow the [conventional commits](https://conventionalcommits.org/) specification to ensure consistent commit messages and changelog formatting.
