import { INetworkState } from '~/store/network/index';

const networkSelectors = {
  getIsInternetReachable: (state: INetworkState) => state.isInternetReachable,
  getIsShowSystemIssue: (state: INetworkState) => state.isShowSystemIssue,
};

export default networkSelectors;
