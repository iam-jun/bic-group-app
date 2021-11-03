import {
  IChatUser,
  IConversation,
  IConversationInfo,
  IMessage,
  IPayloadReactMessage,
  ISendMessageAction,
  IUpdateConversationDetail,
  IUploadFileAction,
} from '~/interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';
import Actions from './constants';

export default {
  initChat: () => ({
    type: Actions.INIT_CHAT,
  }),
  getData: (dataType: string, payload?: any, field?: string) => ({
    type: Actions.GET_DATA,
    dataType,
    payload,
    field,
  }),
  setData: (dataType: string, payload: any[]) => ({
    type: Actions.SET_DATA,
    payload,
    dataType,
  }),
  setExtraData: (dataType: string, payload: []) => ({
    type: Actions.SET_EXTRA_DATA,
    payload,
    dataType,
  }),
  mergeExtraData: (dataType: string, field?: string) => ({
    type: Actions.MERGE_EXTRA_DATA,
    dataType,
    field,
  }),
  resetData: (dataType: string) => ({
    type: Actions.RESET_DATA,
    dataType,
  }),
  getConversationDetail: (payload: string) => ({
    type: Actions.GET_CONVERSATION_DETAIL,
    payload,
  }),
  getAttachmentMedia: (payload: {
    roomId: string;
    isDirectMessage: boolean;
  }) => ({
    type: Actions.GET_ATTACHMENT_MEDIA,
    payload,
  }),
  setAttachmentMedia: (payload?: any) => ({
    type: Actions.SET_ATTACHMENT_MEDIA,
    payload,
  }),
  setConversationDetail: (payload: IConversation) => ({
    type: Actions.SET_CONVERSATION_DETAIL,
    payload,
  }),
  getGroupRoles: (payload: string) => ({
    type: Actions.GET_GROUP_ROLES,
    payload,
  }),
  setGroupRoles: (payload: IChatUser[]) => ({
    type: Actions.SET_GROUP_ROLES,
    payload,
  }),
  getSubscriptions: () => ({
    type: Actions.GET_SUBSCRIPTIONS,
  }),
  setSubscriptions: (payload: IConversation[]) => ({
    type: Actions.SET_SUBSCRIPTIONS,
    payload,
  }),
  readSubscriptions: (payload: string) => ({
    type: Actions.READ_SUBCRIPTIONS,
    payload,
  }),
  updateSubscription: (payload: any) => ({
    type: Actions.UPDATE_SUBSCRIPTION,
    payload,
  }),
  handleEvent: (payload: ISocketEvent) => ({
    type: Actions.HANDLE_EVENT,
    payload,
  }),
  sendMessage: (payload: ISendMessageAction) => ({
    type: Actions.SEND_MESSAGE,
    payload,
  }),
  editMessage: (payload: IMessage) => ({
    type: Actions.EDIT_MESSAGE,
    payload,
  }),
  sendMessageSuccess: (payload: IMessage) => ({
    type: Actions.SEND_MESSAGE_SUCCESS,
    payload,
  }),
  retrySendMessage: (payload: IMessage) => ({
    type: Actions.RETRY_SEND_MESSAGE,
    payload,
  }),
  sendMessageFailed: (payload: IMessage) => ({
    type: Actions.SEND_MESSAGE_FAILED,
    payload,
  }),
  reactMessage: (payload: IPayloadReactMessage) => ({
    type: Actions.REACT_MESSAGE,
    payload,
  }),
  deleteMessage: (payload: IMessage) => ({
    type: Actions.DELETE_MESSAGE,
    payload,
  }),
  deleteMessageSuccess: (payload: IMessage) => ({
    type: Actions.DELETE_MESSAGE_SUCCESS,
    payload,
  }),
  selectUser: (payload: IChatUser, field?: string) => ({
    type: Actions.SELECT_USER,
    payload,
    field,
  }),
  clearSelectedUsers: () => ({
    type: Actions.CLEAR_SELECTED_USERS,
  }),
  createConversation: (
    payload: IChatUser[],
    hideConfirmation?: boolean,
    callBack?: (roomId: string) => void,
    conversationName?: string,
  ) => ({
    type: Actions.CREATE_CONVERSATION,
    payload,
    hideConfirmation,
    callBack,
    conversationName,
  }),
  createConversationSuccess: (payload: IConversation) => ({
    type: Actions.CREATE_CONVERSATION_SUCCESS,
    payload,
  }),
  addNewMessage: (payload: IMessage) => ({
    type: Actions.ADD_NEW_MESSAGE,
    payload,
  }),
  updateConversationName: (payload: string) => ({
    type: Actions.UPDATE_CONVERSATION_NAME,
    payload,
  }),
  updateConversationDetail: (
    payload: IUpdateConversationDetail,
    editFieldName?: string,
    callback?: (roomId?: string) => void,
  ) => ({
    type: Actions.UPDATE_CONVERSATION_DETAIL,
    payload,
    editFieldName,
    callback,
  }),
  setUpdatedConversationDetail: (payload: IConversationInfo) => ({
    type: Actions.SET_UPDATED_CONVERSATION_DETAIL,
    payload,
  }),
  uploadFile: (payload: IUploadFileAction) => ({
    type: Actions.UPLOAD_FILE,
    payload,
  }),
  addMembersToGroup: (payload: number[]) => ({
    type: Actions.ADD_MEMBERS_TO_GROUP,
    payload,
  }),
  removeMember: (payload: IChatUser) => ({
    type: Actions.REMOVE_MEMBER,
    payload,
  }),
  removeMemberSuccess: (payload: IMessage) => ({
    type: Actions.REMOVE_MEMBER_SUCCESS,
    payload,
  }),
  addMembersToGroupSuccess: (payload: number) => ({
    type: Actions.ADD_MEMBERS_TO_GROUP_SUCCESS,
    payload,
  }),
  kickMeOut: (payload: IMessage) => ({
    type: Actions.KICK_ME_OUT,
    payload,
  }),
  leaveChat: (payload: string, roomType: string) => ({
    type: Actions.LEAVE_CHAT,
    payload,
    roomType,
  }),
  readConversation: () => ({
    type: Actions.READ_CONVERSATION,
  }),
  getMessageDetail: (payload: string) => ({
    type: Actions.GET_MESSAGE_DETAIL,
    payload,
  }),
  setMessageDetail: (payload: IMessage) => ({
    type: Actions.SET_MESSAGE_DETAIL,
    payload,
  }),
  getUnreadMessage: () => ({
    type: Actions.GET_UNREAD_MESSAGE,
  }),
  setUnreadMessage: (payload: IMessage | null) => ({
    type: Actions.SET_UNREAD_MESSAGE,
    payload,
  }),
  setJumpedMessage: (payload: IMessage | null) => ({
    type: Actions.SET_JUMPED_MESSAGE,
    payload,
  }),
  getSurroundingMessages: (payload: string) => ({
    type: Actions.GET_SURROUNDING_MESSAGES,
    payload,
  }),
  setMessagesError: (payload: any) => ({
    type: Actions.SET_MESSAGES_ERROR,
    payload,
  }),
  getMessagesHistory: () => ({
    type: Actions.GET_MESSAGES_HISTORY,
  }),
  setMessages: (payload: IMessage[]) => ({
    type: Actions.SET_MESSAGES,
    payload,
  }),
  setMessagesHistory: (payload: IMessage[]) => ({
    type: Actions.SET_MESSAGES_HISTORY,
    payload,
  }),
  mergeMessagesHistory: () => ({
    type: Actions.MERGE_MESSAGES_HISTORY,
  }),
  getNextMessages: () => ({
    type: Actions.GET_NEXT_MESSAGES,
  }),
  setNextMessages: (payload: IMessage[]) => ({
    type: Actions.SET_NEXT_MESSAGES,
    payload,
  }),
};
