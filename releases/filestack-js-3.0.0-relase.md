# Filestack-js@3.0.0 Releases notes

## Features
- **[BREAKING]** add name sanitization<br>
  by default following characters: 
  ```
  ['\\', '{', '}', '|', '%', '`', '"', "'", '~', '[', ']', '#', '|', '^', '<', '>']
  ```
  will be replaced with '-'<br><br>
  to disable sanitizer set storeUploadOption - sanitizer to false<br><br>
  @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html

- **[ENHANCEMENT]** storeUrl now use new base64 transform protocol by default
- **[FEATURE]** add multiupload feature
  ```js
    client
      .multiupload([file1, file2, file3], { onRetry }, { filename: (normalizedFile) => {
        return 'newname.jpg'
      } }, token)
      .then(res => console.log(res));
  ```

- **[ENHANCEMENT]** rewrite retry policy (retry on all 5xx request and connection errors, do not retry on 4xx errors)
- **[ENHANCEMENT]** update progress event (now its returning overall progress and for each file)
- **[FEATURE]** add debug for uploads
- **[FEATURE]** filename now supports function: 
  ```js
    client
      .upload(file, { onRetry }, { filename: (normalizedFile) => {
        return 'newname.jpg'
      } }, token)
      .then(res => console.log(res));
  ```
- **[FEATURE]** file argument in upload now supports "named file" object so, we can pass name for each file
  ```js
    client
      .upload({
        file,
        name: (normalizedFile) => 'newname.jpg'
      })
      .then(res => console.log(res));
  ```
- **[ENHANCEMENT]** added setSecurity and setCname methods to client
  
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
- **[ENHANCEMENT]** rewrite all options validation to JSONSchema and remove old tcomb library
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
- **[ENHANCEMENT]** rewrite all tests (now tests are splitted to integrations and units)
- **[ENHANCEMENT]** change request library to axios (better error handling)
- **[FEATURE]** add missing transformations uglifyJs and uglifyCss
- minor fixes

## Deprecation: 
- **[BREAKING]** remove preferLinkOverStorage picker option
  
## Others:
- Rewrite upload to objective typescript
- move to new build system (webpack)
- add codeconv service and setup pull requests to minimum tests coverage (99%)
- add sri hashes to manifest.json
- update outdated packages
- cleanup unused packages
