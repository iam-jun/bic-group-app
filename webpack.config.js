const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
  'react-native-gesture-handler',
  'react-dom',
  'react-native-lightbox',
  'react-native-typing-animation',
  'react-native-parsed-text',
  '@react-navigation/native',
  '@react-navigation/drawer',
  'redux',
  'react-redux',
  'redux-persist',
  'react-native-safe-area-context',
  '@react-navigation/stack',
  '@react-navigation/native',
  'react-native-screens',
  'react-native-paper',
  'react-native-vector-icons',
  '@unimodules/react-native-adapter',
  'i18next',
  'react-i18next',
  'react-native-reanimate',
  'react-native-image-picker',
  'react-native-vector-icons',
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

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

module.exports = {
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'web.bundle.js',
  },
  resolve: {
    extensions: [
      '.web.js',
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
    ],
    alias: {
      'react-native$': 'react-native-web',
      process: 'process/browser',
      tests: ['./tests'],
      '~': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
