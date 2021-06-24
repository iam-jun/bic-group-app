import * as Actions from './constants';
import {IConversation, IMessage} from './interfaces';

export const selectConversation = (payload: IConversation) => ({
  type: Actions.SELECT_CONVERSATION,
  payload,
});

export const setMessages = (payload: IMessage[]) => ({
  type: Actions.SET_MESSAGES,
  payload,
});

export const sendMessage = (payload: IMessage) => ({
  type: Actions.SEND_MESSAGE,
  payload,
});
