import appConfig from '~/configs/appConfig';
import * as types from './constants';
import {IConversation, IMessage, IReaction} from '~/interfaces/IChat';
import {IUser} from '~/interfaces/IAuth';

export const initState = {
  conversations: {
    loading: false,
    data: new Array<IConversation>(),
    extra: new Array<IConversation>(),
    offset: 0,
    canLoadMore: true,
  },
  conversation: {} as IConversation,
  messages: {
    loading: false,
    data: new Array<IMessage>(),
    extra: new Array<IMessage>(),
    lastDate: null,
    canLoadMore: true,
  },
  users: new Array<IUser>(),
  members: {
    loading: false,
    data: new Array<IUser>(),
    extra: new Array<IUser>(),
    offset: 0,
    canLoadMore: true,
  },
  selectedUsers: new Array<IUser>(),
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: any = {}) {
  const {type} = action;
  const {conversations, conversation, messages, users, selectedUsers, members} =
    state;

  switch (type) {
    case types.GET_CONVERSATIONS:
      return {
        ...state,
        conversations: {
          ...conversations,
          loading: conversations.data.length === 0,
        },
      };
    case types.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: {
          ...conversations,
          loading: false,
          data: action.payload,
          offset: conversations.offset + action.payload.length,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.SET_EXTRA_CONVERSATIONS:
      return {
        ...state,
        conversations: {
          ...conversations,
          extra: action.payload,
          offset: conversations.offset + action.payload.length,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.MERGE_EXTRA_CONVERSATIONS:
      return {
        ...state,
        conversations: {
          ...conversations,
          data: [...conversations.data, ...conversations.extra],
          extra: [],
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
    case types.GET_USERS:
      return {
        ...state,
        users: [],
        selectedUsers: [],
      };
    case types.GET_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loading: true,
        },
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
    case types.ADD_NEW_MESSAGE:
      return {
        ...state,
        messages:
          action.payload.room_id === conversation._id
            ? {
                ...messages,
                data: [action.payload, ...messages.data],
              }
            : messages,
        conversations: {
          ...conversations,
          data: conversations.data.map((item: any) =>
            item._id === action.payload.room_id
              ? {
                  ...item,
                  lastMessage: action.payload.msg,
                  _updatedAt: action.payload._updatedAt,
                }
              : item,
          ),
        },
      };
    case types.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case types.SELECT_USER:
      return {
        ...state,
        selectedUsers: !action.payload.selected
          ? [...selectedUsers, {...action.payload, selected: true}]
          : selectedUsers.filter(user => user.id !== action.payload.id),
        users: users.map((item: IUser) =>
          item.id === action.payload.id
            ? {
                ...item,
                selected: !item.selected,
              }
            : item,
        ),
      };
    case types.CREATE_CONVERSATION_SUCCESS:
      return {
        ...state,
        conversations: {
          ...conversations,
          data: [action.payload, ...conversations.data],
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
    case types.GET_ROOM_MEMBERS:
      return {
        ...state,
        members: {
          ...members,
          loading: members.data.length === 0,
        },
      };
    case types.SET_ROOM_MEMBERS:
      return {
        ...state,
        members: {
          ...members,
          loading: false,
          data: action.payload,
          offset: members.offset + action.payload.length,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.SET_EXTRA_ROOM_MEMBERS:
      return {
        ...state,
        members: {
          ...members,
          extra: action.payload,
          offset: members.offset + action.payload.length,
          canLoadMore: action.payload.length === appConfig.recordsPerPage,
        },
      };
    case types.MERGE_EXTRA_ROOM_MEMBERS:
      return {
        ...state,
        members: {
          ...members,
          data: [...members.data, ...members.extra],
          extra: [],
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
