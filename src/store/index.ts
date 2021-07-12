import {createStore, applyMiddleware, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {persistStore, persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Flatted from 'flatted'
import createTransform from 'redux-persist/es/createTransform'
import _ from 'lodash'

// import immutableTransform from 'redux-persist-transform-immutable';
import rootReducer from './reducers'
import rootSaga from './sagas'


export const transformCircular = createTransform(
  (inboundState, key) => Flatted.stringify(inboundState),
  (outboundState, key) => Flatted.parse(outboundState),
)

const persistConfig = {
  key: 'root',
  // transforms: [immutableTransform()],
  transforms: [transformCircular],
  storage: AsyncStorage,
  blacklist: ['auth', 'common'],
  // whitelist: ['chat', 'language'],
}

// const composeEnhancers = !!process.env.ENV ||process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(persistConfig, rootReducer)

const enhancer = compose(applyMiddleware(sagaMiddleware))
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
