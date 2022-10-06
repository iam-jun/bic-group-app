import getTabData from '~/screens/Home/store/actions/getTabData';
import IHomeState, { HOME_TAB_TYPE, IHomeTab } from '~/screens/Home/store/Interface';
import { createStore, resetStore } from '~/store/utils';

const DEFAULT_TAB_DATA = {
  refreshing: true,
  data: [],
  canLoadMore: true,
};

const initState: IHomeState = {
  activeTab: HOME_TAB_TYPE.NEWSFEED as keyof typeof HOME_TAB_TYPE,
  tabNewsfeed: DEFAULT_TAB_DATA,
  tabImportant: DEFAULT_TAB_DATA,
};

const homeStore = (set, get) => ({
  ...initState,

  actions: {
    setActiveTab: (tabId: keyof typeof HOME_TAB_TYPE) => {
      set(
        (state: IHomeState) => {
          state.activeTab = tabId;
        },
        'setActiveTab',
      );
    },
    setTabNewsfeed: (tab: IHomeTab) => {
      set(
        (state: IHomeState) => {
          state.tabNewsfeed = { ...state.tabNewsfeed, ...tab };
        },
        'setTabNewsfeed',
      );
    },
    setTabImportant: (tab: IHomeTab) => {
      set(
        (state: IHomeState) => {
          state.tabImportant = { ...state.tabImportant, ...tab };
        },
        'setTabImportant',
      );
    },

    refreshHome: () => {
      const { actions }: IHomeState = get();
      const newsfeedTab = HOME_TAB_TYPE.NEWSFEED as keyof typeof HOME_TAB_TYPE;
      set(
        (state: IHomeState) => { state.activeTab = newsfeedTab; },
        'refreshHome',
      );
      actions.getTabData(newsfeedTab, true);
    },

    getTabData: getTabData(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useHomeStore = createStore<IHomeState>(homeStore);

export default useHomeStore;
