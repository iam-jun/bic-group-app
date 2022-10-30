import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import types from '~/storeRedux/auth/types';
import groupsReducer from '~/storeRedux/groups/reducer';
import homeReducer from '~/storeRedux/home/reducer';
import menuReducer from '~/storeRedux/menu/reducer';
import notificationsReducer from '~/storeRedux/notification/reducer';
import postReducer from '~/storeRedux/post/reducer';

import { makeRemovePushTokenRequest } from '~/api/apiRequest';
import { ActionTypes } from '~/utils';
import auth from './auth/reducer';
import noInternetReducer from './network/reducer';
import app from './app/reducer';
import modal from './modal/reducer';
import { initPushTokenMessage } from '~/services/firebase';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const notiPersistConfig = {
  key: 'notifications',
  storage: AsyncStorage,
  whitelist: ['pushToken'],
};

const postPersistConfig = {
  key: 'post',
  storage: AsyncStorage,
  whitelist: ['allPostContainingVideoInProgress'],
};

export const appReducer = combineReducers({
  app,
  modal,
  auth: persistReducer(
    authPersistConfig, auth,
  ),
  post: persistReducer(
    postPersistConfig, postReducer,
  ),
  groups: groupsReducer,
  home: homeReducer,
  notifications: persistReducer(
    notiPersistConfig, notificationsReducer,
  ),
  menu: menuReducer,
  noInternet: noInternetReducer,
});

const rootReducers = (
  state:any, action:{type:string, payload?:any},
) => {
  if (
    action.type === types.SIGN_OUT
    || action.type === ActionTypes.UnauthorizedLogout
  ) {
    if (state?.auth?.user) {
      makeRemovePushTokenRequest().catch((e) => console.error(
        'error when call api logout', e,
      ));
    }
    initPushTokenMessage()
      .then((messaging) => messaging().deleteToken())
      .catch((e) => console.error(
        'error when delete token', e,
      ));
    AsyncStorage.multiRemove([
      'persist:root',
      'persist:auth',
      'persist:notifications',
      'persist:post',
    ]).catch((e) => console.error(
      'error when logout', e,
    ));
    return appReducer(
      undefined, action,
    );
  }

  return appReducer(
    state, action,
  );
};

export default rootReducers;
