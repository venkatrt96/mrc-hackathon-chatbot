const request = require('request');
const includes = require('lodash/includes');
const pick = require('lodash/pick');
const merge = require('lodash/merge');
const logger = require('./logger');

const scoutClientId = process.env.SCOUT_IBM_CLIENT_ID;
const scoutAuthHeader = process.env.SCOUT_GATEWAY_AUTH_STR;

function fetch(options) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const req = options;
    request(req, (err, response, body) => {
      const message = `REQUEST ${req.method} ${req.url}`;
      let statusCode;
      if (err) {
        statusCode = err.code === 'ECONNREFUSED' ? 503 : 500;
        const error = { status: statusCode, error: err };
        reject(error);
      } else if (!includes([200, 201, 204], response.statusCode)) {
        statusCode = response.statusCode; // eslint-disable-line
        const failure = { status: statusCode };
        reject(failure);
      } else {
        statusCode = response.statusCode; // eslint-disable-line
        resolve(body);
      }
      logger.request(message, pick(options, logger.requestWhitelist), { res: { statusCode } }, start);
    });
  });
}

const defaultHeaders = { headers: { 'X-IBM-Client-Id': scoutClientId, Authorization: scoutAuthHeader } };

module.exports = req => ({ // eslint-disable-line
  delete: (url, extraOptions) => {
    const options = merge({ method: 'DELETE', json: true, url, }, defaultHeaders, extraOptions); // eslint-disable-line
    return fetch(options);
  },
  get: (url, extraOptions) => {
    const options = merge({
      method: 'GET', json: true, url,
    }, defaultHeaders, extraOptions);
    return fetch(options);
  },
  post: (url, json, extraOptions) => {
    const options = merge({
      method: 'POST', json, url,
    }, defaultHeaders, extraOptions);
    return fetch(options);
  },
  put: (url, json, extraOptions) => {
    const options = merge({
      method: 'PUT', json, url,
    }, defaultHeaders, extraOptions);
    return fetch(options);
  },
});
