import { createStore, resetStore } from '~/store/utils';
import IDiscoverGroupsState from './Interface';
import getDiscoverGroups from './actions/getDiscoverGroups';
import joinNewGroup from './actions/joinNewGroup';
import cancelJoinGroup from './actions/cancelJoinGroup';
import { InitStateType } from '~/store/interfaces/IBaseState';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

const initState: InitStateType<IDiscoverGroupsState> = {
  loading: true,
  ids: [],
  items: {},
  canLoadMore: true,
  noGroupInCommuntity: false,
};

const discoverGroupsStore = (set, get) => ({
  ...initState,
  actions: {
    setGroupStatus: (groupId: string, status: GroupJoinStatus) => {
      if (!groupId) return;
      const currentState: IDiscoverGroupsState = get();
      set((state:IDiscoverGroupsState) => {
        state.items[groupId] = { ...currentState.items[groupId], joinStatus: status };
      }, 'setGroupStatus');
    },

    joinNewGroup: joinNewGroup(set, get),
    cancelJoinGroup: cancelJoinGroup(set, get),
    getDiscoverGroups: getDiscoverGroups(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useDiscoverGroupsStore = createStore<IDiscoverGroupsState>(discoverGroupsStore);

export default useDiscoverGroupsStore;
