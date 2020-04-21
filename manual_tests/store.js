const client = require('./client').client;

client.storeURL('http://placehold.it/120x120&text=image4', {}, null, null, { test: '123' }).then((res) => {
  console.log('Url stored', res);
}).catch((err) => {
  console.log('Url store error', err);
});
