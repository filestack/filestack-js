
require('dotenv').config();
const filestack = require('../');

let options = {};

const signature = process.env.SIGNATURE || null;
const policy = process.env.POLICY || null;
const cname = process.env.CNAME || null;
const securityEnabled = process.env.SECURITY_ENABLED || (policy && signature)  || false;

console.info(`FILESTACK-JS VERSION::::::: ${filestack.version}`)

if (securityEnabled) {
  if (!signature || !policy) {
    throw new Error('Signature and Policy are always required')
  }

  options.security = {
    signature,
    policy
  };

  console.log(`SECURITY ENABLED!`);
}

if (cname) {
  options.cname = cname;
  console.info(`CNAME ENABLED - ${cname}`);
}

exports.client = filestack.init(process.env.API_KEY, options)
