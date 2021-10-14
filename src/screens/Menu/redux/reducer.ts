import {IUserProfile} from '~/interfaces/IAuth';
import menuTypes from './types';

const initMenuState = {
  loadingMyProfile: false,
  isLanguageModalOpen: false,

  loadingUserProfile: false,
  userProfile: {} as IUserProfile,
  showUserNotFound: false,

  myProfile: {} as IUserProfile,
  emailEditError: '',

  loadingAvatar: false,
  loadingCover: false,
};

const menuReducer = (state = initMenuState, action: any = {}) => {
  const {type, payload} = action;

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
        userProfile: initMenuState.userProfile,
        showUserNotFound: initMenuState.showUserNotFound,
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
