/*
 * Copyright (c) 2019 by Filestack.
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
import { STORE_TYPE } from './store';

export class Store {
  public getItem(key: string, prefStore?: STORE_TYPE): string {
    console.warn('Storage is not supported');
    return undefined;
  }

  public setItem(key: string, value: string, prefStore?: STORE_TYPE) {
    console.warn('Storage is not supported');
    return undefined;
  }

  public removeItem(key: string, prefStore?: STORE_TYPE): string {
    console.warn('Storage is not supported');
    return undefined;
  }

  public hasAccess(prefType?: STORE_TYPE): boolean {
    console.warn('Storage is not supported');
    return undefined;
  }
}
