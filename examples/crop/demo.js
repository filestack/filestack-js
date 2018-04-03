window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const client = filestack.init(apikey);

  document.querySelector('input').addEventListener('change', (event) => {
    const files = event.target.files;
    const pickOptions = {
      transformations: {
        crop: {
          aspectRatio: 16/9,
        },
        circle: false
      },
      onUploadDone: res => console.log(res),
    };
    const picker = client.picker(pickOptions);
    picker.crop(files);
  });
});
