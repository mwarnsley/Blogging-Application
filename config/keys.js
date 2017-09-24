// This file will figure out which set of credentials we will use depending on the environment
/*
 * Checking to see if we are in a production environment or a development environment
 * If we are in production we will return the productions credentials/keys
 * Else we will return the DEV credentials and keys
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}
