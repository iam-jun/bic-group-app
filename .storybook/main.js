module.exports = {
  stories: [ '../src/bicComponents/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-react-native-web",
  ],
  framework: "@storybook/react",
};