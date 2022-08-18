import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';
import { Auth } from 'aws-amplify';
import i18n from 'i18next';

import forgotPasswordConfirm from './forgotPasswordConfirm';
import actions from '../actions';
import { authErrors, forgotPasswordStages } from '../../../constants/authConstants';
import * as actionsCommon from '../../modal/actions';

afterEach(cleanup);

describe('Forgot Password Confirm Saga', () => {
  const action = {
    type: 'test',
    payload: { email: 'thuquyen@tgm.vn', code: '0000', password: '1234567890' },
  };

  it('should be set the state for forgotPasswordStage is COMPLETE successfully', () => expectSaga(forgotPasswordConfirm, action)
    .put(
      actions.setForgotPasswordError({
        errBox: '',
        errConfirm: '',
        errRequest: '',
      }),
    )
    .put(actions.setForgotPasswordLoading(true))
    .provide([
      [matchers.call.fn(Auth.forgotPasswordSubmit), { ...action.payload }],
    ])
    .put(actions.setForgotPasswordLoading(false))
    .put(actions.setForgotPasswordStage(forgotPasswordStages.COMPLETE))
    .run());

  it('should be set the state for forgotPasswordStage failure with CodeMismatchException error code', () => {
    const error = {
      code: authErrors.CODE_MISMATCH_EXCEPTION,
      message: 'ERROR!!!!',
    };

    const forgotPasswordSubmit = jest.fn();

    jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(() => Promise.reject(error));

    return expectSaga(forgotPasswordConfirm, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([
        [matchers.call.fn(forgotPasswordSubmit), Promise.reject(error)],
      ])
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errRequest: '',
          errConfirm: i18n.t('auth:text_err_wrong_code'),
        }),
      )
      .put(actions.setForgotPasswordLoading(false))
      .run();
  });

  it('should be set the state for forgotPasswordStage failure with LimitExceededException error code', () => {
    const error = {
      code: authErrors.LIMIT_EXCEEDED_EXCEPTION,
      message: 'ERROR!!!!',
    };

    const toastMessage = {
      content: i18n.t('auth:text_err_limit_exceeded'),
      props: {
        textProps: { useI18n: true },
        type: 'error',
      },
    };

    const forgotPasswordSubmit = jest.fn();

    jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(() => Promise.reject(error));

    return expectSaga(forgotPasswordConfirm, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([
        [matchers.call.fn(forgotPasswordSubmit), Promise.reject(error)],
      ])
      .put(
        actions.setForgotPasswordError({
          errBox: i18n.t('auth:text_err_limit_exceeded'),
          errRequest: '',
          errConfirm: '',
        }),
      )
      .put(actionsCommon.showHideToastMessage(toastMessage as any))
      .put(actions.setForgotPasswordLoading(false))
      .run();
  });

  it('should be set the state for forgotPasswordStage failure with other error code', () => {
    const error = {
      code: 400,
      message: 'ERROR!!!!',
    };

    const toastMessage = {
      content: 'ERROR!!!!',
      props: {
        textProps: { useI18n: true },
        type: 'error',
      },
    };

    const forgotPasswordSubmit = jest.fn();

    jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(() => Promise.reject(error));

    return expectSaga(forgotPasswordConfirm, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([
        [matchers.call.fn(forgotPasswordSubmit), Promise.reject(error)],
      ])
      .put(
        actions.setForgotPasswordError({
          errBox: 'ERROR!!!!',
          errRequest: '',
          errConfirm: '',
        }),
      )
      .put(actionsCommon.showHideToastMessage(toastMessage as any))
      .put(actions.setForgotPasswordLoading(false))
      .run();
  });
});
