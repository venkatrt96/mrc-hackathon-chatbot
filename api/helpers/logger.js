const uuid = require('uuid/v4');
const winston = require('winston');
const expressWinston = require('express-winston');
const get = require('lodash/get');

const {
  combine, timestamp, label, printf, colorize, // eslint-disable-line
} = winston.format;
const myFormat = printf((info) => {
  return `${info.timestamp} - ${info.level}: ${get(info, 'res.res.statusCode')} ${info.message} 
    RESPONSE TIME: ${info.responseTime}
    LABEL: ${info.label}
    HEADERS: ${JSON.stringify(get(info, 'req.headers'))}`;
});
const winstonConsole = new winston.transports.Console({
  format: combine(
    colorize(),
    myFormat,
  ),
});

const logger = winston.createLogger({
  format: combine(
    label({ label: 'Winston Loggers' }),
    timestamp(),
  ),
  transports: [winstonConsole],
});
const requestWhitelist = ['url', 'headers', 'method', 'httpVersion',
  'originalUrl', 'query', 'referer', 'requestId', 'userId'];

exports.requestWhitelist = requestWhitelist;

exports.winston = (req, res, next) => {
  req.referer = req.get('referer');
  req.requestId = res ? res.get('x-request-id') : uuid();
  req.userId = get(req, ['user', 'nameID'], 'anonymous');
  next();
};

exports.express = expressWinston.logger({
  transports: [winstonConsole],
  meta: true,
  requestWhitelist,
  colorStatus: true,
});

exports.request = (message, req, res, start) => {
  const end = process.hrtime(start);
  const responseTime = Math.ceil(end[0] * (1000 + (end[1] / 1000000)));
  this.info(message, { res, req, responseTime });
};

exports.info = logger.info;
exports.debug = logger.debug;
