import 'core-js/fn/object/assign';
import api from './api';

const init = (apikey, config) => {
  return api(apikey, config);
};

export default {
  version: '@{VERSION}',
  init,
};
