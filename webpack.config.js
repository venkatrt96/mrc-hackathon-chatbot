const env = require('./env');

// List of allowed environments
const allowedEnvs = ['dev', 'test', 'ci', 'qa', 'uat', 'production'];

const base = require('./cfg/base');
const dev = require('./cfg/dev');
const production = require('./cfg/production');

// Get available configurations
const configs = {
  base,
  dev,
  production,
};

/**
 * Get an allowed environment
 * @param  {String}  env
 * @return {String}
 */
function getValidEnv() {
  const isValid = env && env.length > 0 && allowedEnvs.indexOf(env) !== -1;
  return isValid ? env : 'dev';
}

/**
 * Build the webpack configuration
 * @param  {String} env Environment to use
 * @return {Object} Webpack config
 */
function buildConfig() {
  const usedEnv = getValidEnv(env);
  return configs[usedEnv];
}

module.exports = buildConfig();
