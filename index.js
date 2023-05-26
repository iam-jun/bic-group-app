import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import './wdyr';

import App from './App';
import { name as appName } from './app.json';
import useNotificationStore from './src/screens/Notification/store';

// eslint-disable-next-line no-undef
if (__DEV__) {
  // eslint-disable-next-line no-console
  import('~/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  useNotificationStore.getState().actions.handleNotiBackground(remoteMessage);
});

messaging().subscribeToTopic('maintenance_channel')
  // eslint-disable-next-line no-console
  .then(() => console.log('Subscribed to topic maintenance_channel'))
  .catch((error) => {
    console.warn(
      'Subscribed topic error: ', error,
    );
  });

AppRegistry.registerComponent(
  appName, () => gestureHandlerRootHOC(App),
);

Object.defineProperty(
  exports, '__esModule', { value: true },
);
