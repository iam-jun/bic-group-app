import {IFilePicked, IObject} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';
import {StreamClient} from 'getstream';

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IAudienceUser {
  id?: number | string;
  data?: {
    avatar?: string;
    fullname?: string;
  };
}

export interface IAudienceGroup {
  id?: number | string;
  data?: {
    avatar?: string;
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

export interface IActivityDataImage {
  name: string;
  origin_name?: string;
  width?: number;
  height?: number;
}

export interface IActivityData {
  content?: string;
  images?: IActivityDataImage[];
  videos?: string[];
  files?: string[];
}

export interface IActivityImportant {
  active?: boolean;
  expires_time?: string;
}

export interface ICreatePostImage {
  fileName?: string;
  file?: IFilePicked;
  url?: string;
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
  latest_reactions?: any;
  own_reactions?: any;
  reaction_counts?: IObject<number>;
  deleted?: boolean;
  is_draft?: boolean;
}

export interface IOwnReaction {
  [reactionKind: string]: IReaction[];
}

export type IReactionCounts = {[reactionKind: string]: number};

export interface IAllPosts {
  [id: string]: IPostActivity;
}

export interface IAllComments {
  [id: string]: IReaction;
}

export interface IPostCreatePost {
  data?: IActivityData;
  audience?: {
    user_ids: number[];
    group_ids: number[];
  };
  tag_ids?: number[];
  important?: IActivityImportant;
  is_draft?: boolean;

  createFromGroupId?: string | number;
}

export interface IPayloadCreateComment {
  postId: string;
  parentCommentId?: string;
  commentData: IActivityData;
  userId: string | number;
  onSuccess?: (data: {newCommentId: string; parentCommentId?: string}) => void;
}

export interface IPayloadPutEditPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
}

export interface IPayloadPutEditComment {
  id: string;
  comment: IReaction;
  data: IActivityData;
}

export interface IParamGetPostDetail {
  postId: string;

  is_draft?: boolean;
  enrich?: boolean;
  own_reactions?: boolean;
  with_own_reactions?: boolean;
  with_own_children?: boolean;
  with_recent_reactions?: boolean;
  with_reaction_counts?: boolean;
}

export interface IParamPutEditPost {
  postId: string;
  data: IPostCreatePost;
}

export interface IPayloadGetPostDetail extends IParamGetPostDetail {
  callbackLoading?: (loading: boolean, success: boolean) => void;
}

export type IReactionKind = 'comment' | 'seen' | ReactionType;

export interface IGetStreamUser {
  created_at?: string;
  updated_at?: string;
  id?: string | number;
  data?: {
    avatar?: string;
    fullname?: string;
  };
}

export interface IRequestPostComment {
  postId: string;
  data: IActivityData;
}

export interface IRequestReplyComment {
  parentCommentId: string;
  data: IActivityData;
}

export interface IRequestGetPostComment {
  postId: string;
  commentId?: string;
  idLt?: string; //get comment before this id
  kind?: string;
  recentReactionsLimit?: number;
  recentChildReactionsLimit?: number;
}

export interface IPayloadGetCommentsById extends IRequestGetPostComment {
  isMerge: boolean;
  callbackLoading?: (loading: boolean, canLoadMore?: boolean) => void;
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
  own_children?: any;
  loading?: boolean;
}

export interface IGetStreamAudienceUser {
  id?: number | string;
  collection?: string;
  foreign_id: string;
  data?: {
    avatar?: string;
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
    avatar?: string;
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
  object?: IGetStreamPost | string;
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

export interface IParamGetReactionDetail {
  reactionType: ReactionType;
  postId?: string;
  commentId?: string;
  limit?: number;
  idLessThan?: string;
}

export interface IPostAudienceSheet {
  isShow: boolean;
  data: any[];
  fromStack?: 'newsfeed' | 'groups';
}

export interface IPayloadAddToAllPost {
  data: IPostActivity[] | IPostActivity;
  handleComment?: boolean;
}

export interface IPayloadReactToPost {
  id: string;
  reactionId: ReactionType;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
}

export interface IPayloadReactToComment {
  id: string;
  comment: IReaction;
  postId?: string;
  parentCommentId?: string;
  reactionId: ReactionType;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
}

export interface IParamPutReactionToPost {
  postId: string;
  data: string[];
}

export interface IParamPutReactionToComment {
  commentId: string;
  data: string[];
}

export interface IPayloadUpdateReactionOfPostById {
  postId: string;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
}

export interface IPayloadUpdateCommentsById {
  id: string;
  comments: IReaction[];
  isMerge: boolean;
}

export interface ICreatePostParams {
  draftPostId?: string;
  postId?: string;
  replaceWithDetail?: boolean;
  initAudience?: any;
  createFromGroupId?: number;
}

export interface IPayloadReplying {
  comment: IReaction;
  parentComment?: IReaction;
}

export interface IPayloadSetDraftPosts {
  posts?: IActivityData[];
  canLoadMore?: boolean;
  loading?: boolean;
  refreshing?: boolean;
}

export interface IParamGetDraftPosts {
  offset?: number;
  limit?: number;
}

export interface IPayloadGetDraftPosts {
  isRefresh?: boolean;
  offset?: number;
}

export interface IPayloadPublishDraftPost {
  draftPostId: string;
  replaceWithDetail?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  refreshDraftPosts?: boolean;
}

export interface IPayloadPutEditDraftPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  publishNow: boolean;
}
