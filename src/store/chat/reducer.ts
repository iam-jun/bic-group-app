import * as types from './constants';

export const initState = {
  conversation: {},
  messages: [],
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: any = {}) {
  const {type} = action;
  const {conversation, messages} = state;

  switch (type) {
    case types.SELECT_CONVERSATION:
      return {
        ...state,
        conversation: {
          ...conversation,
          ...action.payload,
        },
      };
    case types.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
      };
    case types.SEND_MESSAGE:
      return {
        ...state,
        messages: [
          {
            ...action.payload,
            pending: true,
          },
          ...messages,
        ],
      };
    default:
      return state;
  }
}
export default reducer;
