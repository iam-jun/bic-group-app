import * as actions from './constants';

export const initState = {
  loaded: false,
  alert: {
    visible: false,
    title: '',
    content: '',
    cancelBtn: false,
    iconName: '',
    confirmLabel: '',
    onConfirm: () => {},
    onCancel: () => {},
    isDismissable: true,
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
    default:
      return state;
  }
}
export default commonReducer;
