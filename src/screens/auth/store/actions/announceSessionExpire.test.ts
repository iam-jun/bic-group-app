import useAuthController, { IAuthState } from '~/screens/auth/store';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';

describe('announceSessionExpire', () => {
  it('should show alert session expire', () => {
    const showAlert = jest.fn();
    const actions = { showAlert };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.announceSessionExpire();
    });
    expect(showAlert).toBeCalled();
  });

  it('should not show alert session expire because of it is showing', () => {
    const showAlert = jest.fn();
    const actions = { showAlert };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    useAuthController.setState((state: IAuthState) => {
      state.showingNoticeSession = true;
      return state;
    });

    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.announceSessionExpire();
    });
    expect(showAlert).not.toBeCalled();
  });
});
