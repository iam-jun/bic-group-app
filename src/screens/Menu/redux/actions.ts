import {
  IGetUserProfile,
  IUserAddWorkExperience,
  IUserEdit,
  IUserProfile,
  IUserWorkExperience,
} from '~/interfaces/IAuth';
import { IUserImageUpload } from '~/interfaces/IEditUser';
import menuTypes from './types';

const menuActions = {
  setLanguageModalOpen: (payload: boolean) => ({
    type: menuTypes.SET_LANGUAGE_MODAL_OPEN,
    payload,
  }),

  getUserProfile: (payload: IGetUserProfile) => ({
    type: menuTypes.GET_USER_PROFILE,
    payload,
  }),
  setUserProfile: (payload: IUserProfile | null) => ({
    type: menuTypes.SET_USER_PROFILE,
    payload,
  }),
  setShowUserNotFound: () => ({
    type: menuTypes.SET_SHOW_USER_NOT_FOUND,
  }),
  clearUserProfile: () => ({
    type: menuTypes.CLEAR_USER_PROFILE,
  }),

  getMyProfile: (payload: IGetUserProfile) => ({
    type: menuTypes.GET_MY_PROFILE,
    payload,
  }),
  setMyProfile: (payload: IUserProfile | null) => ({
    type: menuTypes.SET_MY_PROFILE,
    payload,
  }),

  getMyWorkExperience: () => ({
    type: menuTypes.GET_MY_WORK_EXPERIENCE,
  }),
  setMyWorkExperience: (payload: IUserWorkExperience[]) => ({
    type: menuTypes.SET_MY_WORK_EXPERIENCE,
    payload,
  }),
  addWorkExperience: (
    payload: IUserAddWorkExperience,
    callback?: () => void,
  ) => ({
    type: menuTypes.ADD_WORK_EXPERIENCE,
    payload,
    callback,
  }),
  editWorkExperience: (
    id: string,
    payload: IUserAddWorkExperience,
    callback?: () => void,
  ) => ({
    type: menuTypes.EDIT_WORK_EXPERIENCE,
    id,
    payload,
    callback,
  }),
  deleteWorkExperience: (
    id: string, callback?: () => void,
  ) => ({
    type: menuTypes.DELETE_WORK_EXPERIENCE,
    id,
    callback,
  }),
  setSelectedWorkItem: (payload: IUserWorkExperience | null) => ({
    type: menuTypes.SET_SELECTED_WORK_ITEM,
    payload,
  }),

  searchCountryCode: (payload: string) => ({
    type: menuTypes.SEARCH_COUNTRY_CODE,
    payload,
  }),
  searchLocation: (payload: string) => ({
    type: menuTypes.SEARCH_LOCATION,
    payload,
  }),

  editMyProfile(
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
  uploadImage: (
    payload: IUserImageUpload, callback?: () => void,
  ) => ({
    type: menuTypes.UPLOAD_IMAGE,
    payload,
    callback,
  }),

  setLoadingAvatar: (payload: boolean) => ({
    type: menuTypes.SET_LOADING_AVATAR,
    payload,
  }),
  setLoadingCover: (payload: boolean) => ({
    type: menuTypes.SET_LOADING_COVER,
    payload,
  }),

  getUserWorkExperience: (id: string) => ({
    type: menuTypes.GET_USER_WORK_EXPERIENCE,
    id,
  }),
  setUserWorkExperience: (payload: IUserWorkExperience[]) => ({
    type: menuTypes.SET_USER_WORK_EXPERIENCE,
    payload,
  }),
};

export default menuActions;
