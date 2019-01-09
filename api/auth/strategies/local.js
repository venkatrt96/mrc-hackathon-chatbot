const passport = require('passport');

const defaultUser = {
  body: {
    displayName: 'James Bond',
    userPrincipalName: 'mrcooper@007.com',
    groups: [{
      '@odata.type': '#microsoft.graph.group',
      displayName: 'CHATBOT-USER',
      mailEnabled: false,
      onPremisesSyncEnabled: null,
    }],
  },
};

class LocalStrategy extends passport.Strategy {
  constructor(options, verify) {
    super();
    this.name = 'local';
    this.passAuthentication = options.passAuthentication || true;
    this.user = options.user || defaultUser;
    this.verify = verify;
  }

  authenticate() {
    if (this.passAuthentication) {
      const user = this.user;
      this.verify(null, null, user, null, null, (err, resident) => {
        if (err) {
          this.fail(err);
        } else {
          this.success(resident);
        }
      });
    } else {
      this.fail('Unauthorized');
    }
  }
}

module.exports = verifyFunction => new LocalStrategy({}, verifyFunction);
