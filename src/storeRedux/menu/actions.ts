import { IUserImageUpload } from '~/interfaces/IEditUser';
import menuTypes from './types';

const menuActions = {
  setLanguageModalOpen: (payload: boolean) => ({
    type: menuTypes.SET_LANGUAGE_MODAL_OPEN,
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

};

export default menuActions;
