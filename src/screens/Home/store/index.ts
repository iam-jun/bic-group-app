import { HOME_TAB_TYPE } from '~/screens/Home/constants';
import IHomeState, { IHomeTab } from '~/screens/Home/store/Interface';
import { createStore } from '~/store/utils';
import streamApi from '~/api/StreamApi';
import storeRedux from '~/storeRedux';
import postActions from '~/storeRedux/post/actions';
import { IParamGetFeed } from '~/interfaces/IHome';

const DEFAULT_TAB_DATA = {
  refreshing: true,
  data: [],
  canLoadMore: true,
};

const initState = {
  activeTab: HOME_TAB_TYPE.NEWSFEED,
  tabNewsfeed: DEFAULT_TAB_DATA,
  tabImportant: DEFAULT_TAB_DATA,
};

const homeStore = (set, get) => ({
  ...initState,
  setActiveTab: (tabId: keyof typeof HOME_TAB_TYPE) => {
    set(
      (state: IHomeState) => {
        state.activeTab = tabId;
      },
    );
  },
  setTabNewsfeed: (tab: IHomeTab) => {
    set(
      (state: IHomeState) => {
        state.tabNewsfeed = { ...state.tabNewsfeed, ...tab };
      },
    );
  },
  setTabImportant: (tab: IHomeTab) => {
    set(
      (state: IHomeState) => {
        state.tabImportant = { ...state.tabImportant, ...tab };
      },
    );
  },

  getTabData: (tabId: keyof typeof HOME_TAB_TYPE, isRefresh?: boolean) => {
    const statePath = tabId === HOME_TAB_TYPE.NEWSFEED ? 'tabNewsfeed' : 'tabImportant';
    set(
      (state: IHomeState) => {
        state[statePath] = { ...state[statePath], refreshing: true };
      },
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
          'getTabData',
        );
      });
  },
  reset: () => {
    set(
      (state: IHomeState) => {
        Object.keys(initState).forEach((k) => {
          state[k] = initState[k];
        });
      },
    );
  },
});

const useHomeStore = createStore<IHomeState>(homeStore);

export default useHomeStore;
