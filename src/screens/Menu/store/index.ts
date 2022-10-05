import groupApi from '~/api/GroupApi';
import { createStore, resetStore } from '~/store/utils';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';

const initState = {
  data: undefined,
  loading: true,
};

const joinedCommunitiesStore = (set) => ({
  ...initState,

  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => {
    set((state) => { state.loading = true; });
    groupApi.getJoinedCommunities(params)
      .then((response) => {
        set((state) => {
          state.loading = false;
          state.data = response.data || [];
        }, 'getJoinedCommunitiesSuccess');
      })
      .catch((error) => {
        console.warn('\x1b[35m🐣️ joinedCommunities error ', error, '\x1b[0m');
        set((state) => {
          state.loading = false;
        }, 'getJoinedCommunitiesError');
      });
  },

  reset: () => resetStore(initState, set),
});

const useJoinedCommunitiesStore = createStore<IJoinedCommunitiesState>(joinedCommunitiesStore);

export default useJoinedCommunitiesStore;
