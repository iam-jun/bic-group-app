import {
  IGetUserProfile,
  IUserAddWorkExperience,
  IUserEdit,
  IUserProfile,
  IUserWorkExperience,
} from '~/interfaces/IAuth';
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

  getMyWorkExperience: () => {
    return {
      type: menuTypes.GET_MY_WORK_EXPERIENCE,
    };
  },
  setMyWorkExperience: (payload: IUserWorkExperience[]) => {
    return {
      type: menuTypes.SET_MY_WORK_EXPERIENCE,
      payload,
    };
  },
  addWorkExperience: (
    payload: IUserAddWorkExperience,
    callback?: () => void,
  ) => {
    return {
      type: menuTypes.ADD_WORK_EXPERIENCE,
      payload,
      callback,
    };
  },
  editWorkExperience: (
    id: number,
    payload: IUserAddWorkExperience,
    callback?: () => void,
  ) => {
    return {
      type: menuTypes.EDIT_WORK_EXPERIENCE,
      id,
      payload,
      callback,
    };
  },
  deleteWorkExperience: (id: number, callback?: () => void) => {
    return {
      type: menuTypes.DELETE_WORK_EXPERIENCE,
      id,
      callback,
    };
  },
  setSelectedWorkItem: (payload: IUserWorkExperience | null) => {
    return {
      type: menuTypes.SET_SELECTED_WORK_ITEM,
      payload,
    };
  },

  searchCountryCode: (payload: string) => ({
    type: menuTypes.SEARCH_COUNTRY_CODE,
    payload,
  }),
  searchLocation: (payload: string) => ({
    type: menuTypes.SEARCH_LOCATION,
    payload,
  }),

  editMyProfile: function (
    payload: IUserEdit,
    editFieldToastMessage?: string,
    callback?: () => void,
  ) {
    return {
      type: menuTypes.EDIT_MY_PROFILE,
      payload,
      editFieldToastMessage,
      callback,
    };
  },
  setEmailEditError: (payload: string) => ({
    type: menuTypes.SET_EMAIL_EDIT_ERROR,
    payload,
  }),
  setPhoneNumberEditError: (payload: string) => ({
    type: menuTypes.SET_PHONE_NUMBER_EDIT_ERROR,
    payload,
  }),
  uploadImage: (payload: IUserImageUpload, callback?: () => void) => {
    return {
      type: menuTypes.UPLOAD_IMAGE,
      payload,
      callback,
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

  getUserWorkExperience: (id: number) => ({
    type: menuTypes.GET_USER_WORK_EXPERIENCE,
    id,
  }),
  setUserWorkExperience: (payload: IUserWorkExperience[]) => {
    return {
      type: menuTypes.SET_USER_WORK_EXPERIENCE,
      payload,
    };
  },
};

export default menuActions;
