import {
  IGetStreamUser,
  IGetStreamPost,
  IReaction,
  IGetStreamAudience,
} from './IPost';

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
  audience: IGetStreamAudience;
}
