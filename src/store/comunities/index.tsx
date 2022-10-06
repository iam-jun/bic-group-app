import {
  createStore, resetStore,
} from '../utils';
import cancelJoinCommunity from './actions/cancelJoinCommunity';
import editCommunityDetail from './actions/editCommunityDetail';
import getCommunity from './actions/getCommunity';
import joinCommunity from './actions/joinCommunity';
import leaveCommunity from './actions/leaveCommunity';
import updateCommunityJoinSetting from './actions/updateCommunityJoinSetting';
import ICommunitiesState from './Interface';

const initialState = {
  requestings: {},
  data: {},
  errors: {},
};

const communitiesStore = (set, get) => ({
  ...initialState,
  actions: {
    getCommunity: getCommunity(set, get),
    leaveCommunity: leaveCommunity(set, get),
    joinCommunity: joinCommunity(set, get),
    cancelJoinCommunity: cancelJoinCommunity(set, get),
    editCommunityDetail: editCommunityDetail(set, get),
    updateCommunityJoinSetting: updateCommunityJoinSetting(set, get),
    resetCommunity: (id: string) => {
      set((state: ICommunitiesState) => {
        delete state.data[id];
        delete state.errors[id];
      });
    },
  },
  reset: () => resetStore(initialState, set),

});

const useCommunitiesStore = createStore<ICommunitiesState>(communitiesStore);

export default useCommunitiesStore;
