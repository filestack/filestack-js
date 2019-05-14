# Filestack-js@3.0.0 Releases notes

## Features

- Add multiupload feature
  ```js
    client
      .multiupload([file1, file2, file3], { onRetry }, { filename: (normalizedFile) => {
        return 'newname.jpg'
      } }, token)
      .then(res => console.log(res));
  ```
- Add debug for uploads
- Rewrite retry policy (retry on all 5xx request and connection errors, do not retry on 4xx errors)
- Update progress event (now its returning overall progress and for each file)
- Rewrite upload to objective typescript
- filename now supports function: 
  ```js
    client
      .upload(file, { onRetry }, { filename: (normalizedFile) => {
        return 'newname.jpg'
      } }, token)
      .then(res => console.log(res));
  ```
- file argument in upload now supports "named file" object so, we can pass name for each file
  ```js
    client
      .upload({
        file,
        name: (normalizedFile) => 'newname.jpg'
      })
      .then(res => console.log(res));
  ```
- added setSecurity and setCname methods to client
  
  ```js
    client
      .setSecurity({
        policy: 'newPolicy'
        signature: 'newSignature'
      })
      .upload({
        file,
        name: (normalizedFile) => 'newname.jpg'
      })
      .then(res => console.log(res));
  ```
- change request library to axios (better error handling)
  ```js
    const apikey = 'YOUR_APIKEY';
    const src = new filestack.Filelink('EXAMPLE_HANDLE', apikey)
    try {
      src.blur({amount: 15})
        .resize({
          wrongOption: 720,
          height: 480,
        }
      );
    }.catch(e: FilestackError => {
      console.log(e.message);
      console.log(e.details); // detailed validation errors
    })

  ```

  ```js
     try {
       client
        .picker({
          wrongPickerOption: true
        })
        .open();
     }.catch(e: FilestackError => {
      console.log(e.message);
      console.log(e.details); // detailed validation errors
    })

  ```
- rewrite all options validation to JSONSchema and remove old library
- rewrite all tests (now tests are splitter to integrations and units)
- add missing transformations uglifyJs and uglyfyCss
- minor fixes

## Deprecation: 
- remove preferLinkOverStorage picker option
  
## Others:
- move to new build system (webpack)
- reduce bundle size to 150kb (~50kb gzipped)
- add codeconv service and setup pull requests to minimum tests coverage (99%)
- add sri hashes to manifest.json
- update outdated packages
- cleanup unused packages

