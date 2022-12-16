import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import groupsReducer from '~/storeRedux/groups/reducer';
import homeReducer from '~/storeRedux/home/reducer';
import menuReducer from '~/storeRedux/menu/reducer';
import postReducer from '~/storeRedux/post/reducer';

import noInternetReducer from './network/reducer';
import app from './app/reducer';
import modal from './modal/reducer';

const postPersistConfig = {
  key: 'post',
  storage: AsyncStorage,
  whitelist: ['allPostContainingVideoInProgress'],
};

export const appReducer = combineReducers({
  app,
  modal,
  post: persistReducer(
    postPersistConfig, postReducer,
  ),
  groups: groupsReducer,
  home: homeReducer,
  menu: menuReducer,
  noInternet: noInternetReducer,
});

const rootReducers = (
  state:any, action:{type:string, payload?:any},
) => appReducer(
  state, action,
);

export default rootReducers;
