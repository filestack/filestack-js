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
import { Validator } from 'jsonschema';
import { DefinitionsSchema } from './definitions.schema';

const v = new Validator();

Validator.prototype.customFormats.callback = (input) => typeof input === 'function';
// check if element have HTML in to string method ie HTMLDivElement
Validator.prototype.customFormats.HTMLContainer = (input) => typeof input === 'string' || (input.toString && input.toString().indexOf('HTML') > -1);

/**
 * Returns validator instance
 */
export const getValidator = (schema) => {
  return (params) => {
    v.addSchema(DefinitionsSchema);
    return v.validate(params, schema);
  };
};
