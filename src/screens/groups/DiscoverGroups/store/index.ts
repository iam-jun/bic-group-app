import { createStore, resetStore } from '~/store/utils';
import IDiscoverGroupsState from './Interface';
import getDiscoverGroups from './actions/getDiscoverGroups';
import getCommunityGroups from './actions/getCommunityGroups';
import joinNewGroup from './actions/joinNewGroup';
import cancelJoinGroup from './actions/cancelJoinGroup';

const initState: IDiscoverGroupsState = {
  loading: true,
  ids: [],
  items: {},
  canLoadMore: true,
  noGroupInCommuntity: false,
};

const discoverGroupsStore = (set, get) => ({
  ...initState,

  doJoinNewGroup: joinNewGroup(set, get),
  doCancelJoinGroup: cancelJoinGroup(set, get),
  doGetDiscoverGroups: getDiscoverGroups(set, get),
  doGetCommunityGroups: getCommunityGroups(set, get),

  reset: () => resetStore(initState, set),
});

const useDiscoverGroupsStore = createStore<IDiscoverGroupsState>(discoverGroupsStore);

export default useDiscoverGroupsStore;
