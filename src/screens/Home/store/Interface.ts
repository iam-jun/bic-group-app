import { IPostActivity } from '~/interfaces/IPost';
import IBaseState from '~/store/interfaces/IBaseState';

export const HOME_TAB_TYPE = {
  NEWSFEED: 'NEWSFEED',
  IMPORTANT: 'IMPORTANT',
};

export interface IHomeTab {
  refreshing: boolean,
  data: IPostActivity[]
  canLoadMore: boolean,
}

interface IHomeState extends IBaseState{
  activeTab: keyof typeof HOME_TAB_TYPE
  tabNewsfeed: IHomeTab,
  tabImportant: IHomeTab

  actions?: {
    setActiveTab?: (tab: keyof typeof HOME_TAB_TYPE) => void;
    setTabNewsfeed?: (data: IHomeTab) => void;
    setTabImportant?: (data: IHomeTab) => void;

    getTabData?: (tabId: keyof typeof HOME_TAB_TYPE, isRefresh?: boolean) => void;
    refreshHome?: () => void;
  }
}

export default IHomeState;
