import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { cleanup } from '@testing-library/react-native';
import { Auth } from 'aws-amplify';
import i18n from 'i18next';

import forgotPasswordRequest from './forgotPasswordRequest';
import actions from '../actions';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import * as actionsCommon from '~/store/modal/actions';

afterEach(cleanup);

describe('Forgot Password Request Saga', () => {
  it('should be set state for forgotPasswordStage successfully', () => {
    const action = {
      type: 'test',
      payload: 'thuquyen@tgm.vn',
    };
    return expectSaga(forgotPasswordRequest, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([[matchers.call.fn(Auth.forgotPassword), action.payload]])
      .put(actions.setForgotPasswordLoading(false))
      .put(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_CODE_PW))
      .run();
  });

  it('should be set state for forgotPasswordStage failure with LIMIT EXCEEDED EXCEPTION', () => {
    const action = {
      type: 'test',
      payload: '',
    };
    const toastMessage = {
      content: i18n.t('auth:text_err_limit_exceeded'),
      props: {
        textProps: { useI18n: true },
        type: 'error',
      },
    };

    const forgotPassword = jest.fn();

    jest.spyOn(Auth, 'forgotPassword').mockImplementation(() => Promise.reject({ code: authErrors.LIMIT_EXCEEDED_EXCEPTION }));

    return expectSaga(forgotPasswordRequest, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([
        [
          matchers.call.fn(forgotPassword),
          Promise.reject({ code: authErrors.LIMIT_EXCEEDED_EXCEPTION }),
        ],
      ])
      .put(actionsCommon.showHideToastMessage(toastMessage as any))
      .put(
        actions.setForgotPasswordError({
          errBox: i18n.t('auth:text_err_limit_exceeded'),
          errRequest: '',
          errConfirm: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(false))
      .run();
  });

  it('should be set state for forgotPasswordStage failure with error message', () => {
    const action = {
      type: 'test',
      payload: '',
    };
    const toastMessage = {
      content: 'ERROR!!!!',
      props: {
        textProps: { useI18n: true },
        type: 'error',
      },
    };

    const error = { code: 400, message: 'ERROR!!!!' };

    const forgotPassword = jest.fn();

    jest.spyOn(Auth, 'forgotPassword').mockImplementation(() => Promise.reject(error));

    return expectSaga(forgotPasswordRequest, action)
      .put(
        actions.setForgotPasswordError({
          errBox: '',
          errConfirm: '',
          errRequest: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(true))
      .provide([[matchers.call.fn(forgotPassword), Promise.reject(error)]])
      .put(actionsCommon.showHideToastMessage(toastMessage as any))
      .put(
        actions.setForgotPasswordError({
          errBox: 'ERROR!!!!',
          errRequest: '',
          errConfirm: '',
        }),
      )
      .put(actions.setForgotPasswordLoading(false))
      .run();
  });
});
