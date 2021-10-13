import i18next from 'i18next';
import appConfig from '~/configs/appConfig';
import {messageEventTypes, messageStatus} from '~/constants/chat';
import {IUser} from '~/interfaces/IAuth';
import {IChatUser, IConversation, IMessage} from '~/interfaces/IChat';
import types from './constants';

export const initDataState = {
  rooms: {
    loading: false,
    data: [],
    extra: [],
    searchResult: [],
    offset: 0,
    canLoadMore: true,
  },
  users: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
  joinableUsers: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
  members: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
  messages: {
    loading: false,
    loadingNext: false,
    data: [],
    extra: [],
    offset: -1,
    downOffset: 0,
    canLoadMore: true,
    canLoadNext: false,
    unreadMessage: null,
    jumpedMessage: null,
  },
};

export interface IAction {
  type?: string;
  dataType: keyof typeof initDataState;
  payload?: any;
  reset?: boolean;
  field?: string;
}

const initState = {
  ...initDataState,
  conversation: {} as IConversation,
  attachmentMedia: [],
  selectedUsers: new Array<IChatUser>(),
  roles: {
    loading: false,
    data: [],
  },
  subscriptions: [],
  mention: {
    mentionKey: '',
    mentionUsers: [],
  },
  searchInputFocus: '',
  hoverMessage: null,
  quotedMessages: {},
};

