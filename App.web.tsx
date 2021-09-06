import Amplify from 'aws-amplify';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import i18Next from '~/localization';

import Root from '~/Root';
import Store from '~/store';
import rootSaga from '~/store/sagas';
import awsconfig from './aws-exports';

i18Next.language;
i18Next.options.resources;

export default () => {
  useEffect(() => {
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
      },
    });
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
