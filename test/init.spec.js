import { expect } from 'chai';
import filestack from '..';

describe('init', () => {
  const apikey = 'xyz';

  it('throws if no apikey passed', () => {
    expect(() => {
      filestack.init();
    }).to.throw('No apikey specified');
  });

  it('throws if security is invalid', () => {
    expect(() => {
      filestack.init('xyz', {});
    }).to.throw('signature and policy are both required for security');
  });

  it('returns filestack API instance', () => {
    const fst = filestack.init(apikey);
    expect(fst).to.be.object;
  });
});
