import * as actions from './constants';

export const modalInitState = {
  loaded: false,
  modal: {
    isOpen: false,
    ContentComponent: undefined,
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
    visible: false,
    title: '',
    position: { x: -1, y: -1 },
    callback: undefined,
  },

  bottomList: {
    isOpen: false,
    data: [],
  },
};

function commonReducer(
  state = modalInitState, action: any = {},
) {
  const { type, payload } = action;
  switch (type) {
    case actions.SET_MODAL:
      return {
        ...state,
        modal: payload,
      };
    case actions.HIDE_MODAL:
      return {
        ...state,
        modal: modalInitState.modal,
      };

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
        reactionDetailBottomSheet: modalInitState.reactionDetailBottomSheet,
      };

    case actions.SET_SHOW_REACTION_BOTTOM_SHEET:
      return {
        ...state,
        reactionBottomSheet: payload || modalInitState.reactionBottomSheet,
      };
    case actions.SET_BOTTOM_LIST:
      return {
        ...state,
        bottomList: payload,
      };
    case actions.HIDE_BOTTOM_LIST:
      return {
        ...state,
        bottomList: {
          isOpen: false,
          data: [],
        },
      };
    default:
      return state;
  }
}
export default commonReducer;
