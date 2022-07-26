import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import mentionInputReducer from '~/beinComponents/inputs/MentionInput/redux/reducer';
import types from '~/screens/Auth/redux/types';
import groupsReducer from '~/screens/Groups/redux/reducer';
import homeReducer from '~/screens/Home/redux/reducer';
import menuReducer from '~/screens/Menu/redux/reducer';
import notificationsReducer from '~/screens/Notification/redux/reducer';
import postReducer from '~/screens/Post/redux/reducer';

import { makeRemovePushTokenRequest } from '~/services/httpApiRequest';
import { ActionTypes } from '~/utils';
import auth from '../screens/Auth/redux/reducer';
import noInternetReducer from '../screens/NoInternet/redux/reducer';
import app from './app/reducer';
import chatReducer from './chat/reducer';
import giphyReducer from './giphy/reducer';
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
  auth: persistReducer(authPersistConfig, auth),
  post: persistReducer(postPersistConfig, postReducer),
  groups: groupsReducer,
  home: homeReducer,
  notifications: persistReducer(notiPersistConfig, notificationsReducer),
  menu: menuReducer,
  noInternet: noInternetReducer,
  mentionInput: mentionInputReducer,
  chat: chatReducer,
  giphy: giphyReducer,
});

const rootReducers = (state:any, action:{type:string, payload?:any}) => {
  if (
    action.type === types.SIGN_OUT
    || action.type === ActionTypes.UnauthorizedLogout
  ) {
    if (state?.auth?.user) {
      makeRemovePushTokenRequest().catch((e) => console.error('error when call api logout', e));
    }
    initPushTokenMessage()
      .then((messaging) => messaging().deleteToken())
      .catch((e) => console.error('error when delete token', e));
    AsyncStorage.multiRemove([
      'persist:root',
      'persist:auth',
      'persist:notifications',
      'persist:post',
    ]).catch((e) => console.error('error when logout', e));
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducers;
