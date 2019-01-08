const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const port = 8100;
const srcPath = path.join(__dirname, '/../src');
const publicPath = '/assets/';

module.exports = {
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    chunkFilename: '[name].js',
    publicPath,
  },
  devServer: {
    contentBase: './src/',
    hot: true,
    quiet: false,
    port,
    publicPath,
    proxy: [{
      context: ['/api', '/ping', '/login', '/logout', '/unauthorized', '/token', '/code'],
      target: 'http://localhost:3100',
    }],
    historyApiFallback: {
      rewrites: [
        { from: /\/$/, to: '/assets/index.html' },
      ],
    },
    index: 'index.html',
    noInfo: false,
  },
  resolve: {
    extensions: [
      '*',
      '.js',
      '.jsx',
    ],
    alias: {
      actions: `${srcPath}/actions/`,
      components: `${srcPath}/components/`,
      constants: `${srcPath}/constants/`,
      containers: `${srcPath}/containers/`,
      middlewares: `${srcPath}/middlewares/`,
      selectors: `${srcPath}/selectors/`,
      sources: `${srcPath}/sources/`,
      stores: `${srcPath}/stores/`,
      styles: `${srcPath}/styles/`,
      config: `${srcPath}/config/${process.env.NODE_ENV}`,
      helpers: `${srcPath}/helpers/`,
      utils: `${srcPath}/utils/`,
      reducers: `${srcPath}/reducers/`,
      images: `${srcPath}/images/`,
      common: `${srcPath}/components/common/`,
    },
  },
  optimization: {
    occurrenceOrder: true,
    concatenateModules: true,
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true,
        },
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
        default: false,
        bundle: {
          name: 'commons',
          chunks: 'all',
          minChunks: 3,
          reuseExistingChunk: true,
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader',
        exclude: `${srcPath}/components/*`,
      },
      {
        test: /\.pug/,
        include: `${srcPath}/views`,
        loader: 'pug-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.sass/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)(\?\S*)?$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          limit: 10 * 1024,
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          quality: 85,
          limit: 10 * 1024,
          name: '[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader',
      },
    ],
  },
};
