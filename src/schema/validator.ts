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
import * as Ajv from 'ajv';
import { Definitions } from './definitions.schema';

let validator = Ajv;

// workaround for problem with exporting lib in browser
// @ts-ignore
if (Ajv.default) {
  // @ts-ignore
  validator = Ajv.default;
}

// use only one instance for validator
const instance = (new validator());
// add common definitions
instance.addSchema(Definitions);
/**
 * Returns validator instance
 */
export const getValidator = (schema) => {
  return instance.compile(schema);
};

/**
 * Converts object values to lower case
 * @param ob
 */
export const valuesToLowerCase = (ob: any): any => {
  if (typeof ob === 'string') {
    return ob.toLowerCase();
  }

  if (Array.isArray(ob)) {
    return ob.map(el => {
      return valuesToLowerCase(el);
    });
  }

  if (ob === Object(ob)) {
    for (let i in ob) {
      ob[i] = valuesToLowerCase(ob[i]);
    }

    return ob;
  }

  return ob;
};
