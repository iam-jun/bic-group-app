import * as Actions from './constants';
import {IConversation, IMessage} from '../../interfaces/IChat';

export const selectConversation = (payload: IConversation) => ({
  type: Actions.SELECT_CONVERSATION,
  payload,
});

export const getMessages = () => ({
  type: Actions.GET_MESSAGES,
});

export const setMessages = (payload: IMessage[]) => ({
  type: Actions.SET_MESSAGES,
  payload,
});

export const sendMessage = (payload: IMessage) => ({
  type: Actions.SEND_MESSAGE,
  payload,
});

export const reactMessage = (message?: IMessage, reactionType?: string) => ({
  type: Actions.REACT_MESSAGE,
  message,
  reactionType,
});
