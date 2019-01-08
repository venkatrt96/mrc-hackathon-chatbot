import baseConfig from './base';

const config = {
  appEnv: 'production',
  enableDevTools: false,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
