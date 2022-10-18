import { createStore, resetStore } from '~/store/utils';
import getYourCommunities from './actions/getYourCommunities';
import { IYourCommunitiesState } from './Interface';

const initYourCommunitiesState: IYourCommunitiesState = {
  ids: [],
  items: {},
  loading: false,
  hasNextPage: true,
  refreshing: false,
};

const yourCommunitiesState = (set, get): IYourCommunitiesState => ({
  ...initYourCommunitiesState,
  actions: {
    getYourCommunities: getYourCommunities(set, get),
  },
  reset: () => resetStore(initYourCommunitiesState, set),
});

const useYourCommunitiesStore = createStore<IYourCommunitiesState>(yourCommunitiesState);

export default useYourCommunitiesStore;
