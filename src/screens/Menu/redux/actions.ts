import {IUserProfile} from '~/interfaces/IAuth';
import menuTypes from './types';

const menuActions = {
  setLanguageModalOpen: (payload: boolean) => {
    return {
      type: menuTypes.SET_LANGUAGE_MODAL_OPEN,
      payload,
    };
  },
  setUserProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SET_USER_PROFILE,
      payload,
    };
  },
  selectUserProfile: (payload: IUserProfile) => {
    return {
      type: menuTypes.SELECT_USER_PROFILE,
      payload,
    };
  },

  // FOR SAGA:
  getUserProfile: () => {
    return {
      type: menuTypes.GET_USER_PROFILE,
    };
  },
};

export default menuActions;
