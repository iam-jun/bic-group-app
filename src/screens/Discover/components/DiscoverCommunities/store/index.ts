import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunities from './actions/getDiscoverCommunities';
import { IDiscoverCommunitiesState } from './Interface';

const initDiscoverCommunitiesState: IDiscoverCommunitiesState = {
  ids: [],
  items: {},
  loading: false,
  hasNextPage: true,
  refreshing: false,
};

const discoverCommunitiesState = (set, get): IDiscoverCommunitiesState => ({
  ...initDiscoverCommunitiesState,
  actions: {
    getDiscoverCommunities: getDiscoverCommunities(set, get),
    setDiscoverCommunities: (communityId, data) => {
      const discoverCommunityItem = get().items[communityId] || {};
      set({
        items: {
          ...get().items,
          [communityId]: {
            ...discoverCommunityItem,
            ...data,
          },
        },
      });
    },
  },
  reset: () => resetStore(initDiscoverCommunitiesState, set),
});

export const useDiscoverCommunitiesStore = createStore<IDiscoverCommunitiesState>(discoverCommunitiesState);
