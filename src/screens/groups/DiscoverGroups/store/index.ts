import { createStore, resetStore } from '~/store/utils';
import IDiscoverGroupsState from './Interface';
import getDiscoverGroups from './actions/getDiscoverGroups';
import getCommunityGroups from './actions/getCommunityGroups';

const initState: IDiscoverGroupsState = {
  loading: true,
  ids: [],
  items: {},
  canLoadMore: true,
  noGroupInCommuntity: false,
};

const discoverGroupsStore = (set, get) => ({
  ...initState,

  doGetDiscoverGroups: getDiscoverGroups(set, get),
  doGetCommunityGroups: getCommunityGroups(set, get),

  reset: () => resetStore(initState, set),
});

const useDiscoverGroupsStore = createStore<IDiscoverGroupsState>(discoverGroupsStore);

export default useDiscoverGroupsStore;
