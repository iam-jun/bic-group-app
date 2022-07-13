module.exports = {
  preset: 'react-native',
  testRunner: 'jest-circus/runner',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|rollbar-react-native|@fortawesome|@react-native|@react-navigation)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/components/**/*.{js,jsx,ts,tsx}',
    '!src/configs/**/*.{js,jsx,ts,tsx}',
    '!src/constants/**/*.{js,jsx,ts,tsx}',
    '!src/interfaces/**/*.{js,jsx,ts,tsx}',
    '!src/resources/**/*.{js,jsx,ts,tsx}',
    '!src/router/**/*.{js,jsx,ts,tsx}',
    '!src/theme/**/*.{js,jsx,ts,tsx}',
    '!src/beinComponents/Markdown/**/*.{js,jsx,ts,tsx}',
    '!src/beinComponents/MarkdownView/**/*.{js,jsx,ts,tsx}',
  ],
  setupFiles: ['<rootDir>/src/test/setup.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupAfterEnv.js'],
};
