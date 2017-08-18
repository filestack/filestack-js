import apiClient from 'api-client';
import loader from 'loader';

const init = (apikey, security, cname) => {
  const client = apiClient.init(apikey, security, cname);
  return {
    getSecurity() {
      return client.getSecurity();
    },
    setSecurity(sec) {
      return client.setSecurity(sec);
    },
    pick(options) {
      return loader.loadModule(ENV.picker)
        .then((pickerConstructor) => {
          return pickerConstructor(client, options);
        });
    },
    storeURL(url, options) {
      return client.storeURL(url, options);
    },
    transform(url, options) {
      return client.transform(url, options);
    },
    upload(file, uploadOptions, storeOptions, token) {
      return client.upload(file, uploadOptions, storeOptions, token);
    },
    retrieve(handle, options) {
      return client.retrieve(handle, options);
    },
    remove(handle) {
      return client.remove(handle);
    },
    metadata(handle, options) {
      return client.metadata(handle, options);
    },
  };
};

export default {
  version: '@{VERSION}',
  init,
};
