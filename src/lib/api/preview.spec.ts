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

import * as assert from 'assert';
import * as sinon from 'sinon';
import { preview } from './preview';

declare var ENV: any;

const session = ENV.session;
const secureSession = ENV.secureSession;
const filelink = ENV.filelink;

describe('preview', () => {
  let appendChildSpy: sinon.SinonSpy;
  let createElementSpy: sinon.SinonStub;
  let documentSpy: sinon.SinonStub;
  let windowOpenSpy: sinon.SinonStub;

  beforeEach(() => {
    appendChildSpy = sinon.spy();
    createElementSpy = sinon.stub(document, 'createElement').returns({});
    documentSpy = sinon.stub(document, 'getElementById').returns({
      appendChild: appendChildSpy,
    });
    windowOpenSpy = sinon.stub(window, 'open');
  });

  afterEach(() => {
    createElementSpy.restore();
    windowOpenSpy.restore();
    documentSpy.restore();
  });

  it('should throw exception when handle is not provided', () => {
    assert.throws(() => preview(session));
  });

  it('should open window when no id specified', () => {
    preview(session, filelink);
    assert.ok(windowOpenSpy.calledWith(`${session.urls.cdnUrl}/preview/${filelink}`, filelink));
  });

  it('should render to specified element', () => {
    preview(session, filelink, {
      id: 'someId',
    });

    assert.ok(createElementSpy.calledWith('iframe'));
    assert.ok(documentSpy.calledWith('someId'));
    assert.ok(appendChildSpy.calledWith({
      src: `${session.urls.cdnUrl}/preview/${filelink}`,
      width: '100%',
      height: '100%',
    }));
  });

  it('should throw error when element with given id is not found', () => {
    documentSpy.restore();
    documentSpy = sinon.stub(document, 'getElementById').returns(undefined);

    assert.throws(() => preview(session, filelink, {
      id: 'someId',
    }));
  });

  it('should add api key to url when storage alias is passed', () => {
    const link = 'src:test';
    preview(session, link);
    assert.ok(windowOpenSpy.calledWith(`${session.urls.cdnUrl}/${session.apikey}/preview/${link}`, link));
  });

  it('should work with security {signature, policy}', () => {
    preview(secureSession, filelink);
    const urlSecure = `security=policy:${secureSession.policy},signature:${secureSession.signature}`;
    assert.ok(windowOpenSpy.calledWith(`${session.urls.cdnUrl}/preview/${urlSecure}/${filelink}`, filelink));
  });
});
