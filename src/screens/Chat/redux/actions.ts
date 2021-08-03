import * as Actions from './constants';
import {IConversation, IMessage} from '~/interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';
import {IUser} from '~/interfaces/IAuth';
import {ICreateRoomReq} from '~/interfaces/IHttpRequest';

const getConversations = () => ({
  type: Actions.GET_CONVERSATIONS,
});

const setConversations = (payload: IConversation[]) => ({
  type: Actions.SET_CONVERSATIONS,
  payload,
});

const setExtraConversations = (payload: IConversation[]) => ({
  type: Actions.SET_EXTRA_CONVERSATIONS,
  payload,
});

const mergeExtraConversations = () => ({
  type: Actions.MERGE_EXTRA_CONVERSATIONS,
});

const selectConversation = (payload: IConversation) => ({
  type: Actions.SELECT_CONVERSATION,
  payload,
});

const handleEvent = (payload: ISocketEvent) => ({
  type: Actions.HANDLE_EVENT,
  payload,
});

const getMessages = () => ({
  type: Actions.GET_MESSAGES,
});

const setExtraMessages = (payload: IMessage[]) => ({
  type: Actions.SET_EXTRA_MESSAGES,
  payload,
});

const mergeExtraMessages = () => ({
  type: Actions.MERGE_EXTRA_MESSAGES,
});

const setMessages = (payload: IMessage[]) => ({
  type: Actions.SET_MESSAGES,
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

const getUsers = () => ({
  type: Actions.GET_USERS,
});

const setUsers = (payload: IUser[]) => ({
  type: Actions.SET_USERS,
  payload,
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

const getRoomMembers = () => ({
  type: Actions.GET_ROOM_MEMBERS,
});

const setRoomMembers = (payload: IUser[]) => ({
  type: Actions.SET_ROOM_MEMBERS,
  payload,
});

const setExtraRoomMembers = (payload: IUser[]) => ({
  type: Actions.SET_EXTRA_CONVERSATIONS,
  payload,
});

const mergeExtraRoomMembers = () => ({
  type: Actions.MERGE_EXTRA_ROOM_MEMBERS,
});

export default {
  getConversations,
  handleEvent,
  setConversations,
  setExtraConversations,
  mergeExtraConversations,
  selectConversation,
  getMessages,
  setMessages,
  setExtraMessages,
  mergeExtraMessages,
  sendMessage,
  reactMessage,
  getUsers,
  setUsers,
  selectUser,
  createConversation,
  createConversationSuccess,
  addNewMessage,
  getRoomMembers,
  setRoomMembers,
  setExtraRoomMembers,
  mergeExtraRoomMembers,
};
