import { createStore, resetStore } from '~/store/utils';
import searchJoinedCommunities from './actions/searchJoinedCommunities';
import { ISearchJoinedCommunitiesState } from './Interface';

const initSearchJoinedCommunitiesState: ISearchJoinedCommunitiesState = {
  ids: [],
  items: {},
  loading: false,
  hasNextPage: true,
};

const searchJoinedCommunitiesState = (
  set,
  get,
): ISearchJoinedCommunitiesState => ({
  ...initSearchJoinedCommunitiesState,
  actions: {
    searchJoinedCommunities: searchJoinedCommunities(set, get),
  },
  reset: () => resetStore(initSearchJoinedCommunitiesState, set),
});

const useSearchJoinedCommunitiesStore
  = createStore<ISearchJoinedCommunitiesState>(searchJoinedCommunitiesState);

export default useSearchJoinedCommunitiesStore;
