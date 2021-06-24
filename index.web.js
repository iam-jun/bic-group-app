import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import Amplify from "aws-amplify";
import awsconfig from "aws-exports";

if (module.hot) {
  module.hot.accept();
}

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
  },
});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});

Object.defineProperty(exports, '__esModule', {value: true});
