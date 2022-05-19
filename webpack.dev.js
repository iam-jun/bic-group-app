// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
const appDirectory = path.resolve(__dirname);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {presets} = require(`${appDirectory}/babel.config.js`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({path: './.env'});

const compileNodeModules = [
  // '@unimodules/react-native-adapter',
  '@react-native-async-storage/async-storage',
  '@aws-amplify',
  '@aws-crypto',
  '@aws-sdk',
  'zen-observable-ts',
  'immer',
  'html-parse-stringify',
  '@callstack',
  'jwt-decode',
  '@react-navigation',
  'rn-placeholder',
  '@expo',
  'react-native-action-sheet',
  'react-native-device-info',
  'react-native-uuid',
  'react-native-tab-view',
  'sockjs-client',
  '@egjs',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.js$|tsx?$|.ttf$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    path.resolve(__dirname, 'App.web.tsx'), // Change this to your main App file
    path.resolve(__dirname, 'src'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web'],
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {merge} = require('webpack-merge');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js');

module.exports = merge(common(), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: 8088,
  },
  output: {
    publicPath: 'http://localhost:8088/',
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [babelLoaderConfiguration],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],
});
