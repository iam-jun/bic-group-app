import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth/lib/types/Auth';
import {Auth} from 'aws-amplify';
import i18n from 'i18next';
import {Platform} from 'react-native';
import {delay, put, takeLatest} from 'redux-saga/effects';
import {authStack} from '~/configs/navigator';
import {authErrors, forgotPasswordStages} from '~/constants/authConstants';
import errorCode from '~/constants/errorCode';
import {IObject, IToastMessage} from '~/interfaces/common';
import * as IAuth from '~/interfaces/IAuth';
import {IUserResponse} from '~/interfaces/IAuth';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {rootSwitch} from '~/router/stack';
import notificationsActions from '~/screens/Notification/redux/actions';
import {initPushTokenMessage} from '~/services/helper';
import {refreshAuthTokens} from '~/services/httpApiRequest';
import {
  getUserFromSharedPreferences,
  saveUserToSharedPreferences,
} from '~/services/sharePreferences';
import * as actionsCommon from '~/store/modal/actions';
import * as modalActions from '~/store/modal/actions';
import {ActionTypes} from '~/utils';
import {clearUserCookies} from '~/utils/cookie';
import actions from './actions';
import types from './types';

const navigation = withNavigation(rootNavigationRef);

export default function* authSaga() {
  yield takeLatest(types.SIGN_IN, signIn);
  yield takeLatest(types.SIGN_IN_OAUTH, signInOAuth);
  yield takeLatest(types.SIGN_UP, signUp);
  yield takeLatest([types.SIGN_OUT, ActionTypes.UnauthorizedLogout], signOut);
  yield takeLatest(types.SIGN_IN_SUCCESS, signInSuccess);
  yield takeLatest(types.FORGOT_PASSWORD_REQUEST, forgotPasswordRequest);
  yield takeLatest(types.FORGOT_PASSWORD_CONFIRM, forgotPasswordConfirm);
  yield takeLatest(types.CHANGE_PASSWORD, changePassword);
}

function* signIn({payload}: {type: string; payload: IAuth.ISignIn}): any {
  try {
    yield put(actions.setLoading(true));
    yield put(actions.setSigningInError(''));
    // make sure to delete push token of older logged in acc in case delete token in AuthStack failed
    if (Platform.OS !== 'web') {
      const messaging = yield initPushTokenMessage();
      yield messaging()
        .deleteToken()
        .catch((e: any) => {
          console.log('error when delete push token before log in', e);
          return true;
        });
      put(notificationsActions.savePushToken(''));
    }
    const {email, password} = payload;
    yield Auth.signIn(email, password); //handle result in useAuthHub
  } catch (error: any) {
    let errorMessage;
    switch (error?.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
        errorMessage = i18n.t('auth:text_err_id_password_not_matched');
        break;
      default:
        errorMessage =
          error?.message || i18n.t('auth:text_err_id_password_not_matched');
    }
    yield onSignInFailed(errorMessage);
  }
}

function* changePassword({
  payload,
}: {
  type: string;
  payload: IAuth.IChangePasswordPayload;
}) {
  try {
    yield put(actions.setChangePasswordLoading(true));

    const {oldPassword, newPassword, global} = payload;
    const user: IObject<any> = yield Auth.currentAuthenticatedUser();
    const data: string = yield Auth.changePassword(
      user,
      oldPassword,
      newPassword,
    );
    if (data === 'SUCCESS' && global) {
      yield Auth.signOut({global});
    }
    yield put(actions.setChangePasswordLoading(false));

    navigation.goBack();
    const toastMessage: IToastMessage = {
      content: 'auth:text_change_password_success_desc',
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(actionsCommon.showHideToastMessage(toastMessage));
  } catch (error: any) {
    console.log('changePassword error:', error);
    let errCurrentPassword = '',
      errBox = '';
    switch (error.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
        errCurrentPassword = i18n.t('auth:text_err_wrong_current_password');
        break;
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        errBox = i18n.t('auth:text_err_limit_exceeded');
        break;
      default:
        errBox = error?.message || '';
    }
    yield put(actions.setChangePasswordLoading(false));
    yield put(actions.setChangePasswordError({errCurrentPassword, errBox}));
    yield showErrorWithDefinedMessage(errBox);
  }
}

function* signInOAuth({
  payload,
}: {
  type: string;
  payload: CognitoHostedUIIdentityProvider;
}) {
  try {
    yield put(actions.setLoading(true));
    yield Auth.federatedSignIn({provider: payload});
  } catch (e) {
    yield put(actions.setLoading(false));
    console.log(e);
  }
}

function* signInSuccess({payload}: {type: string; payload: IUserResponse}) {
  yield put(modalActions.showLoading());

  const name =
    payload?.attributes?.name?.length < 50
      ? payload?.attributes?.name
      : payload?.attributes?.email?.match?.(/^([^@]*)@/)[1];

  const userResponse: IUserResponse = {
    username: payload?.username || '',
    signInUserSession: payload?.signInUserSession || {},
    attributes: payload?.attributes || {},
    name: name || '',
    email: payload?.attributes?.email || '',

    id: payload?.username,
    role: payload?.username,
  };
  const sessionData: IObject<any> = yield getUserFromSharedPreferences();
  const activeSessions = sessionData?.activeSessions || [];
  //For sharing data between Group and Chat
  yield saveUserToSharedPreferences({
    username: userResponse.username,
    email: userResponse.email,
    name,
    token: userResponse.signInUserSession.idToken?.jwtToken,
    exp: userResponse.signInUserSession.idToken?.payload?.exp,
    activeSessions: [...activeSessions, 'community'],
  });

  yield put(actions.setUser(userResponse));

  // @ts-ignore
  const refreshSuccess = yield refreshAuthTokens();
  if (!refreshSuccess) {
    yield put(actions.signOut(false));
    yield onSignInFailed(i18n.t('error:http:unknown'));
    return;
  }

  navigation.replace(rootSwitch.mainStack);
  yield put(actions.setLoading(false));
  yield delay(500); // Delay to avoid showing authStack
  yield put(modalActions.hideLoading());
}

function* onSignInFailed(errorMessage: string) {
  yield put(modalActions.hideLoading());
  yield put(actions.setLoading(false));
  yield put(actions.setSigningInError(errorMessage));
}

function* signUp({payload}: {type: string; payload: IAuth.ISignUp}) {
  const {username, email, password} = payload;
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

      yield put(
        actionsCommon.showAlert({
          title: i18n.t('auth:text_title_success'),
          content: i18n.t('auth:text_sign_up_success'),
          onConfirm: () => navigation.navigate(authStack.login),
        }),
      );
    }
  } catch (err) {
    yield put(actions.setLoading(false));

    yield showError(err);
  }
}

