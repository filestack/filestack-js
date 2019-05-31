
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

import { Client } from './../src/lib/client';
import * as Path from 'path';
import { S3Uploader } from './../src/lib/api/upload/uploaders/s3';
import { getFile } from '../src/lib/api/upload';

const createFile = (size = 44320) => Buffer.alloc(size);

const fs = new Client('API_KEY', {
  cname: 'rc.filepickerapp.com',
});

// fs.multiupload(
//   [
//     {
//       file: Path.resolve(__dirname, './manual_10mb.mp4'),
//       name: 'test.mp4',
//     },
//   ],
//   {},
//   {
//     filename: () => 'test2.mp4',
//   }
// ).then(res => {
//   console.dir(res, { depth: null });
// });

try {
  fs.upload(createFile(), {}, {
    filename: 'HR-mary-oo',
    sanitizer: {
      exclude: ['m'],
      replacement: 'hrr',
    }
  }).then((res) => {
    console.info('Upload done!', res);
  });
} catch (e) {
  console.log(e.details);
}

// (async () => {
//   const file = await getFile(createFile());
//   const u = new S3Uploader({});
//   u.setUrl('https://upload.rc.filepickerapp.com');
//   u.setApikey('AbHASoTdORfqk8APJB72Wz');
//   u.addFile(file);

//   const res = await u.execute().catch((e) => {
//     console.log('ERROR', e);
//   });

//   console.log(res);
// })();
