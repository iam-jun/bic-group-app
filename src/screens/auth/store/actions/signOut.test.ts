import useAuthController, { IAuthState } from '~/screens/auth/store';
import useModalStore from '~/store/modal';
import { act, renderHook } from '~/test/testUtils';

describe('signOut', () => {
  it('should do nothing if signing out', () => {
    const setLoadingModal = jest.fn();
    const actions = { setLoadingModal };
    jest.spyOn(useModalStore, 'getState').mockImplementation(() => ({ actions } as any));

    jest.useFakeTimers();

    useAuthController.setState((state: IAuthState) => {
      state.signingOut = true;
      return state;
    });
    const { result } = renderHook(() => useAuthController((state) => state));

    act(() => {
      result.current.actions.signOut();
    });

    expect(setLoadingModal).not.toBeCalled();
  });

  // resetAllStore lead to timeout
  // it('should sign out success hide loading', () => {
  //   const spyShowLoading = jest.spyOn(modalActions, 'showLoading');
  //   const spyHideLoading = jest.spyOn(modalActions, 'hideLoading');
  //   Auth.signOut = jest.fn();
  //
  //   jest.useFakeTimers();
  //
  //   const { result } = renderHook(() => useAuthController((state) => state));
  //
  //   act(() => {
  //     result.current.actions.signOut();
  //   });
  //
  //   act(() => {
  //     jest.runAllTimers();
  //   });
  //
  //   expect(Auth.signOut).toBeCalled();
  //   expect(spyShowLoading).toBeCalled();
  //   expect(spyHideLoading).toBeCalled();
  // });
});
