import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunities from './actions/getDiscoverCommunities';
import IBaseState from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';

export interface IDiscoverCommunitiesState extends IBaseState, IFetchingState {
  ids: string[];
  actions?: {
    getDiscoverCommunities?: (isRefreshing?: boolean) => void;
  };
}

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
