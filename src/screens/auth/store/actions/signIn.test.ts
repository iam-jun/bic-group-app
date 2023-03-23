import { Auth } from 'aws-amplify';
import useAuthController from '~/screens/auth/store';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';

describe('signIn', () => {
  it('should call auth amplify sign in success, keep loading', () => {
    Auth.signIn = jest.fn();
    const setLoadingModal = jest.fn();
    const actions = { setLoadingModal };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.signIn({ email: 'namanh@tgm.vn', password: '12345678' });
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.signIn).toBeCalled();
    expect(setLoadingModal).not.toBeCalled();
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
