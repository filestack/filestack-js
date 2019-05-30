window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const src = new filestack.Filelink('FILESTACK_HANDLE', apikey)
  src.blur({amount: 15})
      .border()
      .resize({
        width: 720,
        height: 480,
      }
  );

  const img = document.createElement('img');
  img.src = src.toString();

  document.getElementById('content').appendChild(img);
});
