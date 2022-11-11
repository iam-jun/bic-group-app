import groupApi from '~/api/GroupApi';
import { createStore, resetStore } from '~/store/utils';
import IMenuController from '~/screens/Menu/store/Interface';
import editMyProfile from './actions/editMyProfile';

const initState = {
  data: undefined,
  loading: true,
};

const menuController = (set) => ({
  ...initState,

  actions: {
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

    editMyProfile: editMyProfile(set),
  },

  reset: () => resetStore(initState, set),
});

const useMenuController = createStore<IMenuController>(menuController);

export default useMenuController;
