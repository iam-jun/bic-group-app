import {StreamClient} from 'getstream';
import {IGetStreamUser, IGetStreamPost, IReaction} from './IPost';

export interface IGetNotification {
  streamClient: StreamClient;
  userId: string;
}

export interface IGetStreamNotificationActivity {
  actor: IGetStreamUser;
  foreign_id: string;
  id: string;
  notificationType: number;
  object: IGetStreamPost;
  origin: null;
  reaction: IReaction;
  target: string;
  time: string;
  verb: string;
}
