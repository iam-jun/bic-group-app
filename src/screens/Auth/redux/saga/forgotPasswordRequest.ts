import {put} from 'redux-saga/effects';
import i18n from 'i18next';
import {Auth} from 'aws-amplify';

import actions from '../actions';
import {authErrors, forgotPasswordStages} from '~/constants/authConstants';
import {showErrorWithDefinedMessage} from '.';

export default function* forgotPasswordRequest({
  payload,
}: {
  type: string;
  payload: string;
}) {
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
