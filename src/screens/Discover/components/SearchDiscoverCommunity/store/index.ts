import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunitiesSearch from './actions/getDiscoverCommunitiesSearch';
import { IDiscoverCommunitiesSearchState } from './Interface';

const initDiscoverCommunitiesSearchState: IDiscoverCommunitiesSearchState = {
  ids: [],
  items: {},
  loading: false,
  hasNextPage: true,
};

const discoverCommunitiesSearchState = (
  set,
  get,
): IDiscoverCommunitiesSearchState => ({
  ...initDiscoverCommunitiesSearchState,
  actions: {
    getDiscoverCommunitiesSearch: getDiscoverCommunitiesSearch(set, get),
    setDiscoverCommunitiesSearchItem: (communityId, data) => {
      const discoverCommunitySearchItem = get().items[communityId] || {};
      set({
        items: {
          ...get().items,
          [communityId]: {
            ...discoverCommunitySearchItem,
            ...data,
          },
        },
      });
    },
  },
  reset: () => resetStore(initDiscoverCommunitiesSearchState, set),
});

export const useDiscoverCommunitiesSearchStore
  = createStore<IDiscoverCommunitiesSearchState>(discoverCommunitiesSearchState);
