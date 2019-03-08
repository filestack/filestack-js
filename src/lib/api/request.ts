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

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as FormData from 'form-data';

/**
 *
 * @private
 * @param method
 * @param url
 */
const requestWithSource = (): AxiosInstance => {
  return axios.create({ headers: { 'Filestack-Source': 'JS-@{VERSION}' } });
};

/**
 * Make multipart POST request to given url with parsed form data
 *
 * @private
 * @param url - request url
 * @param fields - multipart fields (key->value)
 * @config Axios Config
 */
const multipart = (url: string, fields: Object, config: any = {}): Promise<AxiosResponse> => {
  const fd = new FormData();

  Object.keys(fields).forEach((key: string) => {
    let field = fields[key];

    if (field === undefined) {
      return;
    }

    if (typeof field === 'object') {
      field = JSON.stringify(field);
    }

    fd.append(key, field);
  });

  if (!config.headers) {
    config.headers = {};
  }

  config.headers = Object.assign(
    {},
    fd.getHeaders(),
    config.headers,
    { 'Filestack-Source': 'JS-@{VERSION}' }
  );

  return axios.post(url, fd, config);
};

export { axios as request, requestWithSource, multipart };
