import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import {applyMiddleware, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {IUserResponse} from '~/interfaces/IAuth';
import ReactotronConfig from '~/ReactotronConfig';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['modal', 'groups', 'chat', 'post', 'home', 'noInternet'], // temporary block chat until it's stable
};

// @ts-ignore
let sagaMiddleware;
if (__DEV__) {
  const sagaMonitor = ReactotronConfig.createSagaMonitor();
  sagaMiddleware = createSagaMiddleware({sagaMonitor});
} else {
  sagaMiddleware = createSagaMiddleware();
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// @ts-ignore
// const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const composeEnhancers = compose;
// @ts-ignore
let enhancer;
if (__DEV__) {
  enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
    ReactotronConfig.createEnhancer(),
  );
} else {
  enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
}
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

const getCurrentUser = (): IUserResponse | boolean => {
  const state = store.getState();
  return _.get(state, 'auth.user', false);
};

const getCurrentAuth = (): unknown | boolean => {
  const state = store.getState();
  return _.get(state, 'auth', false);
};

export default {
  sagaMiddleware,
  store,
  persistor,
  getCurrentUser,
  getCurrentAuth,
};
