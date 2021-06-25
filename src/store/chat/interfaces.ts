import {IMessage as _GMessage} from 'react-native-gifted-chat';
import {IUser} from '../auth/interfaces';
export interface IReaction {
  type: string;
  count: number;
  reacted?: boolean;
}

export type GMessage = _GMessage;

export type IAttachment = {
  name: string;
  url: string;
  thumnailUrl?: string;
  type: string;
};

export type IMessage = _GMessage & {
  id: string | number;
  user: IUser;
  quoted_message?: IMessage;
  reactions?: IReaction[];
  attachments?: IAttachment[];
};

export type IConversation = {
  name: string;
  description?: string;
  members: IUser[];
  unreadCount: number;
  lastMessage: string;
  updatedAt: string;
};
