import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import './wdyr';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

import App from './App';
import {name as appName} from './app.json';

// eslint-disable-next-line no-undef
if (__DEV__) {
  import('~/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
Object.defineProperty(exports, '__esModule', {value: true});
