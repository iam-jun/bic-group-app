import {IUserProfile} from '~/interfaces/IAuth';
import menuTypes from './types';

const initMenuState = {
  loadingMyProfile: false,
  isLanguageModalOpen: false,
  myProfile: {} as IUserProfile,
  selectedProfile: {} as IUserProfile,

  loadingAvatar: false,
  loadingCover: false,
};

const menuReducer = (state = initMenuState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case menuTypes.SELECT_MY_PROFILE:
    case menuTypes.SET_MY_PROFILE:
      return {
        ...state,
        loadingMyProfile: false,
        loadingCover: false,
        loadingAvatar: false,
        myProfile: {
          ...state.myProfile,
          ...payload,
        },
      };

    case menuTypes.GET_MY_PROFILE:
      return {
        ...state,
        loadingMyProfile: true,
      };

    case menuTypes.SELECTED_PROFILE:
    case menuTypes.SET_SELECTED_PROFILE:
      return {
        ...state,
        selectedProfile: {
          ...payload,
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
