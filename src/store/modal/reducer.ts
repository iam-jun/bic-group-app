import * as actions from './constants';

export const initState = {
  loaded: false,
  alert: {
    visible: false,
    title: '',
    content: '',
    cancelBtn: false,
    cancelLabel: '',
    iconName: '',
    confirmLabel: '',
    onConfirm: () => {
      // do something
    },
    onCancel: () => {
      // do something
    },
    isDismissible: true,
    showCloseButton: false,
  },
  alertNewFeature: {
    visible: false,
  },
  loading: {
    visible: false,
  },
  toastMessage: {
    content: '',
    props: {},
  },
  searchInputFocus: '',
  reactionDetailBottomSheet: {
    isOpen: false,
  },
};

/**
 * Common reducer
 * @param state
 * @param action
 * @returns {*}
 */
function commonReducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case actions.SHOW_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          ...payload,
          visible: true,
        },
      };

    case actions.HIDE_ALERT:
      return initState;

    case actions.SHOW_ALERT_NEW_FEATURE:
      return {
        ...state,
        alertNewFeature: {
          visible: true,
        },
      };

    case actions.HIDE_ALERT_NEW_FEATURE:
      return {
        ...state,
        alertNewFeature: {
          visible: false,
        },
      };

    case actions.SHOW_LOADING:
      return {
        ...state,
        loading: {
          visible: true,
        },
      };

    case actions.HIDE_LOADING:
      return {
        ...state,
        loading: {
          visible: false,
        },
      };

    case actions.SET_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: payload,
      };
    case actions.CLEAR_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: initState.toastMessage,
      };
    case actions.FOCUS_SEARCH_INPUT:
      return {
        ...state,
        searchInputFocus: payload,
      };
    case actions.SHOW_REACTION_DETAIL_BOTTOM_SHEET:
      return {
        ...state,
        reactionDetailBottomSheet: payload,
      };
    case actions.CLEAR_REACTION_DETAIL_BOTTOM_SHEET:
      return {
        ...state,
        reactionDetailBottomSheet: initState.reactionDetailBottomSheet,
      };
    default:
      return state;
  }
}
export default commonReducer;
