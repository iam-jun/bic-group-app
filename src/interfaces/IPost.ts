import {IObject} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IAudienceUser {
  id?: number | string;
  data?: {
    avatarUrl?: string;
    fullname?: string;
  };
}

export interface IAudienceGroup {
  id?: number | string;
  data?: {
    avatarUrl?: string;
    name?: string;
  };
}

export interface IAudience {
  id?: number | string;
  name?: string;
  icon?: string;
  avatar?: string;
  userCount?: number;
  type?: string;
  isGroup?: boolean;
}

export interface IActivityData {
  content?: string;
  images?: string[];
  videos?: string[];
  files?: string[];
}

export interface IActivityImportant {
  active?: boolean;
  expiresTime?: string;
}

/**
  actor: userId
  - Getstream saved as string
  - Backend saved as int
    =>  When post data to Backend, actor should be NUMBER
        Otherwhile, when get data from Backend or Getstrea, actor should be STRING
 */
export interface IPostActivity {
  id?: string;
  foreign_id?: string;
  getstream_id?: string;
  actor?: IAudienceUser;
  verb?: string;
  type?: string;
  object?: {
    data?: IActivityData;
    created_at?: string;
    updated_at?: string;
  };
  followers?: number[];
  audience?: IPostAudience;
  tags?: string[];
  time?: string;
  important?: IActivityImportant;
  own_reactions?: any;
  reaction_counts?: IObject<number>;
  deleted?: boolean;
}

export interface IOwnReaction {
  [reactionKind: string]: IReaction[];
}

export type IReactionCounts = {[reactionKind: string]: number};

export interface IAllPosts {
  [id: string]: IPostActivity;
}

export interface IPostCreatePost {
  actor?: number;
  data?: IActivityData;
  audience?: {
    users: number[];
    groups: number[];
  };
  tags?: number[];
  important?: IActivityImportant;
}

export type IReactionKind = 'comment' | 'seen' | ReactionType;

export interface IGetStreamUser {
  created_at?: string;
  updated_at?: string;
  id?: string | number;
  data?: {
    avatarUrl?: string;
    fullname?: string;
  };
}

export interface IRequestPostComment {
  referenceId: string;
  referenceType: 'post' | 'comment';
  commentData: IActivityData;
  userId: number;
}

export interface IReaction {
  created_at?: string;
  updated_at?: string;
  id?: string;
  user_id?: string | number;
  user?: IGetStreamUser;
  kind?: IReactionKind;
  activity_id?: string;
  data?: IActivityData;
  parent?: string;
  latest_children?: any;
  children_counts?: any;
}

export interface IGetStreamAudienceUser {
  id?: number | string;
  collection?: string;
  foreign_id: string;
  data?: {
    avatarUrl?: string;
    fullname?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface IGetStreamAudienceGroup {
  id?: number | string;
  collection?: string;
  foreign_id: string;
  data?: {
    avatarUrl?: string;
    name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface IGetStreamAudience {
  groups: IGetStreamAudienceGroup[];
  users: IGetStreamAudienceUser[];
}

export interface IGetStreamPost {
  id?: string;
  foreign_id?: string;
  actor: IGetStreamUser;
  audience: IGetStreamAudience;
  verb: string;
  type: string;
  data: IActivityData;
  object?: string;
  origin?: string | null;
  target?: string;
  time?: string;
}

export interface IParamSearchMentionAudiences {
  key?: string;
  group_ids?: string;
  user_ids?: string;
  skip?: number;
  take?: number;
}

export interface IPayloadReactToPost {
  postId: string;
  reactionId: ReactionType;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
  userId: number;
}

export interface IPayloadUpdateReactionOfPostById {
  postId: string;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
}
