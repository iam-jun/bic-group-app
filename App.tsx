/* eslint-disable no-unused-expressions */
import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import i18Next from '~/localization';
import Root from '~/Root';
import rootSaga from '~/store/sagas';
import Store from './src/store';
import initFatalErrorHandler from '~/services/fatalErrorHandler';
import { initFirebaseMessaging } from '~/services/firebase';
import { initAmplify } from '~/services/amplify';
import { initSentry, wrapWithSentry } from '~/services/sentry';

LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  "Warning: why-did-you-render couldn't handle circular references in props",
]);

i18Next.language;
i18Next.options.resources;

initSentry();
initFatalErrorHandler();

const App = () => {
  useEffect(() => {
    initAmplify();
    initFirebaseMessaging();
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

export default wrapWithSentry(App);
