const filestack = require('../');
const client = filestack.init(process.env.API_KEY);
const path = require('path');

client.upload(Buffer.from('testtest'), {}, { container: 'test', region: 'bad-region-def-2' }).then((res) => {
    console.log('File uploaded', res);
}).catch((err) => {
  console.log('File upload error', err);
});

// client.upload(path.resolve(__dirname, './test.jpg')).then((res) => {
//     console.log('File uploaded', res);
// }).catch((err) => {
//   console.log('File upload error', err);
// });
