import realLoader from 'loader';

const uis = ENV.pickerUis;

export default (client, config = {}, moduleOverrides = {}) => {
  const loader = moduleOverrides.loader || realLoader;

  const pickerUi = config.ui || 'default';
  if (typeof pickerUi === 'string') {
    const pickerUrl = uis[pickerUi] || config.ui;
    return loader.loadModule(pickerUrl)
    .then((pickerConstructor) => {
      return pickerConstructor(client, config);
    });
  } else if (typeof pickerUi === 'function') {
    // Because loading scripts (in case above) is asynchronous, we also make
    // function call asynchronous to be consistent.
    return setTimeout(() => {
      return pickerUi(client, config);
    }, 0);
  }
  throw new Error(`"ui" parameter must be a function or one of strings: ${Object.keys(uis).toString()}`);
};
