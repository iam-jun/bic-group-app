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
  notification_type: number;
  object: IGetStreamPost | any;
  origin?: string;
  reaction?: IReaction;
  target: string;
  time: string;
  verb: string;
  audience: IGetStreamAudience;
  parent_reaction?: IReaction;
}

export interface IMarkAsReadAnActivity extends IGetStreamDispatch {
  activityId: string;
}

export interface ILoadNewNotifications {
  notiGroupId: string;
  limit: number;
}

export interface IDeleteNotifications {
  notiGroupIds: string[];
}

export interface IParamGetNotifications {
  limit?: number;
  id_lt?: string;
  id_gte?: string;
  enrich?: boolean;
  own_reactions?: boolean;
  with_own_reactions?: boolean;
  with_own_children?: boolean;
  with_recent_reactions?: boolean;
  with_reaction_counts?: boolean;
}
