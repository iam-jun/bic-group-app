import React from 'react';

/*Store state Redux Saga */
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Amplify from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import storeInit from './src/store';
import Root from '~/Root';
import awsconfig from './aws-exports';
import {Linking} from 'react-native';

async function urlOpener(url: string, redirectUrl: string) {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

export default () => {
  Amplify.configure({
    ...awsconfig,
    oauth: {
      ...awsconfig.oauth,
      urlOpener,
    },
  });
  const {store, persistor} = storeInit();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};
