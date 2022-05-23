import 'intl-pluralrules';
import messaging from '@react-native-firebase/messaging';
import Amplify from 'aws-amplify';
import React, {useEffect} from 'react';
import {Linking, LogBox} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import i18Next from '~/localization';

import Root from '~/Root';
import rootSaga from '~/store/sagas';
import awsconfig from './aws-exports';
import Store from './src/store';

LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  "Warning: why-did-you-render couldn't handle circular references in props",
]);

i18Next.language;
i18Next.options.resources;

async function urlOpener(url: string, redirectUrl: string) {
  await InAppBrowser.isAvailable();
  // @ts-ignore
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success' && newUrl) {
    Linking.openURL(newUrl);
  }
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function setupFirebasePermission() {
  try {
    await requestUserPermission();
  } catch (e) {
    console.log('setupFirebaseHandler failed:', e);
  }
}

export default () => {
  useEffect(() => {
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        urlOpener,
      },
    });
  }, []);

  useEffect(() => {
    setupFirebasePermission();
  }, []);

  Store.sagaMiddleware.run(rootSaga);

  return (
    <Provider store={Store.store}>
      <PersistGate loading={null} persistor={Store.persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};
