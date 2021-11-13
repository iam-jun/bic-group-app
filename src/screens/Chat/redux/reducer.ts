import i18next from 'i18next';
import appConfig from '~/configs/appConfig';
import {messageEventTypes, messageStatus} from '~/constants/chat';
import {IObject} from '~/interfaces/common';
import {IChatUser, IConversation, IMessage} from '~/interfaces/IChat';
import {getLastMessage} from '../helper';
import {IMessagesData} from './../../../interfaces/IChat';
import types from './constants';

export const initDataState = {
  users: {
    loading: false,
    data: new Array<IChatUser>(),
    extra: new Array<IChatUser>(),
    offset: 0,
    canLoadMore: true,
  },
  joinableUsers: {
    loading: false,
    data: new Array<IChatUser>(),
    extra: new Array<IChatUser>(),
    offset: 0,
    canLoadMore: true,
  },
  members: {
    loading: false,
    data: new Array<IChatUser>(),
    extra: new Array<IChatUser>(),
    offset: 0,
    canLoadMore: true,
  },
  search: {
    loading: false,
    data: new Array<IConversation>(),
    extra: new Array<IConversation>(),
    offset: 0,
    canLoadMore: true,
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
  attachmentMedia: [],
  selectedUsers: new Array<IChatUser>(),
  rooms: {
    loading: false,
    data: {} as IObject<IConversation>,
    extra: {} as IObject<IConversation>,
    searchResult: {},
    offset: 0,
    canLoadMore: true,
  },
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
  quotedMessages: {} as IObject<IMessage>,
  messages: {} as IObject<IMessagesData>,
  unreadMessage: null,
  jumpedMessage: null,
};

/**
 * Chat reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: IAction = {dataType: 'users'}) {
  const {type, dataType, payload} = action;
  const {
    rooms,
    messages,
    selectedUsers,
    quotedMessages,
    subscriptions,
    members,
    roles,
  } = state;

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
    case types.GET_ROOMS:
      return {
        ...state,
        rooms: {
          ...rooms,
          loading: true,
        },
      };
    case types.SET_ROOMS:
      return {
        rooms: {
          ...rooms,
          loading: false,
          data: payload,
        },
      };
    case types.GET_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {
            ...messages?.[payload],
            loading: !messages?.[payload],
          },
        },
      };
    case types.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.roomId]: {
            ...messages[payload.roomId],
            data: payload.messageIds,
            items: payload.messagesData,
            loading: false,
            canLoadMore: payload.length >= appConfig.messagesPerPage,
          },
        },
      };
    case types.SET_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          [payload._id]: {
            ...messages[payload.roomId],
            extra: payload.messageIds,
            items: {...messages[payload.roomId].items, ...payload.messagesData},
            canLoadMore: payload.length >= appConfig.messagesPerPage,
          },
        },
      };
    case types.MERGE_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {
            ...messages[payload],
            data: [...messages[payload].extra, ...messages[payload].data],
            extra: [],
          },
        },
      };
    case types.GET_NEXT_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {
            ...messages[payload],
            loadingNext: true,
          },
        },
      };
    case types.SET_NEXT_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.roomId]: {
            ...messages[payload.roomId],
            loadingNext: false,
            data: [...messages[payload.roomId].data, ...payload.messagesIds],
            items: {...messages[payload.roomId].items, ...payload.messagesIds},
            canLoadNext: payload.length === appConfig.messagesPerPage,
          },
        },
      };
    case types.GET_SURROUNDING_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {
            ...messages[payload],
            canLoadNext: true,
            loading: true,
          },
        },
      };
    case types.SET_MESSAGES_ERROR:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.roomId]: {
            ...messages[payload.roomId],
            error: payload.error,
          },
        },
      };
    case types.SET_UNREAD_MESSAGE:
      return {
        ...state,
        unreadMessage: payload,
      };
    case types.SET_JUMPED_MESSAGE:
      return {
        ...state,
        jumpedMessage: payload,
      };
    case types.READ_CONVERSATION:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            [payload]: {
              ...rooms.data[payload],
              unreadCount: 0,
            },
          },
        },
        unreadMessage: null,
      };
    case types.GET_GROUP_ROLES:
      return {
        ...state,
        // conversation: conversation?._id ? conversation : {_id: payload},

        roles: {
          ...roles,
          loading: true,
        },
      };
    case types.SET_GROUP_ROLES:
      return {
        ...state,
        roles: {
          ...roles,
          loading: false,
          data: payload,
        },
      };
    case types.SET_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: payload,
      };
    case types.READ_SUBCRIPTIONS:
      return {
        ...state,
        subscriptions: subscriptions?.map((sub: any) =>
          sub.rid === payload ? {...sub, unread: 0} : sub,
        ),
      };
    case types.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: subscriptions?.map((sub: any) =>
          sub.rid === payload.rid ? {...sub, ...payload} : sub,
        ),
      };
    case types.SET_CONVERSATION_DETAIL: {
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            [payload._id]: payload,
          },
        },
      };
    }
    case types.SET_CONVERSATION_NOTIFICATIONS: {
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            [payload._id]: {
              ...rooms.data[payload._id],
              disableNotifications: payload.disableNotifications,
            },
          },
        },
      };
    }
    case types.SET_UPDATED_CONVERSATION_DETAIL:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            [payload._id]: {
              ...rooms.data[payload._id],
              ...payload,
            },
          },
        },
      };
    case types.SET_ATTACHMENT_MEDIA:
      return {
        ...state,
        attachmentMedia: payload || [],
      };
    case types.ADD_NEW_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            data: [...messages[payload.room_id].data, payload],
          },
        },
        rooms: payload.system
          ? rooms
          : {
              ...rooms,
              data: {
                ...rooms.data,
                [payload.room_id]: {
                  ...rooms.data[payload.room_id],
                  lastMessage: payload.lastMessage,
                  _updatedAt: payload.createAt,
                },
              },
            },
        quotedMessages: quotedMessages[payload._id]
          ? {
              ...quotedMessages,
              [payload._id]: {
                ...quotedMessages[payload._id],
                ...payload,
              },
            }
          : quotedMessages,
      };
    case types.UPDATE_MESSAGE: {
      if (!payload._id || !payload.localId) return state;
      const id = payload._id || payload.localId;
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [id]: {
                ...messages[payload.room_id].items[id],
                ...payload,
              },
            },
          },
        },
        quotedMessages: quotedMessages[payload._id]
          ? {
              ...quotedMessages,
              [payload._id]: {
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
          data: {
            [payload._id]: payload,
            ...rooms.data,
          },
        },
      };
    case types.EDIT_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [payload._id]: payload,
            },
          },
        },
      };
    case types.UPLOAD_FILE:
    case types.SEND_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            data: [
              ...messages[payload.room_id].data,
              {
                ...payload,
                user: {
                  ...payload.user,
                  name: payload.user.name || payload.user.fullname,
                },
                status: messageStatus.SENDING,
              },
            ],
          },
        },
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            [payload.room_id]: {
              ...rooms.data[payload.room_id],
              lastMessage: getLastMessage(payload, true),
              _updatedAt: payload.createdAt,
            },
          },
        },
        quotedMessages: payload.quotedMessage
          ? {
              ...quotedMessages,
              [payload.quotedMessage._id]: payload.quotedMessage,
            }
          : quotedMessages,
      };
    case types.RETRY_SEND_MESSAGE:
      if (!payload._id || !payload.localId) return state;

      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [payload._id || payload.localId]: {
                ...payload,
                status: messageStatus.SENDING,
              },
            },
          },
        },
      };
    case types.SEND_MESSAGE_SUCCESS:
      // message has updated from event
      if (
        !payload._id ||
        !payload.localId ||
        messages[payload.room_id].items[payload._id].status ===
          messageStatus.SENT
      )
        return state;

      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [payload._id || payload.localId]: {
                ...payload,
                status: messageStatus.SENDING,
              },
            },
          },
        },
      };
    case types.SEND_MESSAGE_FAILED:
      if (!payload._id || !payload.localId) return state;
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [payload._id || payload.localId]: {
                ...payload,
                status: messageStatus.FAILED,
              },
            },
          },
        },
      };
    case types.DELETE_MESSAGE_SUCCESS:
    case types.DELETE_MESSAGE: {
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages[payload.room_id],
            items: {
              ...messages[payload.room_id].items,
              [payload._id]: {
                ...messages[payload.room_id].items?.[payload._id],
                type: messageEventTypes.REMOVE_MESSAGE,
                removed: true,
                text: i18next.t('chat:system_message:rm:me'),
              },
            },
          },
        },
      };
    }
    case types.UPDATE_CONVERSATION_NAME:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            // TODO: add id to payload
            [payload._id]: {
              ...rooms.data[payload._id],
              ...payload,
            },
          },
        },
      };
    case types.REMOVE_MEMBER_SUCCESS:
      /**
       * Only need to update roles, as the screen Chat/GroupMembers will reset members,
       * and fetch new list of members.
       */
      return {
        ...state,
        members: {
          ...members,
          data: members.data.filter(
            (member: IChatUser) => member.username !== payload.msg,
          ),
        },
        roles: {
          ...state.roles,
          data: state.roles.data.filter(
            (admin: IChatUser) => admin.username !== payload.msg,
          ),
        },
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            // TODO: add id to payload
            [payload._id]: {
              ...rooms.data[payload._id],
              usersCount: rooms.data[payload._id]?.usersCount - 1,
            },
          },
        },
      };
    case types.ADD_MEMBERS_TO_GROUP_SUCCESS:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            // TODO: add id to payload
            [payload._id]: {
              ...rooms.data[payload._id],
              usersCount: rooms.data[payload._id]?.usersCount + payload.count,
            },
          },
        },
      };
    case types.LEAVE_CHAT:
      return {
        ...state,
        rooms: {
          ...rooms,
          data: {
            ...rooms.data,
            // TODO: add id to payload
            [payload._id]: {
              ...rooms.data[payload._id],
              usersCount: rooms.data[payload._id]?.usersCount + payload.count,
            },
          },
        },
      };
    case types.KICK_ME_OUT: {
      const _rooms = rooms.data;
      delete _rooms[payload._id];
      return {
        ...state,
        rooms: {
          ...rooms,
          data: _rooms,
        },
      };
    }
    case types.SET_MESSAGE_DETAIL:
      return {
        ...state,
        quotedMessages: {
          ...quotedMessages,
          [payload._id]: payload,
        },
      };
    default:
      return state;
  }
}
export default reducer;
