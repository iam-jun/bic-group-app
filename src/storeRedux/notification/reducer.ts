import notificationsTypes from '~/storeRedux/notification/types';

export const notiInitState = {
  pushToken: '',
};

function notificationsReducer(
  state = notiInitState, action: any = {},
) {
  const { type, payload } = action;
  switch (type) {
    case notificationsTypes.SAVE_PUSH_TOKEN: {
      return {
        ...state,
        pushToken: payload,
      };
    }

    default:
      return state;
  }
}

export default notificationsReducer;
