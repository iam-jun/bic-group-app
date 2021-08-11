import menuTypes from './types';

const initMenuState = {
  loadingUserProfile: false,
  isLanguageModalOpen: false,
  userProfile: {},
  selectedProfile: {},
};

const menuReducer = (state = initMenuState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case menuTypes.SELECT_USER_PROFILE:
    case menuTypes.SET_USER_PROFILE:
      return {
        ...state,
        loadingUserProfile: false,
        userProfile: {
          ...state.userProfile,
          ...payload,
        },
      };

    case menuTypes.GET_USER_PROFILE:
      return {
        ...state,
        loadingUserProfile: true,
      };

    case menuTypes.SET_LANGUAGE_MODAL_OPEN:
      return {
        ...state,
        isLanguageModalOpen: payload,
      };

    default:
      return state;
  }
};

export default menuReducer;
