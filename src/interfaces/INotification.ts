import {
  IGetStreamAudience,
  IGetStreamCommentData,
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
  idLte?: string;
  idGte?: string;
  idGt?: string;
  idLt?: string;
  flag?: 'ALL' | 'UNREAD' | 'MENTION' | 'IMPORTANT';
  clearCurrentNotifications?: boolean;
}

export interface INotiExtraData {
  type?: string;
  actor: IGetStreamUser;
  content?: string;
  description?: string;
  media?: any;
}
