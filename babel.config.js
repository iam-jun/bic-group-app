// eslint-disable-next-line @typescript-eslint/no-unused-vars,func-names
module.exports = function (api) {
  const presets = ['babel-preset-expo'];
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.ios.tsx',
          '.android.tsx',
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
  }

  // Reanimated plugin has to be listed last
  plugins.push(['react-native-reanimated/plugin']);

  return {
    presets,
    plugins,
  };
};
