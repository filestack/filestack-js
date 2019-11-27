
/*
 * Copyright (c) 2018 by Filestack.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const nock = require('nock');
import { FsRequest } from './../src/lib/request/index';
import { FsToken } from './../src/lib/request/token';

const scope = nock('http://www.google.com')
  .get('/123')
  .delay(1000)
  .reply(200, '<html></html>');

const token = new FsToken();

setTimeout(() => {
  token.cancel();
}, 500);

FsRequest.get('http://www.google.com/123', {
  token: token,
}).then((resp) => {
  console.log('Catch request error:', resp);
}).catch((e) => {
  console.error('ERROR', e);
});

// const token = new Token();

// const promise = new Promise((resolve, reject) => {
//   const requestSimulation = setTimeout(() => {
//     console.log('fulfilled');
//   }, 1000);

//   token.getToken().then(() => {
//     clearTimeout(requestSimulation);
//     return reject(new Error('Canceleeed'));
//   });
// });

// promise.then(() => {
//   console.log('main promise resolved');
// }).catch(() => {
//   console.log('preomise rejected');
// });

// setTimeout(() => {
//   console.log('cancel called');
//   token.cancel();
// }, 200);
