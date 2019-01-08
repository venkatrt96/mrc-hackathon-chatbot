/* eslint no-console:0 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), config.devServer)
  .listen(8100, '0.0.0.0', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:8100');
    console.log('Opening your system browser...');
  });
