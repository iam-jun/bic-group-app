import {IGetUserProfile, IUserEdit, IUserProfile} from '~/interfaces/IAuth';
import {IUserImageUpload} from '~/interfaces/IEditUser';
import menuTypes from './types';

const menuActions = {
  setLanguageModalOpen: (payload: boolean) => {
    return {
      type: menuTypes.SET_LANGUAGE_MODAL_OPEN,
      payload,
    };
  },

  getUserProfile: (payload: IGetUserProfile) => {
    return {
      type: menuTypes.GET_USER_PROFILE,
      payload,
    };
  },
  setUserProfile: (payload: IUserProfile | null) => {
    return {
      type: menuTypes.SET_USER_PROFILE,
      payload,
    };
  },
  setShowUserNotFound: () => {
    return {
      type: menuTypes.SET_SHOW_USER_NOT_FOUND,
    };
  },
  clearUserProfile: () => {
    return {
      type: menuTypes.CLEAR_USER_PROFILE,
    };
  },

  getMyProfile: (payload: IGetUserProfile) => {
    return {
      type: menuTypes.GET_MY_PROFILE,
      payload,
    };
  },
  setMyProfile: (payload: IUserProfile | null) => {
    return {
      type: menuTypes.SET_MY_PROFILE,
      payload,
    };
  },

  editMyProfile: function (payload: IUserEdit) {
    return {
      type: menuTypes.EDIT_MY_PROFILE,
      payload,
    };
  },
  uploadImage: function (payload: IUserImageUpload) {
    return {
      type: menuTypes.UPLOAD_IMAGE,
      payload,
    };
  },

  setLoadingAvatar: (payload: boolean) => ({
    type: menuTypes.SET_LOADING_AVATAR,
    payload,
  }),
  setLoadingCover: (payload: boolean) => ({
    type: menuTypes.SET_LOADING_COVER,
    payload,
  }),
};

export default menuActions;
