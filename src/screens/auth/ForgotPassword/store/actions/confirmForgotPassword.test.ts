import { Auth } from 'aws-amplify';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import i18n from '~/localization';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';
import useForgotPasswordStore from '../index';

describe('confirmForgotPassword', () => {
  const payload = { code: 'code', email: 'email', password: 'password' };

  it('should confirm forgot password success:', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spyRequestForgotPassword = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));
    act(() => {
      result.current.actions.confirmForgotPassword(payload);
    });

    expect(spyRequestForgotPassword).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.loadingConfirm).toBe(false);
    expect(result.current.screenCurrentStage).toBe(forgotPasswordStages.COMPLETE);
    expect(result.current.errorConfirm).toBe('');
  });

  it('should confirm forgot password throw error and should show toast', () => {
    const error = { message: 'ERRORRRRR!' };
    const spy = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.confirmForgotPassword(payload);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingConfirm).toBe(true);
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalled();
    expect(result.current.errorConfirm).toBe('');
    expect(result.current.loadingConfirm).toBeFalsy();
  });

  it('should confirm forgot password throw error and should show toast when error code = limit exceeded exception', () => {
    const error = { code: authErrors.LIMIT_EXCEEDED_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.reject(error),
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.confirmForgotPassword(payload);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingConfirm).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(showToast).toBeCalledWith({
      content: i18n.t('auth:text_err_limit_exceeded'),
      type: ToastType.ERROR,
    });
    expect(result.current.errorConfirm).toBe('');
    expect(result.current.screenCurrentStage).toBe(forgotPasswordStages.INPUT_ID);
    expect(result.current.loadingConfirm).toBeFalsy();
  });

  it('should confirm forgot password throw error when code is mismatch exception', () => {
    const error = { code: authErrors.CODE_MISMATCH_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.reject(error) as any,
    );

    jest.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordStore((state) => state));

    act(() => {
      try {
        result.current.actions.confirmForgotPassword(payload);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.loadingConfirm).toBeTruthy();
    expect(spy).toBeCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.errorConfirm).toBe(i18n.t('auth:text_err_wrong_code'));
    expect(result.current.loadingConfirm).toBeFalsy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
