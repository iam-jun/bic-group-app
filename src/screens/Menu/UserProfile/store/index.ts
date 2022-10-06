import { IUserProfile } from '~/interfaces/IAuth';
import { resetStore, createStore } from '~/store/utils';
import getUserProfile from './actions/getUserProfile';
import IUserProfileState from './Interface';

const initState = {
  data: {} as IUserProfile,
  loading: true,
  error: null,
};

const userProfileStore = (set, _get) => ({
  ...initState,

  doGetUserProfile: getUserProfile(set),

  reset: () => resetStore(initState, set),
});

const useUserProfileStore = createStore<IUserProfileState>(userProfileStore);

export default useUserProfileStore;
