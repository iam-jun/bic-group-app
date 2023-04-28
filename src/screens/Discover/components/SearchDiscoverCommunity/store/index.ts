import { createStore, resetStore } from '~/store/utils';
import getDiscoverCommunitiesSearch from './actions/getDiscoverCommunitiesSearch';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import IFetchingState from '~/store/interfaces/IFetchingState';
import { IParamGetCommunities } from '~/interfaces/ICommunity';

export interface IDiscoverCommunitiesSearchState extends IBaseState, IFetchingState {
  ids: string[];
  actions: {
    getDiscoverCommunitiesSearch?: (params: IParamGetCommunities) => void;
  };
}

const initDiscoverCommunitiesSearchState: InitStateType<IDiscoverCommunitiesSearchState> = {
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
