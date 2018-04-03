window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const client = filestack.init(apikey);

  const src = client.transform('7m1aL2WEQg2Dkh1Cxgpi', {
    blur: {
      amount: 15
    },
    border: true,
    resize: {
      width: 720,
      height: 480,
    },
  });

  const img = document.createElement('img');
  img.src = src;

  document.getElementById('content').appendChild(img);
});
