import useAuthController from '~/screens/auth/store';
import { INetworkState } from '~/store/network';
import { timeOut } from '~/utils/common';

const MODAL_VISIBLE_DURATION = 2000;

const hideSystemIssueThemLogout = async (set, get) => {
  const state = get() || {};
  const isShownAlready = state.isShowSystemIssue;
  if (!isShownAlready) return;

  set((state: INetworkState) => {
    state.isShowSystemIssue = false;
  }, 'setIsInternetReachable');
  useAuthController.getState()?.actions?.signOut?.();
};

const showSystemIssueThenLogout = (set, get) => async () => {
  try {
    const state = get() || {};
    const isShownAlready = state.isShowSystemIssue;

    /**
     * Return if the system issue modal is already shown
     * to avoid putting another logging out in 2 seconds
     */
    if (isShownAlready) return;

    set((state: INetworkState) => {
      state.isShowSystemIssue = true;
    }, 'setIsInternetReachable');

    await timeOut(MODAL_VISIBLE_DURATION);

    await hideSystemIssueThemLogout(set, get);
  } catch (error) {
    console.error(
      'error', error,
    );
  }
};

export default showSystemIssueThenLogout;
