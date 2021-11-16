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
    data: new Array<string>(),
    items: {} as IObject<IConversation>,
  },
  roles: {
    loading: false,
    data: [],
  },
  subscriptions: {} as IObject<any>,
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
        ...state,
        rooms: {
          ...rooms,
          ...payload,
          loading: false,
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
            loadingMore: messages?.[payload]?.data?.length > 0,
          },
        },
      };
    case types.SET_MESSAGES_HISTORY:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.roomId]: {
            ...messages?.[payload.roomId],
            loading: false,
            loadingMore: false,
            data: messages?.[payload.roomId]?.data
              ? [...payload.messageIds, ...messages?.[payload.roomId]?.data]
              : payload.messageIds,
            items: {
              ...messages?.[payload.roomId]?.items,
              ...payload.messagesData,
            },
            canLoadMore: payload.messageIds.length >= appConfig.messagesPerPage,
          },
        },
      };
    case types.GET_NEXT_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {
            ...messages?.[payload],
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
            ...messages?.[payload.roomId],
            loadingNext: false,
            data: messages?.[payload.roomId]?.data
              ? [...messages?.[payload.roomId]?.data, ...payload.messageIds]
              : payload.messageIds,
            items: {
              ...messages?.[payload.roomId]?.items,
              ...payload.messagesData,
            },
            canLoadNext:
              payload.messageIds.length === appConfig.messagesPerPage,
          },
        },
      };
    case types.RESET_ROOM_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: {},
        },
      };
    case types.CLEAR_ROOM_MESSAGES: {
      // keep only first 25 messages
      let roomMessages = {};
      if (!messages?.[payload]?.canLoadNext) {
        const messageData = messages?.[payload]?.data;
        const data =
          messageData?.length <= appConfig.messagesPerPage
            ? messageData
            : messageData?.slice(
                messageData.length - appConfig.messagesPerPage,
                messageData.length,
              );
        const items: any = {};
        data?.forEach((id: string) => {
          items[id] = messages?.[payload]?.items[id];
          roomMessages = {...messages?.[payload], loading: false, data, items};
        });
      }
      return {
        ...state,
        messages: {
          ...messages,
          [payload]: roomMessages,
        },
      };
    }
    case types.GET_SURROUNDING_MESSAGES:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.roomId]: {
            ...messages?.[payload.roomId],
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
            ...messages?.[payload.roomId],
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
        unreadMessage: null,
      };
    case types.GET_GROUP_ROLES:
      return {
        ...state,
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
        subscriptions: {
          ...subscriptions,
          [payload]: {...subscriptions[payload], unread: 0},
        },
      };
    case types.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: {
          ...subscriptions,
          [payload.rid]: {...subscriptions[payload], ...payload},
        },
      };
    case types.SET_CONVERSATION_DETAIL: {
      return {
        ...state,
        rooms: {
          ...rooms,
          items: {
            ...rooms.items,
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
          items: {
            ...rooms.items,
            [payload._id]: {
              ...rooms.items[payload._id],
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
          items: {
            ...rooms.items,
            [payload._id]: {
              ...rooms.items[payload._id],
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
          [payload.room_id]: messages?.[payload.room_id]
            ? {
                ...messages?.[payload.room_id],
                data: messages?.[payload.room_id]?.data
                  ? [...messages?.[payload.room_id]?.data, payload._id]
                  : [payload._id],
                items: {
                  ...messages?.[payload.room_id]?.items,
                  [payload._id]: payload,
                },
              }
            : messages?.[payload.room_id],
        },
        rooms: payload.system
          ? rooms
          : {
              ...rooms,
              items: {
                ...rooms.items,
                [payload.room_id]: {
                  ...rooms.items[payload.room_id],
                  lastMessage: payload.lastMessage,
                  _updatedAt: payload.createAt,
                },
              },
            },
        quotedMessages: quotedMessages?.[payload._id]
          ? {
              ...quotedMessages,
              [payload._id]: {
                ...quotedMessages?.[payload._id],
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
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id].items,
              [id]: payload,
            },
          },
        },
        quotedMessages: quotedMessages?.[payload._id]
          ? {
              ...quotedMessages,
              [payload._id]: payload,
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
          data: !rooms.data.includes(payload._id)
            ? [payload._id, ...rooms.data]
            : rooms.data,
          items: {
            [payload._id]: {
              ...payload,
              msgs: 0, // do not get message
            },
            ...rooms.items,
          },
        },
      };
    case types.EDIT_MESSAGE:
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id]?.items,
              [payload._id]: payload,
            },
          },
        },
      };
    case types.UPLOAD_FILE:
    case types.SEND_MESSAGE: {
      const id = payload._id || payload.localId;
      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages?.[payload.room_id],
            data: messages?.[payload.room_id]?.data
              ? [...messages?.[payload.room_id]?.data, id]
              : [id],
            items: {
              ...messages?.[payload.room_id]?.items,
              [id]: {
                ...payload,
                user: {
                  ...payload.user,
                  name: payload.user.name || payload.user.fullname,
                },
                status: messageStatus.SENDING,
              },
            },
          },
        },
        rooms: {
          ...rooms,
          items: {
            ...rooms.items,
            [payload.room_id]: {
              ...rooms.items[payload.room_id],
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
    }
    case types.RETRY_SEND_MESSAGE:
      if (!payload._id || !payload.localId) return state;

      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id]?.items,
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
      if (!payload._id || !payload.localId) return state;

      return {
        ...state,
        messages: {
          ...messages,
          [payload.room_id]: {
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id]?.items,
              [payload._id || payload.localId]: {
                ...payload,
                status: messageStatus.SENT,
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
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id]?.items,
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
            ...messages?.[payload.room_id],
            items: {
              ...messages?.[payload.room_id]?.items,
              [payload._id]: {
                ...messages?.[payload.room_id]?.items?.[payload._id],
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
          items: {
            ...rooms.items,
            [payload.roomId]: {
              ...rooms.items[payload.roomId],
              name: payload.name,
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
          items: {
            ...rooms.items,
            [payload._id]: {
              ...rooms.items[payload._id],
              usersCount: rooms.items[payload._id]?.usersCount - 1,
            },
          },
        },
      };
    case types.ADD_MEMBERS_TO_GROUP_SUCCESS: {
      const id = payload._id || payload.rid;
      return {
        ...state,
        rooms: {
          ...rooms,
          items: {
            ...rooms.items,
            [id]: {
              ...rooms.items[id],
              usersCount: rooms.items[id]?.usersCount + 1,
            },
          },
        },
      };
    }
    case types.LEAVE_CHAT:
    case types.KICK_ME_OUT: {
      const _rooms = rooms.data;
      delete _rooms[payload._id];
      return {
        ...state,
        rooms: {
          ...rooms,
          data: rooms.data.filter((id: string) => id !== payload._id),
          items: _rooms,
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
