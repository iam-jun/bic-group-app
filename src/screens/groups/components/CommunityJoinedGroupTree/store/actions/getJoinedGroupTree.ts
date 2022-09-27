import groupApi from '~/api/GroupApi';

const getJoinedGroupTree = (set, _get) => (id: string) => {
  set((state) => {
    state.loading = true;
  }, 'getJoinedGroupTree');
  groupApi.getCommunityGroups(id, { listBy: 'tree' }).then((response) => {
    set((state) => {
      state.loading = false;
      state.data[id] = response.data || [];
    }, 'getJoinedGroupTreeSuccess');
  }).catch((error) => {
    console.error('\x1b[35m🐣️ joinedGroupTree error ', error, '\x1b[0m');
    set((state) => {
      state.loading = false;
    }, 'getJoinedGroupTreeFailed');
  });
};

export default getJoinedGroupTree;
