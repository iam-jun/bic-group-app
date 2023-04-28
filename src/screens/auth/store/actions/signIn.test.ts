import { Auth } from 'aws-amplify';
import useAuthController from '~/screens/auth/store';
import { act, renderHook } from '~/test/testUtils';

describe('signIn', () => {
  it('should call auth amplify sign in success, keep loading', () => {
    const callbackError = jest.fn();

    const spy = jest.spyOn(Auth, 'signIn').mockImplementation(
      () => Promise.resolve(true) as any,
    );

    jest.useFakeTimers();

    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.signIn({ email: 'namanh@tgm.vn', password: '12345678' }, callbackError);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(spy).toBeCalled();
  });

  it('should call auth amplify error, call prop callbackError', () => {
    const callbackError = jest.fn();
    Auth.signIn = jest.fn().mockImplementation(() => new Promise((_resolve, reject) => {
      reject({
        name: 'NotAuthorizedException',
        code: 'NotAuthorizedException',
      });
    }));
    jest.useFakeTimers();

    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.signIn({ email: 'namanh@tgm.vn', password: '12345678' }, callbackError);
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.signIn).toBeCalled();
    expect(callbackError).toBeCalled();
  });
});
