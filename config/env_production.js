const DEFAULT_CNAME = 'filestackapi.com';
const PICKER_VERSION = '0.12.6';

const envGetter = (cname) => {
  return {
    picker: `https://static.${cname || DEFAULT_CNAME}/picker/v3/picker-${PICKER_VERSION}.js`,
  };
};

export default envGetter;
