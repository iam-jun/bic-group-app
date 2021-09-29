import {
  IChatUser,
  IConversation,
  IMessage,
  IPayloadReactMessage,
  ISendMessageAction,
  IUploadFileAction,
} from '~/interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';
import * as Actions from './constants';

const initChat = () => ({
  type: Actions.INIT_CHAT,
});

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

const searchConversation = (payload: string) => ({
  type: Actions.SEARCH_CONVERSATIONS,
  payload,
});

const getGroupRoles = (payload: string) => ({
  type: Actions.GET_GROUP_ROLES,
  payload,
});

const setGroupRoles = (payload: IChatUser[]) => ({
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

const readSubscriptions = (payload: string) => ({
  type: Actions.READ_SUBCRIPTIONS,
  payload,
});

const handleEvent = (payload: ISocketEvent) => ({
  type: Actions.HANDLE_EVENT,
  payload,
});

const sendMessage = (payload: ISendMessageAction) => ({
  type: Actions.SEND_MESSAGE,
  payload,
});

const editMessage = (payload: IMessage) => ({
  type: Actions.EDIT_MESSAGE,
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

const reactMessage = (payload: IPayloadReactMessage) => ({
  type: Actions.REACT_MESSAGE,
  payload,
});

const deleteMessage = (payload: IMessage) => ({
  type: Actions.DELETE_MESSAGE,
  payload,
});

const deleteMessageSuccess = (payload: IMessage) => ({
  type: Actions.DELETE_MESSAGE_SUCCESS,
  payload,
});

const selectUser = (payload: IChatUser) => ({
  type: Actions.SELECT_USER,
  payload,
});

const clearSelectedUsers = () => ({
  type: Actions.CLEAR_SELECTED_USERS,
});

const createConversation = (
  payload: IChatUser[],
  hideConfirmation?: boolean,
  callBack?: (roomId: string) => void,
) => ({
  type: Actions.CREATE_CONVERSATION,
  payload,
  hideConfirmation,
  callBack,
});

const createConversationSuccess = (payload: IConversation) => ({
  type: Actions.CREATE_CONVERSATION_SUCCESS,
  payload,
});

const addNewMessage = (payload: IMessage) => ({
  type: Actions.ADD_NEW_MESSAGE,
  payload,
});

const updateConversationName = (payload: string) => ({
  type: Actions.UPDATE_CONVERSATION_NAME,
  payload,
});

const uploadFile = (payload: IUploadFileAction) => ({
  type: Actions.UPLOAD_FILE,
  payload,
});

const addMembersToGroup = (payload: number[]) => ({
  type: Actions.ADD_MEMBERS_TO_GROUP,
  payload,
});

const removeMember = (payload: IChatUser) => ({
  type: Actions.REMOVE_MEMBER,
  payload,
});

const removeMemberSuccess = (payload: IMessage) => ({
  type: Actions.REMOVE_MEMBER_SUCCESS,
  payload,
});

const kickMeOut = (payload: IMessage) => ({
  type: Actions.KICK_ME_OUT,
  payload,
});

const getMoreDownMessages = (payload: {offset: number; count: number}) => ({
  type: Actions.GET_MORE_DOWN_MESSAGES,
  payload,
});

const setMoreDownMessages = (payload: any) => ({
  type: Actions.SET_MORE_DOWN_MESSAGES,
  payload,
});

const setExtraDownMessages = () => ({
  type: Actions.SET_EXTRA_DOWN_MESSAGES,
});

const mergeExtraDownMessages = () => ({
  type: Actions.MERGE_EXTRA_DOWN_MESSAGES,
});

const readConversation = () => ({
  type: Actions.READ_CONVERSATION,
});

const getMessageDetail = (payload: string) => ({
  type: Actions.GET_MESSAGE_DETAIL,
  payload,
});

const setMessageDetail = (payload: IMessage) => ({
  type: Actions.SET_MESSAGE_DETAIL,
  payload,
});

export default {
  initChat,
  getData,
  setData,
  setExtraData,
  mergeExtraData,
  resetData,
  getConversationDetail,
  setConversationDetail,
  searchConversation,
  getGroupRoles,
  setGroupRoles,
  getSubscriptions,
  setSubscriptions,
  readSubscriptions,
  handleEvent,
  sendMessage,
  editMessage,
  sendMessageSuccess,
  sendMessageFailed,
  retrySendMessage,
  reactMessage,
  deleteMessage,
  deleteMessageSuccess,
  selectUser,
  clearSelectedUsers,
  createConversation,
  createConversationSuccess,
  addNewMessage,
  updateConversationName,
  uploadFile,
  addMembersToGroup,
  removeMember,
  removeMemberSuccess,
  kickMeOut,
  getMoreDownMessages,
  setMoreDownMessages,
  setExtraDownMessages,
  mergeExtraDownMessages,
  readConversation,
  getMessageDetail,
  setMessageDetail,
};
