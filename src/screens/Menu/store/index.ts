import groupApi from '~/api/GroupApi';
import { createZustand, resetStore } from '~/store/utils';
import IJoinedCommunitiesState from '~/screens/Menu/store/Interface';

const initState = {
  data: undefined,
  loading: false,
};

const joinedCommunitiesStore = (set) => ({
  ...initState,

  getJoinedCommunities: (params: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => {
    set((state) => { state.loading = true; }, false, 'getJoinedCommunities');
    groupApi.getJoinedCommunities(params)
      .then((response) => {
        set((state) => {
          state.loading = false;
          state.data = response.data || [];
        }, false, 'getJoinedCommunitiesSuccess');
      })
      .catch((error) => {
        console.warn('\x1b[35m🐣️ joinedCommunities error ', error, '\x1b[0m');
        set((state) => {
          state.loading = false;
        }, false, 'getJoinedCommunitiesError');
      });
  },

  reset: () => resetStore(initState, set),
});

const useJoinedCommunitiesStore = createZustand<IJoinedCommunitiesState>(
  'joined-communities-store', joinedCommunitiesStore,
);

export default useJoinedCommunitiesStore;
