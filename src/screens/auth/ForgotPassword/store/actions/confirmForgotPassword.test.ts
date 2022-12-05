import { Auth } from 'aws-amplify';
import { authErrors, forgotPasswordStages } from '~/constants/authConstants';
import i18n from '~/localization';
import modalActions from '~/storeRedux/modal/actions';
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

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

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

    expect(spyModalActions).toBeCalled();
    expect(result.current.errorConfirm).toBe('');
    expect(result.current.loadingConfirm).toBeFalsy();
  });

  it('should confirm forgot password throw error and should show toast when error code = limit exceeded exception', () => {
    const error = { code: authErrors.LIMIT_EXCEEDED_EXCEPTION, message: 'error' };
    const spy = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.reject(error),
    );

    const spyModalActions = jest.spyOn(modalActions, 'showHideToastMessage');

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

    expect(spyModalActions).toBeCalledWith({
      content: i18n.t('auth:text_err_limit_exceeded'),
      props: { type: 'error' },
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
