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

const reactMessage = (message?: IMessage, reactionType?: string) => ({
  type: Actions.REACT_MESSAGE,
  message,
  reactionType,
});

const selectUser = (payload: IUser) => ({
  type: Actions.SELECT_USER,
  payload,
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
  handleEvent,
  selectConversation,
  sendMessage,
  reactMessage,
  selectUser,
  createConversation,
  createConversationSuccess,
  addNewMessage,
};
