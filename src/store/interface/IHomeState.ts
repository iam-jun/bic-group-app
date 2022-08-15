import { HOME_TAB_TYPE } from '~/screens/Home/constants';
import { IPostActivity } from '~/interfaces/IPost';

export interface IHomeTab {
  refreshing: boolean,
  data: IPostActivity[]
  canLoadMore: boolean,
}

interface IHomeState {
  activeTab: keyof typeof HOME_TAB_TYPE
  tabNewsfeed: IHomeTab,
  tabImportant: IHomeTab

  setActiveTab: (tab: keyof typeof HOME_TAB_TYPE) => void;
  setTabNewsfeed: (data: IHomeTab) => void;
  setTabImportant: (data: IHomeTab) => void;

  getTabData: (tabId: keyof typeof HOME_TAB_TYPE, isRefresh?: boolean) => void;
}

export default IHomeState
