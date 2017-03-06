import 'core-js/fn/object/assign';
import api from './api';

const init = (apikey, security) => {
  return api(apikey, security);
};

export default {
  version: '@{VERSION}',
  init,
};
