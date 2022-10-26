import { IUserProfile } from '~/interfaces/IAuth';
import { resetStore, createStore } from '~/store/utils';
import getCity from './actions/getCity';
import getCountry from './actions/getCountry';
import getLanguages from './actions/getLanguages';
import getUserProfile from './actions/getUserProfile';
import IUserProfileState from './Interface';

const initState = {
  data: {} as IUserProfile,
  loading: true,
  error: null,
};

const userProfileStore = (set, _get) => ({
  ...initState,
  languages: [],
  country: [],
  city: [],
  actions: {
    getUserProfile: getUserProfile(set),
    getLanguages: getLanguages(set),
    getCountry: getCountry(set),
    getCity: getCity(set),
  },
  reset: () => resetStore(initState, set),
});

const useUserProfileStore = createStore<IUserProfileState>(userProfileStore);

export default useUserProfileStore;
