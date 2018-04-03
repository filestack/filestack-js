window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_API_KEY';
  const client = filestack.init(apikey);
  const options = {
    maxFiles: 20,
    uploadInBackground: false,
    onOpen: () => console.log('opened!'),
    onUploadDone: (res) => console.log(res),
  };
  client.picker(options).open();
});
