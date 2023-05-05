import { createStore, resetStore } from '~/store/utils';
import IMenuController from '~/screens/Menu/store/Interface';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import editMyProfile from './actions/editMyProfile';
import getJoinedCommunities from './actions/getJoinedCommunities';

const initState = {
  data: undefined,
  loading: true,
  selectedWorkItem: {},
};

const menuController = (set, get) => ({
  ...initState,

  actions: {
    getJoinedCommunities: getJoinedCommunities(set, get),
    editMyProfile: editMyProfile(set, get),

    setSelectedWorkItem: (payload: IUserWorkExperience) => {
      set((state: IMenuController) => {
        state.selectedWorkItem = payload;
      }, 'setSelectedWorkItem');
    },
    setEditContactError: (errorText: string) => {
      set((state: IMenuController) => {
        state.editContactError = errorText;
      }, 'setEditContactError');
    },

  },

  reset: () => resetStore(initState, set),
});

const useMenuController = createStore<IMenuController>(menuController);

export default useMenuController;
