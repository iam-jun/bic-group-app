// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function (api) {
  const presets = ['module:metro-react-native-babel-preset'];
  const plugins = [
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
  ];

  if (api.env('production')) {
    plugins.push(['transform-remove-console']);
    plugins.push(['react-native-paper/babel']);
  }

  return {
    presets,
    plugins,
  };
};
