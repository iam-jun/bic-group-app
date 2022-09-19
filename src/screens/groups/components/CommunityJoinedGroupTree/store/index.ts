import { createStore, resetStore } from '~/store/utils';
import groupApi from '~/api/GroupApi';
import IJoinedGroupTreeState from './Interface';

const initialState = {
  data: {},
  loading: false,
};

const communityJoinedGroupTreeStore = (set) => ({
  ...initialState,
  getJoinedGroupTree: (id: string) => {
    set((state) => {
      state.loading = true;
    });
    groupApi.getCommunityGroups(id, { listBy: 'tree' }).then((response) => {
      set((state) => {
        state.loading = false;
        state.data[id] = response.data || [];
      }, 'getJoinedGroupTree');
    }).catch((error) => {
      console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
      set((state) => {
        state.loading = false;
      }, 'getJoinedGroupTree');
    });
  },
  reset: () => resetStore(initialState, set),
});

const useCommunityJoinedGroupTreeStore = createStore<IJoinedGroupTreeState>(communityJoinedGroupTreeStore);

export default useCommunityJoinedGroupTreeStore;
