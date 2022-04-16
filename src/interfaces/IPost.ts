import {IFilePicked} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IAudienceUser {
  id?: number | string;
  username?: string;
  fullname?: string;
  avatar?: string;
}

export interface IAudienceGroup {
  id?: number | string;
  name?: string;
  icon?: string;
  child?: number[];
}

export interface IMarkdownAudience {
  id: string;
  data: {
    fullname: string;
    username: string;
    avatar?: string;
  };
  created_at: string;
  updated_at: string;
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
  edited?: boolean;
}

export interface IActivityImportant {
  active?: boolean;
  expires_time?: string;
}

export interface ICommentData {
  id?: number;
  postId?: number;
  totalReply?: number;
  actor?: IAudienceUser;
  parentId?: number;
  content?: string;
  media?: IPostMedia;
  mentions?: any;
  createdAt?: string;
  updatedAt?: string;
  ownerReactions?: any;
  reactionsCount?: any;
  child?: any;
}

export interface ICreatePostImage {
  fileName?: string;
  file?: IFilePicked;
  url?: string;
}

export interface ICreatePostSettings {
  important?: IActivityImportant;
  count: number;
}

export interface IPostSetting {
  canReact?: boolean;
  canShare?: boolean;
  canComment?: boolean;
  isImportant?: boolean;
  importantExpiredAt?: string;
}

export interface IPostMedia {
  images?: any[];
  videos?: any[];
  files?: any[];
}

export interface IPostActivity {
  id?: string;
  audience?: IPostAudience;
  content?: string;
  highlight?: string;
  media?: IPostMedia;
  setting?: IPostSetting;
  isDraft?: boolean;
  actor?: IAudienceUser;
  mentions?: any;
  commentsCount?: number;
  reactionsCount?: IReactionCounts;
  ownerReactions?: IOwnReaction;
  createdAt?: string;
  createdBy?: number;
}

export interface IOwnReaction {
  [x: string]: {[reactionKind: string]: IReaction};
}

export type IReactionCounts = {
  [x: string]: {[reactionKind: string]: number};
};

export interface IAllPosts {
  [id: string]: IPostActivity;
}

export interface IAllComments {
  [id: string]: IReaction;
}

export interface IPostCreatePost {
  audience?: {
    userIds: number[];
    groupIds: number[];
  };
  content?: string;
  media?: any;
  setting?: any;
  mentions?: any;
  isDraft?: boolean;

  createFromGroupId?: string | number;
}

export interface IPayloadCreatePost {
  data?: IPostCreatePost;
  createFromGroupId?: string | number;
  callback?: any;
}

export interface IPayloadCreateComment {
  postId: string;
  parentCommentId?: string | number;
  commentData: ICommentData;
  userId: string | number;
  localId?: string | number[]; // used when retry adding new comment
  preComment?: IReaction & {
    localId: string | number[]; // used when creating new comment
    parentCommentId?: string | number;
  };
  onSuccess?: () => void;
  isCommentLevel1Screen?: boolean;
}

export interface IPayloadPutEditPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  onRetry?: () => void;
}

export interface IPayloadPutEditComment {
  id: string;
  comment: IReaction;
  data: IActivityData;
}

export interface IPayloadDeletePost {
  id: string;
  isDraftPost?: boolean;
}

export interface IParamGetPostDetail {
  postId: string;
  commentOrder?: 'ASC' | 'DESC';
  commentLimit?: number;
  childCommentLimit?: number;
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
    username?: string;
  };
}

export interface IRequestPostComment {
  postId: string;
  data: ICommentData;
}

export interface IRequestReplyComment {
  parentCommentId: string | number;
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
  position?: string;
}

export interface IReaction {
  id?: number;
  postId?: number;
  reactionName?: string;
  createdBy?: number;
  createdAt?: string;

  loading?: boolean;
  status?: 'pending' | 'success' | 'failed';
  localId?: string | number[]; // from uuid-v4
  parentCommentId?: string | number; // used when retry/cancel adding new comment
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
    icon?: string;
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
  object?: IGetStreamPost | string | any;
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

export interface IMentionUser {
  id: number;
  username: string;
  email?: string;
  fullname: string;
  avatar: string;
  bein_staff_role?: string;
  chat_user_id?: string;
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
  initAutoSaveDraft?: boolean;
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
  order?: 'ASC';
  offset?: number;
  limit?: number;
  idGTE?: number;
  idLTE?: number;
  idGT?: number;
  idLT?: number;
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
  createFromGroupId?: number;
}

export interface IPayloadPutEditDraftPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  publishNow: boolean;
  callback?: any;
  createFromGroupId?: number;
}

export interface IPayloadPutEditAutoSave {
  id: string;
  data: IPostCreatePost;
}

export interface IParamGetPostAudiences {
  key?: string;
  group_ids: string;
}

export interface IPayloadUpdateReaction {
  userId: string;
  data: ISocketReaction;
}

export interface ISocketReaction {
  actor: any;
  reaction: any;
  post: {
    post_id?: string;
    reaction_counts?: IReactionCounts;
    reactions_order?: string[];
  };
  comment: {
    comment_id?: string;
    reaction_counts?: IReactionCounts;
    reactions_order?: string[];
  };
}

export interface ICreatePostCurrentSettings {
  important: IActivityImportant;
}

export interface IPayloadDeleteComment {
  commentId: string;
  parentCommentId?: string;
  postId: string;
}
