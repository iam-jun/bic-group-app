import { Auth } from 'aws-amplify';
import { put } from 'redux-saga/effects';
import i18n from 'i18next';

import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import actions from '../actions';
import { showErrorWithDefinedMessage } from '.';
import * as IAuth from '~/interfaces/IAuth';

export default function* forgotPasswordConfirm({
  payload,
}: {
  type: string;
  payload: IAuth.IForgotPasswordConfirm;
}) {
  const { code, email, password } = payload;
  try {
    yield put(actions.setForgotPasswordError({
      errBox: '',
      errConfirm: '',
      errRequest: '',
    }));
    yield put(actions.setForgotPasswordLoading(true));

    yield Auth.forgotPasswordSubmit(
      email, code, password,
    );

    yield put(actions.setForgotPasswordLoading(false));
    yield put(actions.setForgotPasswordStage(forgotPasswordStages.COMPLETE));
  } catch (error: any) {
    let errBox = '';
    let errConfirm = '';
    switch (error.code) {
      case authErrors.CODE_MISMATCH_EXCEPTION:
        errConfirm = i18n.t('auth:text_err_wrong_code');
        break;
      case authErrors.LIMIT_EXCEEDED_EXCEPTION:
        errBox = i18n.t('auth:text_err_limit_exceeded');
        yield put(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
        break;
      default:
        errBox = error?.message || '';
    }

    yield put(actions.setForgotPasswordError({ errBox, errConfirm, errRequest: '' }));
    if (errBox) yield showErrorWithDefinedMessage(errBox);
    yield put(actions.setForgotPasswordLoading(false));
  }
}
