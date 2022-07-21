module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '18.2.0',
    },
  },
  env: {
    jest: true,
  },
  globals: {
    __DEV__: true,
  },
  ignorePatterns: [
    '*.test.*',
    '**/e2e/*',
    '**/src/test/*',
    '*mock.*',
    '*.d.*',
    '**/src/services/chatSocket.ts',
    '**/src/screens/Menu/ComponentCollection/*',
    '**/src/beinComponents/MarkdownView/emoji/*',
    '**/src/beinComponents/Markdown/*',
  ],
  rules: {
    'eol-last': ['error', 'always'],
    'global-require': 0,
    'no-undefined': 0,
    'react/jsx-filename-extension': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'react/require-default-props': 0,
    'react/function-component-definition': 0,
    'react/jsx-props-no-spreading': 0,
    'no-restricted-globals': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'react/destructuring-assignment': 0,
    'no-extra-boolean-cast': 0,
    eqeqeq: 0,
    'react/no-array-index-key': 0,
    'no-nested-ternary': 0,
    'no-unused-vars': 'warn',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': ['error', { code: 150 }],
    semi: 0,
    'prefer-destructuring': ['error', {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: false,
      },
    }, {
      enforceForRenamedProperties: false,
    }],
    'react/no-unstable-nested-components': [
      'error',
      { allowAsProps: true },
    ],
    camelcase: [
      0,
      {
        properties: 'never',
      },
    ],
    'react/no-unused-prop-types': 1,
    'no-underscore-dangle': 0,
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': 0,

  },
  overrides: [
    {
      files: ['*.test.js', '*.test.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};
