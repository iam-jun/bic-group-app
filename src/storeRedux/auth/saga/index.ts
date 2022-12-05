// eslint-disable-next-line import/no-extraneous-dependencies
import { Auth } from 'aws-amplify';
import i18n from 'i18next';
import { put, takeLatest } from 'redux-saga/effects';
import { IObject } from '~/interfaces/common';
import * as IAuth from '~/interfaces/IAuth';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { rootSwitch } from '~/router/stack';
import {
  getUserFromSharedPreferences,
  isAppInstalled,
  saveUserToSharedPreferences,
} from '~/services/sharePreferences';
import modalActions, * as actionsCommon from '~/storeRedux/modal/actions';
import { ActionTypes } from '~/utils';
import actions from '../actions';
import types from '../types';
import signIn from './signIn';
import signInSuccess from './signInSuccess';
import showError from '~/storeRedux/commonSaga/showError';
import FileUploader from '~/services/fileUploader';
import ImageUploader from '~/services/imageUploader';
import authStacks from '~/router/navigator/AuthStack/stack';
import resetAllStores from '~/store/resetAllStores';

const navigation = withNavigation(rootNavigationRef);

export default function* authSaga() {
  yield takeLatest(
    types.SIGN_IN, signIn,
  );
  yield takeLatest(
    types.SIGN_UP, signUp,
  );
  yield takeLatest(
    [types.SIGN_OUT, ActionTypes.UnauthorizedLogout], signOut,
  );
  yield takeLatest(
    types.SIGN_IN_SUCCESS, signInSuccess,
  );
}

function* signUp({ payload }: {type: string; payload: IAuth.ISignUp}) {
  const { username, email, password } = payload;
  try {
    yield put(actions.setLoading(true));

    const response: IAuth.ISignUpResponse = yield Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name: username,
      },
    });
    if (response) {
      yield put(actions.setLoading(false));

      yield put(actionsCommon.showAlert({
        title: i18n.t('auth:text_title_success'),
        content: i18n.t('auth:text_sign_up_success'),
        onConfirm: () => navigation.navigate(authStacks.signIn),
      }));
    }
  } catch (err) {
    yield put(actions.setLoading(false));

    yield showError(err);
  }
}

function* signOut({ payload }: any) {
  try {
    yield put(modalActions.showLoading());
    yield Auth.signOut();
    // Check if chat auth session is still active
    const sessionData: IObject<any> = yield getUserFromSharedPreferences();
    const isInstalled = yield isAppInstalled();
    const activeSessions = sessionData?.activeSessions || {};

    /**
      * if BIC chat is installed and has active session
      *  just only remove chat session
      */
    if (isInstalled && activeSessions.chat) {
      delete activeSessions?.community;
      const data = {
        ...sessionData,
        activeSessions,
      };
      yield saveUserToSharedPreferences(data);
    } else {
      // clear all session
      yield saveUserToSharedPreferences(null);
    }
    FileUploader.getInstance()?.resetData?.();
    ImageUploader.getInstance()?.resetData?.();
    resetAllStores();
    yield put(modalActions.hideLoading());

    navigation.replace(rootSwitch.authStack);
  } catch (err) {
    yield showError(err);
    if (!payload) {
      return;
    }
    resetAllStores();
    navigation.replace(rootSwitch.authStack);
  }
}
