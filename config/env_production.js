const DEFAULT_CNAME = 'filestackapi.com';

const envGetter = (cname) => {
  return {
    picker: `https://static.${cname || DEFAULT_CNAME}/picker/v3/picker-0.12.3.js`,
  };
};

export default envGetter;
