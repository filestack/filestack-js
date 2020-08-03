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
import Debug from 'debug';
import { STORE_TYPE } from './store';

const debug = Debug('fs:storage');

export class Store {

  private availableTypes = [];

  constructor() {
    if (window.localStorage !== undefined) {
      this.availableTypes.push(STORE_TYPE.LOCAL);
      debug('Local storage exists');
    }

    if (window.sessionStorage !== undefined) {
      this.availableTypes.push(STORE_TYPE.SESSION);
      debug('Session storage exists');
    }

    debug('availableTypes - %O', this.availableTypes);
  }

  public hasAccess(prefType?: STORE_TYPE): boolean {
    debug('Checking access to storage for %s. Available types: %O', prefType, this.availableTypes);

    if (prefType) {
      return this.availableTypes.indexOf(prefType) > -1;
    }

    return !!this.availableTypes.length;
  }

  public getItem(key: string, prefType?: STORE_TYPE) {
    const store = this.getStore(prefType);
    debug('getItem %s from %O', key, store);

    if (!store) {
      return undefined;
    }

    return store.getItem(key);
  }

  public setItem(key: string, value: string, prefType?: STORE_TYPE) {
    const store = this.getStore(prefType);
    debug('setItem %s to %O', key, store);

    if (!store) {
      return undefined;
    }

    return store.setItem(key, value);
  }

  public removeItem(key: string, prefType?: STORE_TYPE) {
    const store = this.getStore(prefType);
    debug('removeItem %s from %O', key, store);

    if (!store) {
      return undefined;
    }

    return store.removeItem(key);
  }

  private getStore(prefType?: STORE_TYPE): false | Storage {
    debug('get store with pref type - %s', prefType);

    if (!this.hasAccess(prefType)) {
      debug('User dont have access to any storage');
      return undefined;
    }

    switch (prefType) {
      case STORE_TYPE.LOCAL:
        return window.localStorage;
      case STORE_TYPE.SESSION:
        return window.sessionStorage;
      default:
        // @ts-ignore
        return window[this.availableTypes[0]] as Storage;
    }
  }
}
