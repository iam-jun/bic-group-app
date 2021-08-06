import menuTypes from './types';

const menuActions = {
  setLoadingUserProfile: (payload: boolean) => {
    return {
      type: menuTypes.SET_LOADING_USER_PROFILE,
      payload,
    };
  },
  setUserProfile: (payload: any[]) => {
    return {
      type: menuTypes.SET_USER_PROFILE,
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
