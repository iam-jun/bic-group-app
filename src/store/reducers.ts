import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import types from '~/screens/Auth/redux/types';
import groupsReducer from '~/screens/Groups/redux/reducer';
import homeReducer from '~/screens/Home/redux/reducer';
import menuReducer from '~/screens/Menu/redux/reducer';
import notificationsReducer from '~/screens/Notification/redux/reducer';
import postReducer from '~/screens/Post/redux/reducer';
import {initPushTokenMessage} from '~/services/helper';
import {makeRemovePushTokenRequest} from '~/services/httpApiRequest';

import {ActionTypes} from '~/utils';
import {setChatAuthenticationInfo} from '~/utils/common';
import auth from '../screens/Auth/redux/reducer';
import noInternetReducer from '../screens/NoInternet/redux/reducer';
import mentionInputReducer from '~/beinComponents/inputs/MentionInput/redux/reducer';
import chatReducer from './chat/reducer';
import giphyReducer from './giphy/reducer';

import app from './app/reducer';
import modal from './modal/reducer';
import {clearUserCookies} from '~/utils/cookie';

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

export const appReducer = combineReducers({
  app,
  modal,
  auth: persistReducer(authPersistConfig, auth),
  post: postReducer,
  groups: groupsReducer,
  home: homeReducer,
  notifications: persistReducer(notiPersistConfig, notificationsReducer),
  menu: menuReducer,
  noInternet: noInternetReducer,
  mentionInput: mentionInputReducer,
  chat: chatReducer,
  giphy: giphyReducer,
});

// @ts-ignore
const rootReducers = (state, action) => {
  if (
    action.type === types.SIGN_OUT ||
    action.type === ActionTypes.UnauthorizedLogout
  ) {
    if (Platform.OS !== 'web') {
      if (state?.auth?.user) {
        makeRemovePushTokenRequest().catch(e =>
          console.log('error when call api logout', e),
        );
      }
      initPushTokenMessage()
        .then(messaging => {
          return messaging().deleteToken();
        })
        .catch(e => console.log('error when delete token', e));
    } else {
      /**
       * To clear all cookies in web browser
       */
      clearUserCookies();
      setChatAuthenticationInfo('', 0);
    }
    AsyncStorage.multiRemove([
      'persist:root',
      'persist:auth',
      'persist:notifications',
    ]).catch(e => console.log('error when logout', e));
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducers;
