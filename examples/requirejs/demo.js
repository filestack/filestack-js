const apikey = 'YOUR_APIKEY';

window.addEventListener('DOMContentLoaded', function () {
  requirejs.config({
    baseUrl: "js",
    paths: {
      "filestack": "//static.filestackapi.com/filestack-js/1.x.x/filestack"
    },
  });

  requirejs(['filestack'], function (filestack) {
    const client = filestack.init(apikey);

    const img = document.createElement('img');
    img.src = client.transform('7m1aL2WEQg2Dkh1Cxgpi', {
      blur: {
        amount: 10
      }
    });

    document.getElementById('content').appendChild(img);
  });
});
