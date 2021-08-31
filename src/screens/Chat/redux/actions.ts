import {IUser} from '~/interfaces/IAuth';
import {
  IConversation,
  IMessage,
  ISendMessageAction,
  IUploadFileAction,
} from '~/interfaces/IChat';
import {
  IAddUsersToGroupReq,
  ICreateRoomReq,
} from '~/interfaces/IChatHttpRequest';
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

const sendMessage = (payload: ISendMessageAction) => ({
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

const updateConversationName = (payload: string) => ({
  type: Actions.UPDATE_CONVERSATION_NAME,
  payload,
});

const uploadFile = (payload: IUploadFileAction) => ({
  type: Actions.UPLOAD_FILE,
  payload,
});

const getChatPermissions = () => ({
  type: Actions.GET_CHAT_PERMISSIONS,
});

const setChatPermissions = (payload: any) => ({
  type: Actions.SET_CHAT_PERMISSIONS,
  payload,
});

const addUsersToGroup = (payload: IAddUsersToGroupReq) => ({
  type: Actions.ADD_USERS_TO_GROUP,
  payload,
});

const removeMember = (payload: IUser) => ({
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

//mention
const setMentionSearchKey = (payload: string) => ({
  type: Actions.SET_MENTION_SEARCH_KEY,
  payload,
});

const getMentionUsers = (payload: any) => ({
  type: Actions.GET_MENTION_USERS,
  payload,
});

const setMentionUsers = (payload: IUser[]) => ({
  type: Actions.SET_MENTION_USERS,
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
  updateConversationName,
  uploadFile,
  addUsersToGroup,
  removeMember,
  removeMemberSuccess,
  kickMeOut,
  setMentionSearchKey,
  getMentionUsers,
  setMentionUsers,
  getChatPermissions,
  setChatPermissions,
};
