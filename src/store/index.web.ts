import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import immutableTransform from 'redux-persist-transform-immutable';
import rootReducer from './reducers';
import rootSaga from './sagas';
import createTransform from 'redux-persist/es/createTransform';
import Flatted from 'flatted';

import ReactotronConfig from '../ReactotronConfig'

export const transformCircular = createTransform(
  (inboundState, key) => Flatted.stringify(inboundState),
  (outboundState, key) => Flatted.parse(outboundState),
);

const persistConfig = {
  key: 'root',
  // transforms: [immutableTransform()],
  transforms: [transformCircular],
  storage: AsyncStorage,
  // whitelist: ['chat', 'language'],
};

// const composeEnhancers = !!process.env.ENV ||process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const sagaMonitor = ReactotronConfig.createSagaMonitor()
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const enhancer = compose(applyMiddleware(sagaMiddleware), ReactotronConfig.createEnhancer());

  const store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return {store, persistor};
};
