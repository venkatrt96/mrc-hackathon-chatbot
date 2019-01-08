const passport = require('passport');
const isEqual = require('lodash/isEqual');
const fetch = require('../helpers/fetch');
const { strategy } = require('../config');
const strategies = require('./strategies');

const azureVerifyFuntion = (iss, sub, profile, accessToken, refreshToken, done) => {
  fetch().get('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((user) => {
    const id = user.userPrincipalName;
    const name = user.displayName;
    let groups = [];
    fetch().get('https://graph.microsoft.com/v1.0/me/memberOf/?$select=displayName,mailEnabled,onPremisesSyncEnabled', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((memberData) => {
      groups = memberData.value;
      done(null, {
        id,
        name,
        groups,
        accessToken,
        refreshToken,
      });
    })
      .catch(() => {
        done(null, {
          id,
          name,
          groups,
          accessToken,
          refreshToken,
        });
      });
  });
};

const localVerifyFunction = (iss, sub, profile, accessToken, refreshToken, done) => {
  const { body } = profile;
  const id = body.userPrincipalName;
  const name = body.displayName;
  const groups = body.groups;
  done(null, {
    id,
    name,
    groups,
    accessToken,
    refreshToken,
  });
};

strategies(isEqual(strategy, 'local') ? localVerifyFunction : azureVerifyFuntion);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.protected = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.auth = passport;
module.exports = passport;
