import {IObject} from '~/interfaces/common';
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
  getRooms: () => ({
    type: Actions.GET_ROOMS,
  }),
  setRooms: (payload: {data: string[]; items: IObject<IConversation>}) => ({
    type: Actions.SET_ROOMS,
    payload,
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
  setSubscriptions: (payload: IObject<any>) => ({
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
  updateMessage: (payload: IMessage) => ({
    type: Actions.UPDATE_MESSAGE,
    payload,
  }),
  updateConversationName: (payload: {roomId: string; name: string}) => ({
    type: Actions.UPDATE_CONVERSATION_NAME,
    payload,
  }),
  updateConversationDetail: (payload: {
    roomId: number | string;
    body: IUpdateConversationDetail;
    editFieldName?: string;
    callback?: (roomId?: number | string) => void;
  }) => ({
    type: Actions.UPDATE_CONVERSATION_DETAIL,
    payload,
  }),
  setUpdatedConversationDetail: (payload: IConversationInfo) => ({
    type: Actions.SET_UPDATED_CONVERSATION_DETAIL,
    payload,
  }),
  uploadFile: (payload: IUploadFileAction) => ({
    type: Actions.UPLOAD_FILE,
    payload,
  }),
  addMembersToGroup: (payload: {roomId: string; userIds: number[]}) => ({
    type: Actions.ADD_MEMBERS_TO_GROUP,
    payload,
  }),
  removeMember: (payload: {roomId: string; user: IChatUser}) => ({
    type: Actions.REMOVE_MEMBER,
    payload,
  }),
  removeMemberSuccess: (payload: IMessage) => ({
    type: Actions.REMOVE_MEMBER_SUCCESS,
    payload,
  }),
  addMembersToGroupSuccess: (payload: any) => ({
    type: Actions.ADD_MEMBERS_TO_GROUP_SUCCESS,
    payload,
  }),
  kickMeOut: (payload: IMessage) => ({
    type: Actions.KICK_ME_OUT,
    payload,
  }),
  leaveChat: (payload: string) => ({
    type: Actions.LEAVE_CHAT,
    payload,
  }),
  getMessageDetail: (payload: string) => ({
    type: Actions.GET_MESSAGE_DETAIL,
    payload,
  }),
  setMessageDetail: (payload: IMessage) => ({
    type: Actions.SET_MESSAGE_DETAIL,
    payload,
  }),
  getUnreadMessage: (payload: IConversation) => ({
    type: Actions.GET_UNREAD_MESSAGE,
    payload,
  }),
  setUnreadMessage: (payload: {roomId: string; msgId: string | null}) => ({
    type: Actions.SET_UNREAD_MESSAGE,
    payload,
  }),
  setJumpedMessage: (payload: string | null) => ({
    type: Actions.SET_JUMPED_MESSAGE,
    payload,
  }),
  getSurroundingMessages: (payload: {roomId: string; messageId: string}) => ({
    type: Actions.GET_SURROUNDING_MESSAGES,
    payload,
  }),
  setMessagesError: (payload: any) => ({
    type: Actions.SET_MESSAGES_ERROR,
    payload,
  }),
  getMessagesHistory: (payload: string) => ({
    type: Actions.GET_MESSAGES_HISTORY,
    payload,
  }),
  setMessagesHistory: (payload: {
    roomId: string;
    messageIds: string[];
    messagesData: IObject<IMessage>;
  }) => ({
    type: Actions.SET_MESSAGES_HISTORY,
    payload,
  }),
  getNextMessages: (payload: string) => ({
    type: Actions.GET_NEXT_MESSAGES,
    payload,
  }),
  setNextMessages: (payload: {
    roomId: string;
    messageIds: string[];
    messagesData: IObject<IMessage>;
  }) => ({
    type: Actions.SET_NEXT_MESSAGES,
    payload,
  }),
  resetRoomMessages: (payload: string) => ({
    type: Actions.RESET_ROOM_MESSAGES,
    payload,
  }),
  clearRoomMessages: (payload: string) => ({
    type: Actions.CLEAR_ROOM_MESSAGES,
    payload,
  }),
  setConversationNotifications: (payload?: {
    roomId: string;
    disableNotifications: boolean;
  }) => ({
    type: Actions.SET_CONVERSATION_NOTIFICATIONS,
    payload,
  }),
  toggleConversationNotifications: (payload: {
    roomId: string;
    currentDisableNotifications: boolean;
  }) => ({
    type: Actions.TOGGLE_CONVERSATION_NOTIFICATIONS,
    payload,
  }),
};
