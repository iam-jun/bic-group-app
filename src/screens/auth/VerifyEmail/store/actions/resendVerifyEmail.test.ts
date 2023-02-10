import groupApi from '~/api/GroupApi';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';
import useVerifyEmailController from '../index';
import { authErrors } from '~/constants/authConstants';
import useModalStore from '~/store/modal';

describe('resendVerifyEmail', () => {
  it('should call api resend verify email success', () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };
    const spy = jest.spyOn(groupApi, 'resendVerificationEmail').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useVerifyEmailController((state) => state));
    act(() => {
      result.current.actions.resendVerifyEmail({ email: 'namanh@tgm.vn', redirectPage: 'login' });
    });

    expect(result.current.sentVerifyEmail).toBeFalsy();

    act(() => {
      jest.runAllTimers();
    });
    expect(spy).toBeCalled();
    expect(result.current.sentVerifyEmail).toBeTruthy();
  });

  it('should call call api resend verify email, throw error LimitExceededException', () => {
    const spyHideModal = jest.spyOn(modalActions, 'hideModal');
    const response = {
      code: authErrors.LIMIT_EXCEEDED_EXCEPTION,
      data: {},
    };
    const spy = jest.spyOn(groupApi, 'resendVerificationEmail').mockImplementation(
      () => Promise.reject(response) as any,
    );

    const showToast = jest.fn();
    const actions = { showToast };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useVerifyEmailController((state) => state));
    act(() => {
      result.current.actions.resendVerifyEmail({ email: 'namanh@tgm.vn', redirectPage: 'login' });
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spy).toBeCalled();
    expect(spyHideModal).toBeCalled();
    expect(showToast).toBeCalled();
  });

  it('should call call api resend verify email, throw error LimitExceededException', () => {
    const response = {
      code: 500,
      data: {},
    };
    const spy = jest.spyOn(groupApi, 'resendVerificationEmail').mockImplementation(
      () => Promise.reject(response) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useVerifyEmailController((state) => state));
    act(() => {
      result.current.actions.resendVerifyEmail({ email: 'namanh@tgm.vn', redirectPage: 'login' });
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spy).toBeCalled();
    expect(result.current.sentVerifyEmail).toBeTruthy();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
