/*
 * Copyright (c) 2018 by Filestack
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
import { RequestOptions } from './types';
import { AdapterAbstract } from './adapter';

export const dispatch = (config: RequestOptions, adapter: AdapterAbstract) => {
  config.headers = config.headers || {};

  // Flatten headers
  config.headers = Object.assign({}, config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

  ['delete', 'get', 'purge', 'head', 'post', 'put', 'patch', 'common'].forEach((method) => delete config.headers[method]);

  // @todo handle filestack headers

  console.log(config);
  // return adapter(config).then(
  //   function onAdapterResolution(response) {
  //     throwIfCancellationRequested(config);

  //     // Transform response data
  //     response.data = transformData(response.data, response.headers, config.transformResponse);

  //     return response;
  //   },
  //   function onAdapterRejection(reason) {
  //     if (!isCancel(reason)) {
  //       throwIfCancellationRequested(config);

  //       // Transform response data
  //       if (reason && reason.response) {
  //         reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
  //       }
  //     }

  //     return Promise.reject(reason);
  //   }
  // );

  return adapter.request(config).then((response) => {
    // @todo return reject if cancel requested

    return response;
  }, (reason) => {

    return Promise.reject(reason);
  });
};
