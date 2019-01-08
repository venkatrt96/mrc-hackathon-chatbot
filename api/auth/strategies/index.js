const passport = require('passport');
const get = require('lodash/get');
const adfs = require('./adfs');
const config = require('../../config');
const local = require('./local');

const STRATEGIES = {
  local,
  'azuread-openidconnect': adfs,
};

module.exports = (verifyFunction) => {
  const strategy = get(STRATEGIES, config.strategy, adfs);
  passport.use(strategy(verifyFunction));
};
