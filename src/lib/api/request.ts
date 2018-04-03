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

import * as agent from 'superagent';

/**
 * @private
 */
export interface CustomReq extends agent.SuperAgentStatic {
  [method: string]: any;
}

/**
 *
 * @private
 * @param method
 * @param url
 */
const requestWithSource = (method: string, url: string): CustomReq => {
  const newReq: CustomReq = agent;
  return newReq[method](url).set('Filestack-Source', 'JS-@{VERSION}');
};

/**
 * @private
 */
const request: agent.SuperAgentStatic = agent;

export { request, requestWithSource };