/**
 * Chat reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: IAction = {dataType: 'rooms'}) {
  const {type, dataType, payload} = action;
  const {rooms, conversation, messages, selectedUsers, quotedMessages} = state;

  switch (type) {
    case types.GET_DATA:
      return {
        ...state,
        [dataType]: {
          ...state[dataType],
          loading: state[dataType].data.length === 0,
          params: payload,
        },
      };
    case types.SET_DATA:
      return {
        ...state,
        [dataType]: {
          ...state[dataType],
          loading: false,
          data: payload,
          offset: state[dataType].offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case types.SET_EXTRA_DATA:
      return {
        ...state,
        [dataType]: {
          ...state[dataType],
          extra: payload,
          offset: state[dataType].offset + payload.length,
          canLoadMore: payload.length === appConfig.recordsPerPage,
        },
      };
    case types.MERGE_EXTRA_DATA:
      return {
        ...state,
        [dataType]: {
          ...state[dataType],
          data: [...state[dataType].data, ...state[dataType].extra],
          extra: [],
        },
      };
    case types.RESET_DATA:
      return {
        ...state,
        [dataType]: initDataState[dataType],
      };
    case types.GET_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          loading: messages.data.length === 0,
        },
      };
    case types.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          data: payload,
          loading: false,
          canLoadMore: payload.length >= appConfig.messagesPerPage,
        },
      };
    case types.SET_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          extra: payload,
          canLoadMore: payload.length >= appConfig.messagesPerPage,
        },
      };
    case types.MERGE_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          data: [...messages.extra, ...messages.data],
          extra: [],
        },
      };
    case types.GET_NEXT_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loadingNext: true,
        },
      };
    case types.SET_NEXT_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          loadingNext: false,
          data: [...messages.data, ...payload],
          canLoadNext: payload.length === appConfig.messagesPerPage,
        },
      };
    case types.GET_SURROUNDING_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          canLoadNext: true,
          loading: true,
        },
      };
    case types.SET_UNREAD_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          unreadMessage: payload,
        },
      };
    case types.SET_JUMPED_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          jumpedMessage: payload,
        },
      };
    case types.READ_CONVERSATION:
      return {
        ...state,
        conversation: {
          ...conversation,
          unreadCount: 0,
        },
        messages: {
          ...messages,
          unreadMessage: null,
        },
      };
    case types.SEARCH_CONVERSATIONS:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          searchResult: !payload
            ? rooms.data
            : rooms.data.filter((item: IConversation) =>
                item.name.toLowerCase().includes(payload.toLowerCase()),
              ),
        },
      };
    case types.GET_GROUP_ROLES:
      return {
        ...state,
        conversation: conversation?._id ? conversation : {_id: payload},
        roles: {
          ...state.roles,
          loading: true,
        },
      };
    case types.SET_GROUP_ROLES:
      return {
        ...state,
        roles: {
          ...state.roles,
          loading: false,
          data: action.payload,
        },
      };
    // case types.GET_SUBSCRIPTIONS:
    //   return {
    //     ...state,
    //     conversation: initState.conversation,
    //   };
    case types.SET_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: action.payload,
      };
    case types.READ_SUBCRIPTIONS:
      return {
        ...state,
        subscriptions: state.subscriptions.map((sub: any) =>
          sub.rid === action.payload ? {...sub, unread: 0} : sub,
        ),
      };
    case types.SET_CONVERSATION_DETAIL:
      return {
        ...state,
        conversation: {
          ...conversation,
          ...payload,
        },
      };
    case types.SET_ATTACHMENT_MEDIA:
      return {
        ...state,
        attachmentMedia: payload || [],
      };
    case types.ADD_NEW_MESSAGE: {
      const include = messages.data.find(
        (item: IMessage) =>
          item._id === action.payload._id ||
          (item.localId && item.localId === action.payload.localId),
      );

      const haveUnreadMessages =
        messages.unreadMessage &&
        conversation.unreadCount > appConfig.messagesPerPage;

      const newMessages =
        !haveUnreadMessages && !include
          ? [...messages.data, {...payload, status: messageStatus.SENT}]
          : messages.data.map((item: IMessage) =>
              item._id === action.payload._id ||
              (item.localId && item.localId === action.payload.localId)
                ? {...item, ...payload}
                : item,
            );

      return {
        ...state,
        messages:
          action.payload.room_id === conversation._id
            ? {
                ...messages,
                // Update offset when add new item
                offset: messages.offset + 1,
                data: newMessages,
              }
            : messages,
        rooms: payload.system
          ? state.rooms
          : {
              ...rooms,
              data: rooms.data.map((item: any) =>
                item._id === action.payload.room_id
                  ? {
                      ...item,
                      lastMessage: action.payload.msg,
                      _updatedAt: action.payload._updatedAt,
                    }
                  : item,
              ),
            },
        conversation: {
          ...conversation,
          unreadCount: conversation.unreadCount + 1,
        },
        subscriptions:
          action.payload.room_id !== conversation._id
            ? state.subscriptions.map((sub: any) =>
                sub.rid === action.payload.room_id && action.payload.unread
                  ? {...sub, unread: sub.unread + 1}
                  : sub,
              )
            : state.subscriptions,
        //@ts-ignore
        quotedMessages: quotedMessages[payload._id]
          ? {
              ...quotedMessages,
              [payload._id]: {
                //@ts-ignore
                ...quotedMessages[payload._id],
                ...payload,
              },
            }
          : quotedMessages,
      };
    }
    case types.SELECT_USER:
      return {
        ...state,
        selectedUsers: !action.payload.selected
          ? [...selectedUsers, {...action.payload, selected: true}]
          : selectedUsers.filter(user => user._id !== action.payload._id),
        [action.field || 'users']: {
          // @ts-ignore
          ...state[action.field || 'users'],
          // @ts-ignore
          data: state[action.field || 'users'].data.map((item: IChatUser) =>
            item._id === action.payload._id
              ? {
                  ...item,
                  selected: !item.selected,
                }
              : item,
          ),
        },
      };
    case types.CLEAR_SELECTED_USERS:
      return {
        ...state,
        selectedUsers: [],
      };
    case types.CREATE_CONVERSATION_SUCCESS:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: [action.payload, ...rooms.data],
        },
      };
    case types.EDIT_MESSAGE: {
      const editingMsgInd = messages.data.findIndex(
        (msg: IMessage) => msg._id === action.payload._id,
      );
      const newEditedMsgList: IMessage[] = [...messages.data];
      newEditedMsgList[editingMsgInd] = action.payload;

      return {
        ...state,
        messages: {
          ...messages,
          data: [...newEditedMsgList],
        },
      };
    }
    case types.UPLOAD_FILE:
    case types.SEND_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          data: [
            ...messages.data,
            {
              ...payload,
              status: messageStatus.SENDING,
            },
          ],
        },
        quotedMessages: payload.quotedMessage
          ? {
              ...state.quotedMessages,
              [payload.quotedMessage._id]: payload.quotedMessage,
            }
          : state.quotedMessages,
      };
    case types.RETRY_SEND_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          data: messages.data.map((item: IMessage) =>
            item._id === action.payload._id ||
            (item.localId && item.localId === action.payload.localId)
              ? {
                  ...action.payload,
                  status: messageStatus.SENDING,
                }
              : item,
          ),
        },
      };
    case types.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: {
          ...messages,
          // Update offset when add new item
          offset: messages.offset + 1,
          data: messages.data.map((item: IMessage) =>
            (item._id === action.payload._id ||
              (item.localId && item.localId === action.payload.localId)) &&
            // message has updated from event
            item.status !== messageStatus.SENT
              ? {
                  ...action.payload,
                  status: messageStatus.SENT,
                }
              : item,
          ),
        },
      };
    case types.SEND_MESSAGE_FAILED:
      return {
        ...state,
        messages: {
          ...messages,
          data: messages.data.map((item: IMessage) =>
            item._id === action.payload._id ||
            (item.localId && item.localId === action.payload.localId)
              ? {
                  ...item,
                  status: messageStatus.FAILED,
                }
              : item,
          ),
        },
      };
    case types.DELETE_MESSAGE_SUCCESS:
    case types.DELETE_MESSAGE: {
      return {
        ...state,
        messages: {
          ...messages,
          data: messages.data.map((item: IMessage) =>
            item._id === action.payload._id
              ? {
                  ...item,
                  type: messageEventTypes.REMOVE_MESSAGE,
                  removed: true,
                  text: i18next.t('chat:system_message:rm:me'),
                }
              : item,
          ),
        },
      };
    }
    case types.UPDATE_CONVERSATION_NAME:
      return {
        ...state,
        conversation: {
          ...state.conversation,
          name: action.payload,
        },
        rooms: {
          ...state.rooms,
          data: state.rooms.data.map((item: IConversation) =>
            item._id === conversation._id
              ? {...item, name: action.payload}
              : item,
          ),
        },
      };
    case types.REMOVE_MEMBER_SUCCESS:
      return {
        ...state,
        members: {
          ...state.members,
          data: state.members.data.filter(
            (member: IUser) => member.username !== payload.msg,
          ),
        },
        conversation: {
          ...conversation,
          usersCount: conversation.usersCount - 1,
        },
      };
    case types.ADD_MEMBERS_TO_GROUP_SUCCESS:
      return {
        ...state,
        conversation: {
          ...conversation,
          usersCount: conversation.usersCount + payload,
        },
      };
    case types.KICK_ME_OUT:
      return {
        ...state,
        rooms: {
          ...state.rooms,
          data: state.rooms.data.filter(
            (group: IConversation) => group._id !== payload.rid,
          ),
        },
      };
    case types.SET_MESSAGE_DETAIL:
      return {
        ...state,
        quotedMessages: {
          ...state.quotedMessages,
          [payload._id]: payload,
        },
      };
    default:
      return state;
  }
}
export default reducer;
