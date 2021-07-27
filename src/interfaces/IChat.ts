import {IMessage as _GMessage} from 'react-native-gifted-chat';
import {ReactionType} from '~/constants/reactions';
import {IUser} from './IAuth';
export interface IReaction {
  type: ReactionType;
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
  id: string;
  name: string;
  description?: string;
  uids: string[];
  usernames: string[];
  usersCount: number;
  unreadCount: number;
  lastMessage: string;
  updatedAt: string;
};
