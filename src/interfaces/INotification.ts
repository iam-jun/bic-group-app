import {IGetStreamDispatch} from './common';

import {
  IGetStreamAudience,
  IGetStreamPost,
  IGetStreamUser,
  IReaction,
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
  parent_reaction?: IReaction;
}

export interface IMarkAsReadAnActivity extends IGetStreamDispatch {
  activityId: string;
}

export interface ILoadNewNotifications extends IGetStreamDispatch {
  notiGroupId: string;
  limit: number;
}

export interface IDeleteNotifications extends IGetStreamDispatch {
  notiGroupIds: string[];
}

export interface IParamGetNotifications {
  offset?: number;
  limit?: number;
}
