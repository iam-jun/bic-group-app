import { Auth } from 'aws-amplify';
import useAuthController from '~/screens/auth/store';
import modalActions from '~/storeRedux/modal/actions';
import { amplifyUser, authUser } from '~/test/mock_data/auth';
import { act, renderHook } from '~/test/testUtils';

describe('handleAuthEvent', () => {
  const data = { payload: { event: 'signIn' } } as any;

  it('should handle signIn saving auth user', () => {
    const spyShowLoading = jest.spyOn(modalActions, 'showLoading');
    const spyHideLoading = jest.spyOn(modalActions, 'hideLoading');
    jest.useFakeTimers();
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => new Promise((resolve, _reject) => {
      resolve(amplifyUser);
    }));
    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.handleAuthEvent(data);
    });

    expect(Auth.currentAuthenticatedUser).toBeCalledWith();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyShowLoading).toBeCalled();
    expect(spyHideLoading).toBeCalled();
    expect(result.current.authUser).toEqual(authUser);
  });
});
