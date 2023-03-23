import groupApi from '~/api/GroupApi';
import { IPayloadSignUp } from '~/interfaces/IAuth';
import useAuthController from '~/screens/auth/store';
import { responseSignUp } from '~/test/mock_data/auth';
import { act, renderHook } from '~/test/testUtils';

describe('signUp', () => {
  const payload: IPayloadSignUp = {
    referralCode: '123',
    email: 'test@gmail.com',
    fullName: 'Nguyen Van A',
    userName: 'abc.123',
    password: '12345678.Aa',
  };
  const callbackSuccess = jest.fn();
  const callbackError = jest.fn();

  it('should call api success', () => {
    const spy = jest.spyOn(groupApi, 'signUp').mockImplementation(() => Promise.resolve(responseSignUp) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.signUp(payload, callbackError, callbackSuccess);
    });
    expect(spy).toBeCalled();
    act(() => {
      jest.runAllTimers();
    });

    expect(callbackSuccess).toBeCalled();
  });

  it('should call api error', () => {
    const error = 'internal error';
    const spy = jest.spyOn(groupApi, 'signUp').mockImplementation(() => Promise.reject(error) as any);

    jest.useFakeTimers();
    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      try {
        result.current.actions.signUp(payload, callbackError, callbackSuccess);
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
