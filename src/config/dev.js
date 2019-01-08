import baseConfig from './base';

const config = {
  appEnv: 'dev',
  enableDevTools: true,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
