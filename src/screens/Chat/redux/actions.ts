import * as Actions from './constants';
import {IConversation, IMessage} from '../../../interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';

const setConversationLoading = (payload: boolean) => ({
  type: Actions.SET_CONVERSATION_LOADING,
  payload,
});

const setConversations = (payload: IConversation[]) => ({
  type: Actions.SET_CONVERSATIONS,
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

export default {
  setConversationLoading,
  handleEvent,
  setConversations,
  selectConversation,
  setMessages,
  setExtraMessages,
  mergeExtraMessages,
  sendMessage,
  reactMessage,
};
