module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.web.js',
          '.ios.tsx',
          '.android.tsx',
          '.web.tsx',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.ttf',
        ],
        alias: {
          tests: ['./tests'],
          '~': './src',
        },
      },
    ],
  ],
};
