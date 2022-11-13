import menuTypes from './types';
import countryCode from '~/constants/countryCode';
import { ICountryCodeList, ILocation } from '~/interfaces/common';
import locations from '~/constants/locations';
import { searchText } from '~/utils/common';

export const menuInitState = {
  isLanguageModalOpen: false,

  emailEditError: '',
  phoneNumberEditError: '',
  countryCodeList: {
    data: countryCode,
    searchResult: [],
  },

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
    case menuTypes.SEARCH_COUNTRY_CODE:
      return {
        ...state,
        countryCodeList: {
          ...countryCodeList,
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

    default:
      return state;
  }
};

export default menuReducer;
