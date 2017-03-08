import apiClient from 'api-client';
import logger from 'logger';
import picker from 'picker';

export default (apikey, security, moduleOverrides = {}) => {
  if (typeof apikey !== 'string') {
    throw new Error('No apikey specified');
  }

  if (security && !(security.policy && security.signature)) {
    throw new Error('signature and policy are both required for security');
  }

  const client = moduleOverrides.apiClient || apiClient.init(apikey, security);

  logger(`Initiated with apikey ${apikey}`);

  return {
    getSecurity() {
      return client.getSecurity();
    },
    setSecurity(sec) {
      return client.setSecurity(sec);
    },
    pick(options) {
      return picker(client, options);
    },
    storeURL(url, options) {
      return client.storeURL(url, options);
    },
    transform(url, options) {
      return client.transform(url, options);
    },
    upload(file, uploadOptions, storeOptions) {
      return client.upload(file, uploadOptions, storeOptions);
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
