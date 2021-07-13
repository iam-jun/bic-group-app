import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import {applyMiddleware, compose, createStore} from 'redux'
import {persistReducer, persistStore} from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
// import Flatted from 'flatted'
// import immutableTransform from 'redux-persist-transform-immutable';
// import createTransform from 'redux-persist/es/createTransform'
import rootReducer from './reducers'

// export const transformCircular = createTransform(
//   (inboundState, key) => Flatted.stringify(inboundState),
//   (outboundState, key) => Flatted.parse(outboundState),
// )

const persistConfig = {
  key: 'root',
  // transforms: [immutableTransform()],
  // transforms: [transformCircular],
  storage: AsyncStorage,
  blacklist: ['auth', 'common', 'groups'],
  // whitelist: ['chat', 'language'],
}

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(persistConfig, rootReducer)

// @ts-ignore
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))
const store = createStore(persistedReducer, enhancer)
const persistor = persistStore(store)

const getCurrentUser = () => {
  const state = store.getState()
  return _.get(state, 'auth.user', null)
}

export default {
  sagaMiddleware,
  store,
  persistor,
  getCurrentUser,

}
