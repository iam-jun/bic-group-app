import menuTypes from './types';

const initMenuState = {
  loadingUserProfile: false,
  userProfile: {},
};

const menuReducer = (state = initMenuState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case menuTypes.SET_LOADING_USER_PROFILE:
      return {
        ...state,
        loadingUserProfile: payload,
      };

    case menuTypes.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: payload || {},
      };

    default:
      return state;
  }
};

export default menuReducer;
