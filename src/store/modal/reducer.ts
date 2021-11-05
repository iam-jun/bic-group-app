import * as actions from './constants';

export const initState = {
  loaded: false,
  modal: {
    isOpen: false,
    ContentComponent: undefined,
  },
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
    style: {},
    stretchOnWeb: false,
    children: null,
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

  reactionBottomSheet: {
    show: false,
    title: '',
    position: {x: -1, y: -1},
    callback: undefined,
  },

  userProfilePreview: {
    isOpen: false,
    userId: undefined,
    params: {},
    position: {x: -1, y: -1},
  },
};

function commonReducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case actions.SET_MODAL:
      return {
        ...state,
        modal: payload,
      };
    case actions.HIDE_MODAL:
      return {
        ...state,
        modal: initState.modal,
      };
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

    case actions.SET_SHOW_REACTION_BOTTOM_SHEET:
      return {
        ...state,
        reactionBottomSheet: payload || initState.reactionBottomSheet,
      };
    case actions.SET_USER_PROFILE_PREVIEW_BOTTOM_SHEET:
      return {
        ...state,
        userProfilePreview: payload || initState.userProfilePreview,
      };
    default:
      return state;
  }
}
export default commonReducer;
