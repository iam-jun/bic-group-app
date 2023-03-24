import { resetStore, createStore } from '~/store/utils';
import getCity from './actions/getCity';
import getCountry from './actions/getCountry';
import getLanguages from './actions/getLanguages';
import getUserProfile from './actions/getUserProfile';
import getWorkExperience from './actions/getWorkExperience';
import addWorkExperience from './actions/addWorkExperience';
import deleteWorkExperience from './actions/deleteWorkExperience';
import editWorkExperience from './actions/editWorkExperience';

import {
  ICityResponseItem,
  ICountryResponseItem,
  IGetUserProfile,
  ILanguageResponseItem,
  IUserProfile,
  IUserWorkExperience,
  IUserAddWorkExperience,
} from '~/interfaces/IAuth';
import IBaseState from '~/store/interfaces/IBaseState';
import blockUser from './actions/blockUser';

export interface IUserProfileState extends IBaseState {
  loading: boolean;
  data: IUserProfile;
  error: any;
  userWorkExperience: IUserWorkExperience[];
  languages: ILanguageResponseItem[];
  country: ICountryResponseItem[];
  city: ICityResponseItem[];
  actions: {
    getUserProfile: ({ userId, params }: IGetUserProfile) => void;
    getLanguages: () => void;
    getCountry: () => void;
    getCity: () => void;
    getWorkExperience: (userId: string) => void;
    addWorkExperience: (payload: IUserAddWorkExperience, callback?: () => void) => void;
    deleteWorkExperience: (id: string, callback?: () => void) => void;
    editWorkExperience: (id: string, payload: IUserAddWorkExperience, callback?: () => void) => void;
    blockUser: (blockedUserId: string, callback?: () => void) => Promise<void>;
  };
}

const initState = {
  data: {} as IUserProfile,
  loading: true,
  error: null,
  userWorkExperience: [],
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
    getWorkExperience: getWorkExperience(set),
    addWorkExperience: addWorkExperience(),
    deleteWorkExperience: deleteWorkExperience(set, _get),
    editWorkExperience: editWorkExperience(),
    blockUser: blockUser(),
  },
  reset: () => resetStore(initState, set),
});

const useUserProfileStore = createStore<IUserProfileState>(userProfileStore);

export default useUserProfileStore;
