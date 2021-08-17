import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth/lib/types/Auth';
import {Auth} from 'aws-amplify';
import i18n from 'i18next';
import {Platform} from 'react-native';
import {put, takeLatest} from 'redux-saga/effects';

import {authStack} from '~/configs/navigator';
import {authErrors, forgotPasswordStages} from '~/constants/authConstants';
import * as IAuth from '~/interfaces/IAuth';
import {IUserResponse} from '~/interfaces/IAuth';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {rootSwitch} from '~/router/stack';
import {refreshAuthTokens} from '~/services/httpApiRequest';
import * as appActions from '~/store/app/actions';
import * as modalActions from '~/store/modal/actions';
import * as actionsCommon from '~/store/modal/actions';
import {ActionTypes} from '~/utils';
import * as actions from './actions';
import * as types from './types';

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

function* signIn({payload}: {type: string; payload: IAuth.ISignIn}) {
  try {
    yield put(actions.setLoading(true));
    yield put(actions.setSigningInError(''));
    const {email, password} = payload;
    yield Auth.signIn(email, password); //handle result in useAuthHub
  } catch (error) {
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
    const {oldPassword, newPassword, global} = payload;
    const user = yield Auth.currentAuthenticatedUser();
    const data = yield Auth.changePassword(user, oldPassword, newPassword);
    if (data === 'SUCCESS' && global) {
      yield Auth.signOut({global});
    }
    navigation.goBack();
    yield put(
      modalActions.showAlert({
        title: i18n.t('auth:text_change_password_success_title'),
        content: i18n.t('auth:text_change_password_success_desc'),
        onConfirm: () => put(modalActions.hideAlert()),
        confirmLabel: i18n.t(
          'auth:text_change_password_success_confirm_button',
        ),
      }),
    );
  } catch (error) {
    navigation.goBack();
    yield put(
      modalActions.showAlert({
        title: i18n.t('error:alert_title'),
        content: error.code || error.message,
        onConfirm: () => put(modalActions.hideAlert()),
        confirmLabel: i18n.t('error:button_confirm'),
      }),
    );
    console.log('changePassword error:', error);
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
  yield onSignInSuccess(payload);
}

function* onSignInSuccess(user: IUserResponse) {
  yield put(actions.setLoading(false));

  const name =
    user?.attributes?.name?.length < 50
      ? user?.attributes?.name
      : user?.attributes?.email?.match?.(/^([^@]*)@/)[1];

  const userResponse: IUserResponse = {
    username: user?.username || '',
    signInUserSession: user?.signInUserSession || {},
    attributes: user?.attributes || {},
    name: name || '',
    email: user?.attributes?.email || '',

    _id: user?.username,
    id: user?.username,
    role: user?.username,
  };

  yield put(actions.setUser(userResponse));
  navigation.replace(rootSwitch.mainStack);

  // get Tokens after login success.
  const refreshSuccess = yield refreshAuthTokens();
  if (!refreshSuccess) {
    console.log('TODO: get auth tokens failed');
    yield onSignInFailed(i18n.t('error:http:token_expired'));
    return;
  }

  // setup push token
  if (Platform.OS === 'web') {
    return;
  }
  yield put(appActions.setupPushToken());
}

function* onSignInFailed(errorMessage: string) {
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

    yield put(
      actionsCommon.showAlert({
        title: i18n.t('common:text_error'),
        content: err.message,
      }),
    );
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
  } catch (error) {
    let errBox: string;
    const errRequest = '';
    switch (error.code) {
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        errBox = i18n.t('auth:text_err_limit_exceeded');
        break;
      default:
        errBox = error.message;
    }

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
  } catch (error) {
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
    yield put(actions.setForgotPasswordLoading(false));
  }
}

function* signOut() {
  try {
    yield Auth.signOut();

    navigation.replace(rootSwitch.authStack);
  } catch (err) {
    yield put(
      actionsCommon.showAlert({
        title: i18n.t('common:text_error'),
        content: err.message,
      }),
    );
  }
}
