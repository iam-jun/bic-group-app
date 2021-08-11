import {IUser} from '~/interfaces/IAuth';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {ICreateRoomReq} from '~/interfaces/IChatHttpRequest';
import {ISocketEvent} from '~/interfaces/ISocket';
import * as Actions from './constants';

const getData = (dataType: string, payload?: any, field?: string) => ({
  type: Actions.GET_DATA,
  dataType,
  payload,
  field,
});

const setData = (dataType: string, payload: []) => ({
  type: Actions.SET_DATA,
  payload,
  dataType,
});

const setExtraData = (dataType: string, payload: []) => ({
  type: Actions.SET_EXTRA_DATA,
  payload,
  dataType,
});

const mergeExtraData = (dataType: string) => ({
  type: Actions.MERGE_EXTRA_DATA,
  dataType,
});

const resetData = (dataType: string) => ({
  type: Actions.RESET_DATA,
  dataType,
});

const getConversationDetail = (payload: string) => ({
  type: Actions.GET_CONVERSATION_DETAIL,
  payload,
});

const setConversationDetail = (payload: IConversation) => ({
  type: Actions.SET_CONVERSATION_DETAIL,
  payload,
});

const getGroupRols = () => ({
  type: Actions.GET_GROUP_ROLES,
});

const setGroupRoles = (payload: IUser[]) => ({
  type: Actions.SET_GROUP_ROLES,
  payload,
});

const getSubscriptions = () => ({
  type: Actions.GET_SUBSCRIPTIONS,
});

const setSubscriptions = (payload: IConversation[]) => ({
  type: Actions.SET_SUBSCRIPTIONS,
  payload,
});

const readSubcriptions = (payload: string) => ({
  type: Actions.READ_SUBCRIPTIONS,
  payload,
});

const selectConversation = (payload: IConversation) => ({
  type: Actions.SELECT_CONVERSATION,
  payload,
});

const handleEvent = (payload: ISocketEvent) => ({
  type: Actions.HANDLE_EVENT,
  payload,
});

const sendMessage = (payload: IMessage) => ({
  type: Actions.SEND_MESSAGE,
  payload,
});

const sendMessageSuccess = (payload: IMessage) => ({
  type: Actions.SEND_MESSAGE_SUCCESS,
  payload,
});

const retrySendMessage = (payload: IMessage) => ({
  type: Actions.RETRY_SEND_MESSAGE,
  payload,
});

const sendMessageFailed = (payload: IMessage) => ({
  type: Actions.SEND_MESSAGE_FAILED,
  payload,
});

const reactMessage = (message?: IMessage, reactionType?: string) => ({
  type: Actions.REACT_MESSAGE,
  message,
  reactionType,
});

const selectUser = (payload: IUser) => ({
  type: Actions.SELECT_USER,
  payload,
});

const clearSelectedUsers = () => ({
  type: Actions.CLEAR_SELECTED_USERS,
});

const createConversation = (payload: ICreateRoomReq) => ({
  type: Actions.CREATE_CONVERSATION,
  payload,
});

const createConversationSuccess = (payload: IConversation) => ({
  type: Actions.CREATE_CONVERSATION_SUCCESS,
  payload,
});

const addNewMessage = (payload: IMessage) => ({
  type: Actions.ADD_NEW_MESSAGE,
  payload,
});

export default {
  getData,
  setData,
  setExtraData,
  mergeExtraData,
  resetData,
  getConversationDetail,
  setConversationDetail,
  getGroupRols,
  setGroupRoles,
  getSubscriptions,
  setSubscriptions,
  readSubcriptions,
  handleEvent,
  selectConversation,
  sendMessage,
  sendMessageSuccess,
  sendMessageFailed,
  retrySendMessage,
  reactMessage,
  selectUser,
  clearSelectedUsers,
  createConversation,
  createConversationSuccess,
  addNewMessage,
};
