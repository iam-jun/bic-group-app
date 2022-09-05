import { createZustand, resetZustand } from '~/store/utils';
import groupApi from '~/api/GroupApi';
import IJoinedGroupTreeState from '~/screens/groups/store/Interface';

const initialState = {
  data: {},
  loading: false,
};

const joinedGroupTreeStore = (set) => ({
  ...initialState,

  getJoinedGroupTree: (id: string) => {
    set((state) => {
      state.loading = true;
    }, false, 'getJoinedGroupTree');
    groupApi.getCommunityGroups(id, { listBy: 'tree' }).then((response) => {
      set((state) => {
        state.loading = false;
        state.data[id] = response.data || [];
      }, false, 'getJoinedGroupTree');
    }).catch((error) => {
      console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
      set((state) => {
        state.loading = false;
      }, false, 'getJoinedGroupTree');
    });
  },

  reset: () => resetZustand(initialState, set),
});

const useJoinedGroupTreeStore = createZustand<IJoinedGroupTreeState>(
  'joined-group-tree-store', joinedGroupTreeStore,
);

export default useJoinedGroupTreeStore;
