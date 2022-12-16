import useAuthController, { IAuthState } from '~/screens/auth/store';
import modalActions from '~/storeRedux/modal/actions';
import { act, renderHook } from '~/test/testUtils';

describe('announceSessionExpire', () => {
  it('should show alert session expire', () => {
    const spyShowAlert = jest.spyOn(
      modalActions,
      'showAlert',
    );

    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.announceSessionExpire();
    });
    expect(spyShowAlert).toBeCalled();
  });

  it('should not show alert session expire because of it is showing', () => {
    const spyShowAlert = jest.spyOn(
      modalActions,
      'showAlert',
    );

    useAuthController.setState((state: IAuthState) => {
      state.showingNoticeSession = true;
      return state;
    });

    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.announceSessionExpire();
    });
    expect(spyShowAlert).not.toBeCalled();
  });
});
