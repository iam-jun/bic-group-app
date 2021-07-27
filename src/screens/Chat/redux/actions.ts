import * as Actions from './constants';
import {IConversation, IMessage} from '../../../interfaces/IChat';
import {ISocketEvent} from '~/interfaces/ISocket';

const setConversationLoading = (payload: boolean) => ({
  type: Actions.SET_CONVERSATION_LOADING,
  payload,
});

const handleConversationsEvent = (payload: ISocketEvent) => ({
  type: Actions.HANDLE_CONVERSATIONS_EVENT,
  payload,
});

const setConversations = (payload: []) => ({
  type: Actions.SET_CONVERSATIONS,
  payload,
});

const selectConversation = (payload: IConversation) => ({
  type: Actions.SELECT_CONVERSATION,
  payload,
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
  handleConversationsEvent,
  setConversations,
  selectConversation,
  setMessages,
  sendMessage,
  reactMessage,
};
