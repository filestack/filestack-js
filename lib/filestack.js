// -- <Polyfills> --
import 'es6-promise/auto';
import 'core-js/fn/object/assign';
// -- </Polyfills> --
import api from './api';

const init = (apikey, security) => {
  return api(apikey, security);
};

export default {
  version: '@{VERSION}',
  init,
};
