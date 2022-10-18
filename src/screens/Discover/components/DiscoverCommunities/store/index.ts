import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunities from './actions/getDiscoverCommunities';
import { IDiscoverCommunitiesState } from './Interface';

const initDiscoverCommunitiesState: IDiscoverCommunitiesState = {
  ids: [],
  loading: false,
  hasNextPage: true,
  refreshing: false,
};

const discoverCommunitiesState = (set, get): IDiscoverCommunitiesState => ({
  ...initDiscoverCommunitiesState,
  actions: {
    getDiscoverCommunities: getDiscoverCommunities(set, get),
  },
  reset: () => resetStore(initDiscoverCommunitiesState, set),
});

const useDiscoverCommunitiesStore = createStore<IDiscoverCommunitiesState>(discoverCommunitiesState);

export default useDiscoverCommunitiesStore;
