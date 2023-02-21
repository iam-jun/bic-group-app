import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { INetworkState } from '~/store/network';
import { timeOut } from '~/utils/common';

const checkIsInternetReachable = (set, _get) => async () => {
  try {
    let netInfoState: NetInfoState = await NetInfo.fetch();
    if (netInfoState.isInternetReachable === null) {
      const threshold = 5000; // 5000 is for slow 3G, the faster network, the smaller threshold is
      await timeOut(threshold);
      netInfoState = await NetInfo.fetch();
    }

    // previous version of the code, TriNhan set isInternetReachable = netInfoState ?!?
    set((state: INetworkState) => {
      state.isInternetReachable = netInfoState?.isConnected;
    }, 'setIsInternetReachable');
  } catch (error) {
    console.error(
      'Error when checking internet connection', error,
    );
  }
};

export default checkIsInternetReachable;
