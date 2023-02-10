import { Auth } from 'aws-amplify';
import useAuthController from '~/screens/auth/store';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';

describe('signIn', () => {
  it('should call auth amplify sign in success, keep loading', () => {
    Auth.signIn = jest.fn();
    const spyHideLoading = jest.spyOn(modalActions, 'hideLoading');

    jest.useFakeTimers();

    const { result } = renderHook(() => useAuthController((state) => state));
    act(() => {
      result.current.actions.signIn({ email: 'namanh@tgm.vn', password: '12345678' });
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.signIn).toBeCalled();
    expect(spyHideLoading).not.toBeCalled();
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
