const config = {
  host: 'localhost',
  port: '6379',
  keyPrefix: 'chatbot:',
  azureCredentials: {
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    redirectUrl: process.env.REDIRECT_URL,
    identityMetadata: 'https://login.microsoftonline.com/venkatrt96gmail.onmicrosoft.com/v2.0/.well-known/openid-configuration',
    allowHttpForRedirectUrl: true,
    responseType: 'code',
    validateIssuer: true,
    issuer: 'https://login.microsoftonline.com/b2c48289-1526-4864-9321-38c2fe0f7958/v2.0',
    responseMode: 'query',
    prompt: 'login',
    scope: ['User.Read', 'Directory.Read.All', 'offline_access'],
  },
  strategy: process.env.PASSPORT_STRATEGY,
};

module.exports = config;
