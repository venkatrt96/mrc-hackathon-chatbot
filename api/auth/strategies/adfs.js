const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const { azureCredentials } = require('../../config');

module.exports = (verifyFunction) => {
  return new OIDCStrategy(azureCredentials, verifyFunction);
};
