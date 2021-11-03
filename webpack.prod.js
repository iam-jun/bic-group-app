// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appDirectory = path.resolve(__dirname);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({path: './.env.production'});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {merge} = require('webpack-merge');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js');

module.exports = merge(common('production'), {
  mode: 'production',
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
    }),
  ],
});
