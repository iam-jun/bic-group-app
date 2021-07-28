import appConfig from '~/configs/appConfig';
import * as types from './constants';
import {IConversation, IMessage, IReaction} from '~/interfaces/IChat';

export const initState = {
  conversations: {
    loading: false,
    data: new Array<IConversation>(),
  },
  conversation: {},
  messages: {
    loading: false,
    data: new Array<IMessage>(),
    extra: new Array<IMessage>(),
    lastDate: null,
    canLoadMore: true,
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
        messages: initState.messages,
      };
    case types.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loading: false,
          data: action.payload,
          lastDate:
            action.payload.length > 1
              ? action.payload[action.payload.length - 1]._updatedAt
              : messages.lastDate,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.SET_EXTRA_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loading: false,
          extra: action.payload,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.MERGE_EXTRA_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loading: false,
          data: [...messages.data, ...messages.extra],
          extra: [],
          lastDate:
            messages.extra.length > 1
              ? messages.extra[messages.extra.length - 1]._updatedAt
              : messages.lastDate,
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
            message._id === action.message._id
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