function* forgotPasswordRequest({payload}: {type: string; payload: string}) {
  try {
    yield put(
      actions.setForgotPasswordError({
        errBox: '',
        errConfirm: '',
        errRequest: '',
      }),
    );
    yield put(actions.setForgotPasswordLoading(true));

    yield Auth.forgotPassword(payload);

    yield put(actions.setForgotPasswordLoading(false));
    yield put(
      actions.setForgotPasswordStage(forgotPasswordStages.INPUT_CODE_PW),
    );
  } catch (error: any) {
    let errBox: string;
    const errRequest = '';
    switch (error.code) {
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        errBox = i18n.t('auth:text_err_limit_exceeded');
        break;
      default:
        errBox = error.message;
    }

    yield showErrorWithDefinedMessage(errBox);
    yield put(
      actions.setForgotPasswordError({errBox, errRequest, errConfirm: ''}),
    );
    yield put(actions.setForgotPasswordLoading(false));
  }
}

function* forgotPasswordConfirm({
  payload,
}: {
  type: string;
  payload: IAuth.IForgotPasswordConfirm;
}) {
  const {code, email, password} = payload;
  try {
    yield put(
      actions.setForgotPasswordError({
        errBox: '',
        errConfirm: '',
        errRequest: '',
      }),
    );
    yield put(actions.setForgotPasswordLoading(true));

    yield Auth.forgotPasswordSubmit(email, code, password);

    yield put(actions.setForgotPasswordLoading(false));
    yield put(actions.setForgotPasswordStage(forgotPasswordStages.COMPLETE));
  } catch (error: any) {
    let errBox = '',
      errConfirm = '';
    switch (error.code) {
      case authErrors.CODE_MISMATCH_EXCEPTION:
        errConfirm = i18n.t('auth:text_err_wrong_code');
        break;
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        errBox = i18n.t('auth:text_err_limit_exceeded');
        yield put(
          actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID),
        );
        break;
      default:
        errBox = error?.message || '';
    }

    yield put(
      actions.setForgotPasswordError({errBox, errConfirm, errRequest: ''}),
    );
    if (errBox) yield showErrorWithDefinedMessage(errBox);
    yield put(actions.setForgotPasswordLoading(false));
  }
}

function* signOut({payload}: any) {
  try {
    if (payload) {
      navigation.replace(rootSwitch.authStack);
    }
    clearUserCookies();
    yield Auth.signOut();
    // Check if chat auth session is still active
    const sessionData: IObject<any> = yield getUserFromSharedPreferences();
    if ((sessionData?.activeSessions || []).length < 2) {
      yield saveUserToSharedPreferences(null);
    } else {
      const data = {
        ...sessionData,
        activeSessions: sessionData.activeSessions.filter(
          (item: string) => item !== 'community',
        ),
      };
      yield saveUserToSharedPreferences(data);
    }
  } catch (err) {
    yield showError(err);
    if (!payload) {
      return;
    }
    navigation.replace(rootSwitch.authStack);
  }
}

function* showError(err: any) {
  if (err.code === errorCode.systemIssue) return;

  const toastMessage: IToastMessage = {
    content:
      err?.meta?.message ||
      err?.meta?.errors?.[0]?.message ||
      'common:text_error_message',
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(actionsCommon.showHideToastMessage(toastMessage));
}

function* showErrorWithDefinedMessage(mess: string) {
  if (!mess) return;
  const toastMessage: IToastMessage = {
    content: mess,
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(actionsCommon.showHideToastMessage(toastMessage));
}
