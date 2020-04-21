const client = require('./client').client;

client.upload(Buffer.from('testtest'), {}, { container: 'test', region: 'bad-region-def-2' }).then((res) => {
    console.log('File uploaded', res);
}).catch((err) => {
  console.log('File upload error', err);
});
