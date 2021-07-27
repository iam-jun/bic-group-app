import * as actions from './constants';

export const initState = {
  loaded: false,
  alert: {
    visible: false,
    title: '',
    content: '',
    cancelBtn: false,
    iconName: '',
    onConfirm: () => {},
    onCancel: () => {},
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
      const {title, content, iconName, onConfirm, cancelBtn, onCancel} =
        payload;
      return {
        ...state,
        alert: {
          visible: true,
          title,
          content,
          iconName,
          onConfirm,
          cancelBtn,
          onCancel,
        },
      };
    case actions.HIDE_ALERT:
      return initState;
    default:
      return state;
  }
}
export default commonReducer;
