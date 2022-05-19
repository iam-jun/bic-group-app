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
  id_lt?: string;
  id_gte?: string;
  enrich?: boolean;
  own_reactions?: boolean;
  with_own_reactions?: boolean;
  with_own_children?: boolean;
  with_recent_reactions?: boolean;
  with_reaction_counts?: boolean;
}

export interface INotiExtraData {
  type?: string;
  actor: IGetStreamUser;
  content?: string;
  description?: string;
  media?: any;
}
