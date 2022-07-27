import { IUserProfile, IUserWorkExperience } from '~/interfaces/IAuth';
import menuTypes from './types';
import countryCode from '~/constants/countryCode';
import { ICountryCodeList, ILocation } from '~/interfaces/common';
import locations from '~/constants/locations';
import { searchText } from '~/utils/common';

export const menuInitState = {
  loadingMyProfile: false,
  isLanguageModalOpen: false,

  loadingUserProfile: false,
  userProfile: {} as IUserProfile,
  userWorkExperience: [],
  showUserNotFound: false,

  myProfile: {} as IUserProfile,
  myWorkExperience: [],
  emailEditError: '',
  phoneNumberEditError: '',
  countryCodeList: {
    data: countryCode,
    searchResult: [],
  },
  selectedWorkItem: {} as IUserWorkExperience,

  locationList: {
    data: locations,
    searchResult: [],
  },

  loadingAvatar: false,
  loadingCover: false,
};

const menuReducer = (
  state = menuInitState, action: any = {},
) => {
  const { type, payload } = action;
  const { countryCodeList, locationList } = state;

  switch (type) {
    case menuTypes.GET_USER_PROFILE:
      return {
        ...state,
        loadingUserProfile: true,
      };
    case menuTypes.SET_USER_PROFILE:
      return {
        ...state,
        loadingUserProfile: false,
        loadingCover: false,
        loadingAvatar: false,
        userProfile: {
          ...state.userProfile,
          ...payload,
        },
      };
    case menuTypes.SET_SHOW_USER_NOT_FOUND:
      return {
        ...state,
        showUserNotFound: true,
      };
    case menuTypes.CLEAR_USER_PROFILE:
      return {
        ...state,
        userProfile: menuInitState.userProfile,
        showUserNotFound: menuInitState.showUserNotFound,
      };

    case menuTypes.GET_MY_PROFILE:
      return {
        ...state,
        loadingMyProfile: true,
      };
    case menuTypes.SET_EMAIL_EDIT_ERROR:
      return {
        ...state,
        emailEditError: payload,
      };
    case menuTypes.SET_PHONE_NUMBER_EDIT_ERROR:
      return {
        ...state,
        phoneNumberEditError: payload,
      };
    case menuTypes.SET_MY_PROFILE:
      return {
        ...state,
        loadingMyProfile: false,
        loadingCover: false,
        loadingAvatar: false,
        myProfile: {
          ...state.myProfile,
          ...payload,
          country_code: payload.country_code || '84',
        },
      };
    case menuTypes.SEARCH_COUNTRY_CODE:
      return {
        ...state,
        countryCodeList: {
          ...countryCodeList,
          // @ts-ignore
          searchResult: countryCodeList.data.filter((item: ICountryCodeList) => searchText(
            payload, item.code,
          ) || searchText(
            payload, item.name,
          )),
        },
      };
    case menuTypes.SEARCH_LOCATION:
      return {
        ...state,
        locationList: {
          ...locationList,
          searchResult: locationList.data.filter((item: ILocation) => searchText(
            payload, item.name,
          )
              || searchText(
                payload, item.country,
              )),
        },
      };

    case menuTypes.SET_LANGUAGE_MODAL_OPEN:
      return {
        ...state,
        isLanguageModalOpen: payload,
      };

    case menuTypes.SET_LOADING_AVATAR:
      return {
        ...state,
        loadingAvatar: payload,
      };
    case menuTypes.SET_LOADING_COVER:
      return {
        ...state,
        loadingCover: payload,
      };

    case menuTypes.SET_MY_WORK_EXPERIENCE:
      return {
        ...state,
        myWorkExperience: payload || [],
      };
    case menuTypes.SET_SELECTED_WORK_ITEM:
      return {
        ...state,
        selectedWorkItem: payload,
      };
    case menuTypes.SET_USER_WORK_EXPERIENCE:
      return {
        ...state,
        userWorkExperience: payload || [],
      };

    default:
      return state;
  }
};

export default menuReducer;
