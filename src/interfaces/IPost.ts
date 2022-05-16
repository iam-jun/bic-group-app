import {IFilePicked} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IAudienceUser {
  id?: number;
  username?: string;
  fullname?: string;
  avatar?: string;
}

export interface IAudienceGroup {
  id?: number;
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
  id?: number;
  name: string;
  origin_name?: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface IActivityData {
  content?: string;
  highlight?: string;
  images?: IActivityDataImage[];
  videos?: string[];
  files?: string[];
  edited?: boolean;
}

export interface IActivityImportant {
  active?: boolean;
  expires_time?: string | null;
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
  child: IPostComments;
  loading?: boolean;
  status?: 'pending' | 'success' | 'failed';
  localId?: string | number[]; // from uuid-v4
  parentCommentId?: string | number; // used when retry/cancel adding new comment
  reactionsOfActor?: IOwnReaction;
  reaction?: IReaction;
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
  importantExpiredAt?: string | null;
}

export interface IPostMedia {
  images?: any[];
  videos?: any[];
  files?: any[];
}

export interface IPostComments {
  list?: ICommentData[];
  meta?: {
    total?: number;
    limit?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
  content?: string;
}

export interface IPostActivity {
  id?: number;
  audience?: IPostAudience;
  content?: string;
  highlight?: string;
  media?: IPostMedia;
  setting?: IPostSetting;
  isDraft?: boolean;
  actor?: IAudienceUser;
  mentions?: any;
  commentsCount?: number;
  comments?: IPostComments;
  reactionsCount?: IReactionCounts;
  ownerReactions?: IOwnReaction;
  markedReadPost?: boolean;
  createdAt?: string;
  createdBy?: number;
}

export type IOwnReaction = Array<IReaction>;

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
  postId: number;
  parentCommentId?: number;
  commentData: ICommentData;
  userId: string | number;
  localId?: string | number[]; // used when retry adding new comment
  preComment?: ICommentData;
  onSuccess?: () => void;
  isCommentLevel1Screen?: boolean;
  viewMore?: boolean;
}

export interface IPayloadPutEditPost {
  id: number;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  onRetry?: () => void;
  msgSuccess?: string;
  msgError?: string;
  disableNavigate?: boolean;
}

export interface IPayloadPutEditComment {
  id: number;
  comment: ICommentData;
  data: ICommentData;
}

export interface IPayloadDeletePost {
  id: number;
  isDraftPost?: boolean;
}

export interface IParamGetPostDetail {
  postId: number;
  commentOrder?: 'ASC' | 'DESC';
  commentLimit?: number;
  childCommentLimit?: number;
}

export interface IParamPutEditPost {
  postId: number;
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
  postId: number;
  data: ICommentData;
}

export interface IRequestReplyComment {
  parentCommentId: number;
  postId: number;
  data: ICommentData;
}

export interface IRequestGetPostComment {
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGTE?: number;
  idLTE?: number;
  idLT?: number;
  idGT?: number;
  postId: number;
  parentId?: number;
  childLimit?: number;
}

export interface IPayloadGetCommentsById extends IRequestGetPostComment {
  isMerge: boolean;
  callbackLoading?: (loading: boolean, canLoadMore?: boolean) => void;
  position?: string;
  commentId?: number;
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
  child?: any;
  actor?: IAudienceUser;
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
  reactionName: ReactionType;
  targetId: number;
  target: 'POST' | 'COMMENT';
  limit?: number;
  order?: 'ASC' | 'DESC';
  latestId?: number;
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
  id: number;
  reactionId: ReactionType;
  ownReaction: IOwnReaction;
  reactionCounts: IReactionCounts;
}

export interface IPayloadReactToComment {
  id: number;
  comment: IReaction;
  postId?: number;
  parentCommentId?: number;
  reactionId: ReactionType;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
}

export interface IParamPutReaction {
  reactionName: string;
  target: 'POST' | 'COMMENT';
  targetId: number;
}

export interface IParamDeleteReaction {
  target: 'POST' | 'COMMENT';
  reactionId: number;
  targetId: number;
  reactionName: string;
}

export interface IParamPutReactionToComment {
  commentId: string;
  data: string[];
}

export interface IPayloadUpdateCommentsById {
  id: number;
  comments: ICommentData[];
  isMerge: boolean;
  isReplace?: boolean;
  commentId?: number;
}

export interface ICreatePostParams {
  draftPostId?: number;
  postId?: number;
  replaceWithDetail?: boolean;
  initAudience?: any;
  createFromGroupId?: number;
  initAutoSaveDraft?: boolean;
}

export interface IPostSettingsParams extends ICreatePostParams {
  postId?: number;
}

export interface IPayloadReplying {
  comment: ICommentData;
  parentComment?: ICommentData;
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
  id: number;
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
  userId: number;
  data: ISocketReaction;
}

export interface ISocketReaction {
  actor: any;
  id: number;
  reactionsOfActor?: IOwnReaction;
  reaction?: IReaction;
  reactionsCount?: IReactionCounts;
  event?: string;
  comment?: ICommentData;
}

export interface ICreatePostCurrentSettings {
  important: IActivityImportant;
}

export interface IPayloadDeleteComment {
  commentId: number;
  parentCommentId?: number;
  postId: number;
}

export interface IPayloadPutMarkAsRead {
  postId: number;
  callback?: (isSuccess: boolean) => void;
}
