import { Auth } from 'aws-amplify';
import { userApiConfig } from '~/api/UserApi';
import useAuthController from '~/screens/auth/store';
import { amplifyUser, authUser } from '~/test/mock_data/auth';
import { act, renderHook } from '~/test/testUtils';

describe('handleAuthEvent', () => {
  const data = { payload: { event: 'signIn' } } as any;

  it('should handle signIn saving auth user', () => {
    jest.useFakeTimers();

    const response = { data: { data: { id: 'test' } } };
    jest.spyOn(userApiConfig, 'getUserProfile').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const expectAuthUser = { ...authUser, userId: undefined };
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

    expect(result.current.authUser).toEqual(expectAuthUser);
  });
});
