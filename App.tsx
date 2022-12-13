/* eslint-disable no-unused-expressions */
import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import CodePush from 'react-native-code-push';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import i18Next from '~/localization';
import Root from '~/Root';
import useCodePushStore from '~/store/codePush';
import rootSaga from '~/storeRedux/sagas';
import Store from './src/storeRedux';
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
  const codePushActions = useCodePushStore((state) => state.actions);

  useEffect(() => {
    initAmplify();
    initFirebaseMessaging();
    codePushActions?.getUpdateMetaData?.();
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

const AppWithSentry = wrapWithSentry(App);

const AppWithCodePush = CodePush({
  updateDialog: false,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
})(AppWithSentry);

export default AppWithCodePush;
