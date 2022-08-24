import { HOME_TAB_TYPE } from '~/screens/Home/constants';
import IHomeState, { IHomeTab } from '~/store/interface/IHomeState';
import { createZustand } from '~/store/utils';
import streamApi from '~/api/StreamApi';
import storeRedux from '~/storeRedux';
import postActions from '~/storeRedux/post/actions';
import { IParamGetFeed } from '~/interfaces/IHome';

const DEFAULT_TAB_DATA = {
  refreshing: true,
  data: [],
  canLoadMore: true,
};

const homeStore = (set, get) => ({
  activeTab: HOME_TAB_TYPE.NEWSFEED,
  tabNewsfeed: DEFAULT_TAB_DATA,
  tabImportant: DEFAULT_TAB_DATA,

  setActiveTab: (tabId: keyof typeof HOME_TAB_TYPE) => {
    set(
      (state: IHomeState) => {
        state.activeTab = tabId;
      },
      false,
      'setActiveTab',
    );
  },
  setTabNewsfeed: (tab: IHomeTab) => {
    set(
      (state: IHomeState) => {
        state.tabNewsfeed = { ...state.tabNewsfeed, ...tab };
      },
      false,
      'setTabNewsfeed',
    );
  },
  setTabImportant: (tab: IHomeTab) => {
    set(
      (state: IHomeState) => {
        state.tabImportant = { ...state.tabImportant, ...tab };
      },
      false,
      'setTabImportant',
    );
  },

  getTabData: (tabId: keyof typeof HOME_TAB_TYPE, isRefresh?: boolean) => {
    const statePath = tabId === HOME_TAB_TYPE.NEWSFEED ? 'tabNewsfeed' : 'tabImportant';
    set(
      (state: IHomeState) => {
        state[statePath] = { ...state[statePath], refreshing: true };
      },
      false,
      'getTabData',
    );
    const currentState: IHomeState = get();
    const currentList = currentState[statePath].data;
    const offset = isRefresh ? 0 : currentList.length || 0;
    const requestParams: IParamGetFeed = { offset };
    if (tabId === HOME_TAB_TYPE.IMPORTANT) {
      requestParams.isImportant = true;
    }
    streamApi.getNewsfeed(requestParams)
      .then((response) => {
        const responseList = response?.list || [];
        storeRedux.store.dispatch(postActions.addToAllPosts({ data: responseList }));
        const newList = isRefresh ? responseList : currentList.concat(responseList);
        set(
          (state: IHomeState) => {
            state[statePath] = {
              ...state[statePath],
              refreshing: false,
              data: newList,
              canLoadMore: response?.meta?.hasNextPage || false,
            };
          },
          false,
          'getTabData',
        );
      })
      .catch(() => {
        set(
          (state: IHomeState) => {
            state[statePath] = {
              ...state[statePath],
              refreshing: false,
              canLoadMore: false,
            };
          },
          false,
          'getTabData',
        );
      });
  },
});

const useHomeStore = createZustand<IHomeState>('home-store', homeStore);

export default useHomeStore;
