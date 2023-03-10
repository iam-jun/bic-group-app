import groupApi from '~/api/GroupApi';
import { IVerifyEmail } from '~/interfaces/IAuth';
import useAuthController from '~/screens/auth/store';
import { responseResendVerifyEmail } from '~/test/mock_data/auth';
import { act, renderHook } from '~/test/testUtils';

describe('resendVerifyEmail', () => {
  const payload: IVerifyEmail = {
    email: 'test@gmail.com',
    redirectPage: 'login',
  };
  const callbackSuccess = jest.fn();
  const callbackError = jest.fn();

  it('should call api success', () => {
    const spy = jest
      .spyOn(groupApi, 'resendVerificationEmail')
      .mockImplementation(() => Promise.resolve(responseResendVerifyEmail) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.resendVerifyEmail(payload, callbackError, callbackSuccess);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(callbackSuccess).toBeCalled();
  });

  it('should call api error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'resendVerificationEmail').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      try {
        result.current.actions.resendVerifyEmail(payload, callbackError, callbackSuccess);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e).toBe(error);
      }
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(callbackError).toBeCalled();
  });
});
