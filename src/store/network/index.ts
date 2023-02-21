import IBaseState from '~/store/interfaces/IBaseState';
import checkIsInternetReachable from './actions/checkIsInternetReachable';
import showSystemIssueThenLogout from './actions/showSystemIssueThenLogout';
import { createStore, resetStore } from '~/store/utils';
import { InitStateType } from '../interfaces/IBaseState';

export interface INetworkState extends IBaseState {
  isInternetReachable: boolean;
  isShowSystemIssue: boolean;

  actions: {
    checkIsInternetReachable: () => void,
    showSystemIssueThenLogout: () => void,
    setIsShowSystemIssue: (isShow: boolean) => void,
  }
}

const initialState: InitStateType<INetworkState> = {
  /**
   * Use our isInternetReachable instead of NetInfo because:
   *  - NetInfo.isInternetReachable may be null when first defined
   *  - Sometimes when there is no Internet and not connected to any network
   *    it may return {
   *      isConnected: false.
   *      isInternetReachable: true
   *    }
   *    => which we do not want
   * Set default to true as for first time accessing the app
   */
  isInternetReachable: true,
  isShowSystemIssue: false,
};

const networkStore = (set, get) => ({
  ...initialState,
  actions: {
    checkIsInternetReachable: checkIsInternetReachable(set, get),
    showSystemIssueThenLogout: showSystemIssueThenLogout(set, get),
    setIsShowSystemIssue: (isShow) => {
      set((state) => {
        state.isShowSystemIssue = isShow;
      }, 'setIsShowSystemIssue');
    },
  },
  reset: () => resetStore(initialState, set),
});

const useNetworkStore = createStore<INetworkState>(networkStore);

export default useNetworkStore;
