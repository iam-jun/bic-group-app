import { Auth } from 'aws-amplify';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import i18n from '~/localization';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useForgotPasswordStore from '../index';

describe('requestResetPassword', () => {
  it('should do nothing if email is empty', () => {
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));
    act(() => {
      result.current.actions.requestResetPassword('');
    });

    expect(result.current.loadingRequest).not.toBe(true);
  });

  it('should request forgot password success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyRequestForgotPassword = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));
    act(() => {
      result.current.actions.requestResetPassword('email@tgm.vn');
    });

    expect(spyRequestForgotPassword).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingRequest).toBe(false);
    expect(result.current.screenCurrentStage).toBe(forgotPasswordStages.INPUT_CODE_PW);
    expect(result.current.errorRequest).toBe('');
  });

  it('should request forgot password throw error and should show toast', () => {
    const error = { message: 'ERRORRRRR!' };
    const spy = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.reject(error),
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.requestResetPassword('email@tgm.vn');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingRequest).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalled();
    expect(result.current.errorRequest).toBe('');
    expect(result.current.loadingRequest).toBeFalsy();
  });

  it('should request forgot password throw error and should show toast when error code = limit exceeded exception', () => {
    const error = { code: authErrors.LIMIT_EXCEEDED_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.reject(error),
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.requestResetPassword('email@tgm.vn');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingRequest).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyModalActions).toBeCalledWith({
      content: i18n.t('auth:text_err_limit_exceeded'),
      props: { type: 'error' },
    });
    expect(result.current.errorRequest).toBe('');
    expect(result.current.loadingRequest).toBeFalsy();
  });

  it('should request forgot password throw error when error code is user not found exception', () => {
    const error = { code: authErrors.USER_NOT_FOUND_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.requestResetPassword('email@tgm.vn');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingRequest).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.errorRequest).toBe(i18n.t('auth:text_forgot_password_email_not_found'));
    expect(result.current.loadingRequest).toBeFalsy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
