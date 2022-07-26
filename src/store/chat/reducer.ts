import actions from './constants';

export const initialChatState = {
  unreadChannels: {},
};

function reducer(state = initialChatState, action: any = {}) {
  const { type, payload } = action;
  switch (type) {
    case actions.SET_UNREAD_CHANNELS:
      return {
        ...state,
        unreadChannels: payload,
      };
    case actions.UPDATE_CHANNEL_NOTIFICATION_COUNT:
      return {
        ...state,
        unreadChannels: {
          ...state.unreadChannels,
          ...payload,
        },
      };
    default:
      return state;
  }
}
export default reducer;
