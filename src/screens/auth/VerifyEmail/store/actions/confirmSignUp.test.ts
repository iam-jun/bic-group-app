import { Auth } from 'aws-amplify';
import { act, renderHook } from '~/test/testUtils';
import useVerifyEmailController from '../index';

describe('confirmSignUp function', () => {
  it('should call amplify confirm sign up in success', () => {
    Auth.confirmSignUp = jest.fn();

    jest.useFakeTimers();

    const { result } = renderHook(() => useVerifyEmailController((state) => state));
    act(() => {
      result.current.actions.confirmSignUp('namanh@tgm.vn', '12345678');
    });

    expect(result.current.linkIsExpired).toBeFalsy();
    expect(result.current.loadingConfirmSiginUp).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();
    expect(result.current.loadingConfirmSiginUp).toBeFalsy();
  });

  it('should call amplify confirm sign up error, call prop callbackError', () => {
    Auth.confirmSignUp = jest.fn().mockImplementation(() => new Promise((_resolve, reject) => {
      reject({
        name: 'NotAuthorizedException',
        code: 'NotAuthorizedException',
      });
    }));
    jest.useFakeTimers();

    const { result } = renderHook(() => useVerifyEmailController((state) => state));

    act(() => {
      result.current.actions.confirmSignUp('namanh@tgm.vn', '12345678');
    });

    expect(result.current.linkIsExpired).toBeFalsy();
    expect(result.current.loadingConfirmSiginUp).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();
    expect(result.current.linkIsExpired).toBeTruthy();
    expect(result.current.loadingConfirmSiginUp).toBeFalsy();
  });
});
