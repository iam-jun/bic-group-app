export interface IPostAudience {
  users?: number[];
  groups?: number[];
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
  data?: IActivityData;
  followers?: number[];
  audience?: IPostAudience;
  tags?: string[];
  time?: string;
  important?: IActivityImportant;
}

export interface IPostCreatePost {
  actor?: number;
  data?: IActivityData;
  audience?: IPostAudience;
  tags?: number[];
}

export type IReact = 'like' | 'love' | string;

export type IReactionKind = 'comment' | 'seen' | IReact;

export interface IGetStreamUser {
  created_at?: string;
  updated_at?: string;
  id?: string | number;
  data?: {
    avatarUrl?: string;
    fullname?: string;
  };
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
