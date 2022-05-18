import {IGetStreamDispatch} from './common';

import {
  IGetStreamAudience,
  IGetStreamCommentData,
  IGetStreamPost,
  IGetStreamUser,
  IReaction,
} from './IPost';

export interface IGetStreamNotificationActivity {
  id: number;
  actor: IGetStreamUser;
  content?: string;
  media: any;
  mentions?: any;
  reactionsCount?: any;
  audience: IGetStreamAudience;
  comment?: IGetStreamCommentData;
  reaction?: IReaction;
  createdAt?: string;
  updatedAt: string;
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
  offset?: number;
  order?: 'ASC' | 'DESC';
  idLTE?: string;
  idGTE?: string;
  idGT?: string;
  idLT?: string;
  flag?: 'ALL' | 'UNREAD' | 'MENTION' | 'IMPORTANT';
}

export interface INotiExtraData {
  type?: string;
  actor: IGetStreamUser;
  content?: string;
  description?: string;
  media?: any;
}
