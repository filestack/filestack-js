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

 /**
  * Save cookie in browser
  *
  * @param name
  * @param value
  * @param expires
  * @param path
  * @param domain
  * @param secure
  */
export const write = (name: string, value: string, expires?: number, path?: string, domain?: string, secure?: boolean) => {
  const cookie = [];
  cookie.push(name + '=' + encodeURIComponent(value));

  if (expires) {
    cookie.push('expires=' + new Date(expires).toUTCString());
  }

  if (path) {
    cookie.push('path=' + path);
  }

  if (domain) {
    cookie.push('domain=' + domain);
  }

  if (secure) {
    cookie.push('secure');
  }

  document.cookie = cookie.join('; ');
};

/**
 * Read cookie from browser with given name
 *
 * @param name
 */
export const read = (name: string) => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return (match ? decodeURIComponent(match[3]) : null);
};

/**
 * Clear cookie by name
 *
 * @param name
 */
export const remove = (name) => {
  write(name, '', Date.now() - 86400000);
};
