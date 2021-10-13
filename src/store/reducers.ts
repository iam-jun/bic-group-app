import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import * as types from '~/screens/Auth/redux/types';
import groupsReducer from '~/screens/Groups/redux/reducer';
import homeReducer from '~/screens/Home/redux/reducer';
import menuReducer from '~/screens/Menu/redux/reducer';
import notificationsReducer from '~/screens/Notification/redux/reducer';
import postReducer from '~/screens/Post/redux/reducer';
import {initPushTokenMessage} from '~/services/helper';
import {makeRemovePushTokenRequest} from '~/services/httpApiRequest';

import {ActionTypes} from '~/utils';
import auth from '../screens/Auth/redux/reducer';
import chat from '../screens/Chat/redux/reducer';

import app from './app/reducer';
import modal from './modal/reducer';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['loading'],
};

const appReducer = combineReducers({
  app,
  modal,
  auth: persistReducer(authPersistConfig, auth),
  chat,
  post: postReducer,
  groups: groupsReducer,
  home: homeReducer,
  notifications: notificationsReducer,
  menu: menuReducer,
});

// @ts-ignore
const rootReducers = (state, action) => {
  if (
    action.type === types.SIGN_OUT ||
    action.type === ActionTypes.UnauthorizedLogout
  ) {
    makeRemovePushTokenRequest(
      state?.auth?.user?.signInUserSession.idToken.jwtToken,
      state?.auth?.chat?.accessToken,
      state?.auth?.chat?.userId,
    ).catch(e => console.log('error when call api logout', e));
    if (Platform.OS !== 'web') {
      initPushTokenMessage()
        .then(messaging => {
          messaging().deleteToken();
        })
        .catch(e => console.log('error when delete token', e));
    }
    AsyncStorage.multiRemove(['persist:root', 'persist:auth']).catch(e =>
      console.log('error when logout', e),
    );
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducers;
