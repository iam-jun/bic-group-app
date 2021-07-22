// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = path.resolve(__dirname);
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
  '@react-native-async-storage/async-storage',
  'amazon-cognito-identity-js',
  'aws-amplify',
  'react-hook-form',
  'react-native-fast-image',
  'react-native-linear-gradient',
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

const compileRNNodeModules = ['react-native-gifted-chat'].map(moduleName =>
  path.resolve(appDirectory, `node_modules/${moduleName}`),
);

const rnModulesLoaderConfiguration = {
  test: /@?.*\.(ts|js)x?$/,
  include: [...compileRNNodeModules],
  use: {
    loader: 'babel-loader',
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
  devServer: {
    historyApiFallback: true,
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
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      rnModulesLoaderConfiguration,
      // TODO: Remove the below rule for .mjs, once aws-amplify supports webpack 5
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/public/index.html'),
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
