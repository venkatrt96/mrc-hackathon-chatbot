const login = require('./login');
const api = require('./api');
const healthCheck = require('./healthCheck');
const chat = require('./chat');
const users = require('./users');
const dialogflow = require('./dialogflow');

exports.bind = (app) => {
  app.use('/', login);
  app.use('/api', api);
  app.use('/ping', healthCheck);
  app.use('/api/chat', chat);
  app.use('/api/users', users);
  app.use('/api/dialogflow', dialogflow);
};
