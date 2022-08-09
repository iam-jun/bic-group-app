import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import './wdyr';

import App from './App';
import { name as appName } from './app.json';

// eslint-disable-next-line no-undef
if (__DEV__) {
  // eslint-disable-next-line no-console
  import('~/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(
  appName, () => gestureHandlerRootHOC(App),
);

Object.defineProperty(
  exports, '__esModule', { value: true },
);
