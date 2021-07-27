import * as types from './constants';
import {IMessage, IReaction} from '../../../interfaces/IChat';

export const initState = {
  conversations: {
    loading: false,
    data: [],
  },
  conversation: {},
  messages: {
    loading: false,
    data: [],
  },
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: any = {}) {
  const {type} = action;
  const {conversations, conversation, messages} = state;

  switch (type) {
    case types.SET_CONVERSATION_LOADING:
      return {
        ...state,
        conversation: {
          ...conversation,
          loading: true,
        },
      };
    case types.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: {
          ...conversations,
          loading: false,
          data: action.payload,
        },
      };
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
        messages: {
          ...messages,
          loading: false,
          data: action.payload,
        },
      };
    case types.SEND_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          data: [
            {
              ...action.payload,
              pending: true,
            },
            ...messages.data,
          ],
        },
      };
    case types.REACT_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          data: messages.data.map((message: IMessage) =>
            message.id === action.message.id
              ? {
                  ...message,
                  reactions: (message?.reactions || []).find(
                    item => item.type === action.reactionType,
                  )
                    ? (message.reactions || []).map((reaction: IReaction) =>
                        reaction.type === action.reactionType
                          ? {
                              ...reaction,
                              reacted: !reaction.reacted,
                              count: reaction.reacted // TODO: The count number should be return by API
                                ? reaction.count - 1
                                : reaction.count + 1,
                            }
                          : reaction,
                      )
                    : [
                        ...(message.reactions || []),
                        {
                          type: action.reactionType,
                          count: 1,
                          reacted: true,
                        },
                      ],
                }
              : message,
          ),
        },
      };
    default:
      return state;
  }
}
export default reducer;
