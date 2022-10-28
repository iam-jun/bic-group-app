import {
  ICityResponseItem,
  ICountryResponseItem,
  IGetUserProfile,
  ILanguageResponseItem,
  IUserProfile,
} from '~/interfaces/IAuth';
import IBaseState from '~/store/interfaces/IBaseState';

interface IUserProfileState extends IBaseState {
  loading: boolean;
  data: IUserProfile;
  error: any;
  languages: ILanguageResponseItem[];
  country: ICountryResponseItem[];
  city: ICityResponseItem[];
  actions: {
    getUserProfile: ({ userId, params }: IGetUserProfile) => void;
    getLanguages: () => void;
    getCountry: () => void;
    getCity: () => void;
  };
}

export default IUserProfileState;
