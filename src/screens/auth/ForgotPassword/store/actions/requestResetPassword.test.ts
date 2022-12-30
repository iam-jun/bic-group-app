import { Auth } from 'aws-amplify';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import i18n from '~/localization';
import useModalStore from '~/store/modal';
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

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

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

    expect(showToast).toBeCalled();
    expect(result.current.errorRequest).toBe('');
    expect(result.current.loadingRequest).toBeFalsy();
  });

  it('should request forgot password throw error and should show toast when error code = limit exceeded exception', () => {
    const error = { code: authErrors.LIMIT_EXCEEDED_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

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

    expect(showToast).toBeCalledWith({
      content: i18n.t('auth:text_err_limit_exceeded'),
      type: ToastType.ERROR,
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
