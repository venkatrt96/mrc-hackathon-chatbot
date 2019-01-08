const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const config = require('../config');

const { host, port, keyPrefix } = config;
let client = {};

const ping = (redisClient) => {
  redisClient.ping()
    .then((msg) => {
      console.info(`->>>>>>>>>>>>> Me: PING! Redis: ${msg}!`);
    })
    .catch((err) => {
      console.error('############### Redis Error: ', err);
    });
  redisClient.on('error',
    (err) => {
      console.error('############### Redis Error: ', err);
    });
};

try {
  client = new Redis({
    host,
    port,
    keyPrefix,
  });
  ping(client);
} catch (e) {
  console.error('############### Error : ', e);
}

module.exports = {
  redis: {
    secret: "won't tell because it's secret",
    store: new RedisStore({ client }),
    resave: false,
    saveUninitialized: false,
    ttl: 3600,
  },
  client,
};
