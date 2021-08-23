import {IUserEdit, IUserProfile} from '~/interfaces/IAuth';
import menuTypes from './types';

const menuActions = {
  setLanguageModalOpen: (payload: boolean) => {
    return {
      type: menuTypes.SET_LANGUAGE_MODAL_OPEN,
      payload,
    };
  },
  setMyProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SET_MY_PROFILE,
      payload,
    };
  },
  selectMyProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SELECT_MY_PROFILE,
      payload,
    };
  },
  setSelectedProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SET_SELECTED_PROFILE,
      payload,
    };
  },
  selectedProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SELECTED_PROFILE,
      payload,
    };
  },
  editMyProfile: function (payload: IUserEdit) {
    return {
      type: menuTypes.EDIT_MY_PROFILE,
      payload,
    };
  },

  // FOR SAGA:
  getMyProfile: (payload: string) => {
    return {
      type: menuTypes.GET_MY_PROFILE,
      payload,
    };
  },
  getSelectedProfile: (payload: string) => {
    return {
      type: menuTypes.GET_SELECTED_PROFILE,
      payload,
    };
  },
};

export default menuActions;
