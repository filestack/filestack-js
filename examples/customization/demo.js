window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const client = filestack.init(apikey);
  const picker = client.picker({
    fromSources: ['local_file_system', 'url', 'imagesearch'],
    maxFiles: 20,
    uploadInBackground: false,
    onOpen: () => console.log('opened!'),
  });
  picker.open();
});
