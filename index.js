// eslint-disable-next-line no-undef
if (__DEV__) {
  import('~/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));

Object.defineProperty(exports, '__esModule', {value: true});
