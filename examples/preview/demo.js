window.addEventListener('DOMContentLoaded', function () {
    const apikey = 'YOUR_APIKEY';
    const client = filestack.init(apikey);
    client.preview('7m1aL2WEQg2Dkh1Cxgpi', { id: 'content' });
});
