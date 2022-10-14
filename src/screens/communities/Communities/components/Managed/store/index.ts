import { createStore, resetStore } from '~/store/utils';
import getManaged from './actions/getManaged';
import getManagedCommunityAndGroup from './actions/getManagedCommunityAndGroup';
import getOwnerCommunity from './actions/getOwnerCommunity';
import { IManagedState } from './Interface';

const initManagedState: IManagedState = {
  refreshing: false,
  owner: {
    hasNextPage: true,
    ids: [],
    items: {},
  },
  manage: {
    loading: false,
    hasNextPage: true,
    ids: [],
    items: {},
  },
};

const managedState = (set, get): IManagedState => ({
  ...initManagedState,
  actions: {
    getManaged: getManaged(set, get),
    getOwnerCommunity: getOwnerCommunity(set, get),
    getManagedCommunityAndGroup: getManagedCommunityAndGroup(set, get),
  },
  reset: () => resetStore(initManagedState, set),
});

export const useManagedStore = createStore<IManagedState>(managedState);
