import { ICommunity } from '~/interfaces/ICommunity';
import groupApi from '~/api/GroupApi';
import { createZustand } from '~/store';

interface JoinedCommunitiesState {
  data?: ICommunity[],
  loading: boolean,
  getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
}

const useJoinedCommunities = (set) => ({
  data: undefined,
  loading: false,
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
});

const useJoinedCommunitiesStore = createZustand<JoinedCommunitiesState>(
  'useJoinedCommunities', useJoinedCommunities,
);

export default useJoinedCommunitiesStore;
