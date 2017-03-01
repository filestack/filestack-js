import { expect } from 'chai';
import manifest from '../package.json';
import filestack from '..';

describe('version', () => {
  it('returns current version number', () => {
    expect(filestack.version).to.be.eql(manifest.version);
  });
});
