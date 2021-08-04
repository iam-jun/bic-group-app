import appConfig from '~/configs/appConfig';
import * as types from './constants';
import {IConversation, IMessage, IReaction} from '~/interfaces/IChat';
import {IUser} from '~/interfaces/IAuth';

export const initDataState = {
  groups: {
    loading: false,
    data: [],
    extra: [],
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
  members: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
  messages: {
    loading: false,
    data: [],
    extra: [],
    offset: 0,
    canLoadMore: true,
  },
};

export interface IAction {
  type?: string;
  dataType: keyof typeof initDataState;
  payload?: any;
  reset?: boolean;
}

const initState = {
  ...initDataState,
  conversation: {} as IConversation,
  selectedUsers: new Array<IUser>(),
};

/**
 * Chat reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: IAction = {dataType: 'groups'}) {
  const {type, dataType, payload} = action;
  const {groups, conversation, messages, users, selectedUsers} = state;

  switch (type) {
    case types.GET_DATA:
      return {
        ...state,
        [dataType]: {
          ...(action.reset ? initDataState[dataType] : state[dataType]),
          loading: state[dataType].data.length === 0,
          params: action.payload,
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
        groups: {
          ...groups,
          data: groups.data.map((item: any) =>
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
    case types.SELECT_USER:
      return {
        ...state,
        selectedUsers: !action.payload.selected
          ? [...selectedUsers, {...action.payload, selected: true}]
          : selectedUsers.filter(user => user._id !== action.payload._id),
        users: {
          ...users,
          data: users.data.map((item: IUser) =>
            item._id === action.payload._id
              ? {
                  ...item,
                  selected: !item.selected,
                }
              : item,
          ),
        },
      };
    case types.CREATE_CONVERSATION_SUCCESS:
      return {
        ...state,
        groups: {
          ...groups,
          data: [action.payload, ...groups.data],
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
