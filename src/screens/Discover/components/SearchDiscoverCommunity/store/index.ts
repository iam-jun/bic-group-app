import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunitiesSearch from './actions/getDiscoverCommunitiesSearch';
import { IDiscoverCommunitiesSearchState } from './Interface';

const initDiscoverCommunitiesSearchState: IDiscoverCommunitiesSearchState = {
  ids: [],
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
  },
  reset: () => resetStore(initDiscoverCommunitiesSearchState, set),
});

const useDiscoverCommunitiesSearchStore
  = createStore<IDiscoverCommunitiesSearchState>(discoverCommunitiesSearchState);

export default useDiscoverCommunitiesSearchStore;
