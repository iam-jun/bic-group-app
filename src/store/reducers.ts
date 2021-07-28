import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';

import app from './app/reducer';
import modal from './modal/reducer';
import auth from '../screens/Auth/redux/reducer';
import chat from '../screens/Chat/redux/reducer';
import groupsReducer from '~/screens/Groups/redux/reducer';
import postReducer from '~/screens/Post/redux/reducer';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const rootReducers = combineReducers({
  app,
  modal,
  auth: persistReducer(authPersistConfig, auth),
  chat,
  post: postReducer,
  groups: groupsReducer,
});

export default rootReducers;
