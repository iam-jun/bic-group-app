import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import ReactotronConfig from '~/ReactotronConfig';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    'modal',
    'groups',
    'post',
    'home',
    'noInternet',
    'chat',
    'giphy',
    'notifications',
  ],
  // whitelist: ['chat', 'language'],
};

let sagaMiddleware;
if (__DEV__) {
  const sagaMonitor = ReactotronConfig.createSagaMonitor();
  sagaMiddleware = createSagaMiddleware({ sagaMonitor });
} else {
  sagaMiddleware = createSagaMiddleware();
}

const persistedReducer = persistReducer(
  persistConfig, rootReducer,
);

const composeEnhancers = compose;
let enhancer;
if (__DEV__) {
  enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
    ReactotronConfig.createEnhancer(),
  );
} else {
  enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
}
const store = createStore(
  persistedReducer, enhancer,
);
const persistor = persistStore(store);

const storeRedux = {
  sagaMiddleware,
  store,
  persistor,
};

export default storeRedux;
