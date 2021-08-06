import * as Actions from './constants';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IUser} from '~/interfaces/IAuth';
import {ICreateRoomReq} from '~/interfaces/IHttpRequest';

const getData = (dataType: string, payload?: any) => ({
  type: Actions.GET_DATA,
  dataType,
  payload,
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
