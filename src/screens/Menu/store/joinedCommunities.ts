import { ICommunity } from '~/interfaces/ICommunity';
import groupApi from '~/api/GroupApi';
import { createZustand } from '~/store/utils';

export interface IJoinedCommunitiesState {
  data?: ICommunity[],
  loading: boolean,
  getJoinedCommunities: (params?: {
    previewMembers?: boolean;
    managed?: boolean;
  }) => void;
  reset: () => void;
}

const initState = {
  data: undefined,
  loading: false,
};

const useJoinedCommunities = (set) => ({
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
  reset: () => {
    set((state) => {
      Object.keys(initState).forEach((k) => {
        state[k] = initState[k];
      });
    },
    false,
    'reset');
  },
});

const useJoinedCommunitiesStore = createZustand<IJoinedCommunitiesState>(
  'useJoinedCommunities', useJoinedCommunities,
);

export default useJoinedCommunitiesStore;
