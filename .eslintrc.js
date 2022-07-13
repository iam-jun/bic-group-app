/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native-community/eslint-config',
    'airbnb',
    'airbnb/hooks',
    // 'prettier',
    // 'prettier/react',
    // 'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': 1,
    'no-extra-boolean-cast': 0,
    'arrow-body-style': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-destructuring': [
      'error', {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: true,
        },
      }, {
        enforceForRenamedProperties: false,
      },
    ],
    'object-curly-spacing': 'error',
    'no-new-object': 'error',
    'object-shorthand': 'error',
    'no-prototype-builtins': 'error',
    'no-array-constructor': 'error',
    'array-callback-return': 'error',
    'no-shadow': 'off',
    quotes: ['error', 'single'],
    camelcase: [
      0,
      {
        properties: 'never',
      },
    ],
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'off',
    // 'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'error',
    'react-native/no-single-element-style-arrays': 'warn',
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    '@typescript-eslint/ban-ts-comment': 'off',
    // "@typescript-eslint/no-explicit-any": "off",
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/member-delimiter-style': 2,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },

      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },

      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
  },
};
