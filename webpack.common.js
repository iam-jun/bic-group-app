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
  'redux',
  'react-redux',
  'redux-persist',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-paper',
  'i18next',
  'react-i18next',
  'react-native-reanimate',
  'react-native-image-picker',
  'amazon-cognito-identity-js',
  'aws-amplify',
  'react-hook-form',
  'react-native-fast-image',
  'react-native-vector-icons',
  'react-native-gifted-chat',
  'react-modal',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = env => {
  return {
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
        envName: env,
        plugins: ['react-native-web'],
      },
    },
  };
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
      options: {
        svgoConfig: {
          plugins: {
            removeViewBox: false,
          },
        },
      },
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = env => {
  return {
    entry: {
      app: path.join(__dirname, 'index.web.js'),
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
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
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
        babelLoaderConfiguration(env),
        imageLoaderConfiguration,
        svgLoaderConfiguration,
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
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
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
  };
};
