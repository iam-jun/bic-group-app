import { IFilePicked, IGiphy } from '~/interfaces/common';
import { ReactionType } from '~/constants/reactions';

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IAudienceUser {
  data?: any;
  id?: string;
  username?: string;
  fullname?: string;
  avatar?: string;
}

export interface IAudienceGroup {
  id?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IAudience {
  id?: string;
  name?: string;
  icon?: string;
  avatar?: string;
  userCount?: number;
  type?: string;
  isGroup?: boolean;
}

export interface IActivityDataImage {
  id?: string;
  name: string;
  origin_name?: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface IActivityDataFile {
  id?: string;
  name: string;
  origin_name?: string;
  url?: string;
  size?: number;
  type?: string;
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
  id?: string;
  postId?: string;
  totalReply?: number;
  actor?: IAudienceUser;
  parentId?: string;
  content?: string;
  media?: IPostMedia;
  mentions?: any;
  createdAt?: string;
  updatedAt?: string;
  ownerReactions?: any;
  reactionsCount?: any;
  child?: IPostComments;
  loading?: boolean;
  status?: 'pending' | 'success' | 'failed';
  localId?: string | number[]; // from uuid-v4
  parentCommentId?: string; // used when retry/cancel adding new comment
  reactionsOfActor?: IOwnReaction;
  reaction?: IReaction;
  giphy?: IGiphy;
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
}

export interface IPostActivity {
  id?: string;
  audience?: IPostAudience;
  content?: string;
  highlight?: string;
  media?: IPostMedia;
  setting?: IPostSetting;
  isDraft?: boolean;
  isProcessing?: boolean;
  actor?: IAudienceUser;
  mentions?: any;
  commentsCount?: number;
  comments?: IPostComments;
  reactionsCount?: IReactionCounts;
  ownerReactions?: IOwnReaction;
  markedReadPost?: boolean;
  createdAt?: string;
  createdBy?: number;
  totalUsersSeen?: number;
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
    userIds: string[];
    groupIds: string[];
  };
  content?: string;
  media?: any;
  setting?: any;
  mentions?: any;
  isDraft?: boolean;

  createFromGroupId?: string;
}

export interface IPayloadCreatePost {
  data?: IPostCreatePost;
  createFromGroupId?: string;
  callback?: any;
}

export interface IPayloadCreateComment {
  postId: string;
  parentCommentId?: string;
  commentData: ICommentData;
  userId: string;
  localId?: string | number[]; // used when retry adding new comment
  preComment?: ICommentData;
  onSuccess?: () => void;
  isCommentLevel1Screen?: boolean;
  viewMore?: boolean;
}

export interface IPayloadPutEditPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  onRetry?: () => void;
  msgSuccess?: string;
  msgError?: string;
  disableNavigate?: boolean;
}

export interface IPayloadPutEditComment {
  id: string;
  comment: ICommentData;
  data: ICommentData;
}

export interface IPayloadDeletePost {
  id: string;
  isDraftPost?: boolean;
  callbackError?: (listAudiences: string[]) => void;
}

export interface IPayloadRemoveAudiencesOfPost {
  id: string;
  listAudiences: string[];
}

export interface IParamGetPostDetail {
  postId: string;
  commentOrder?: 'ASC' | 'DESC';
  commentLimit?: number;
  childCommentOrder?: number;
  childCommentLimit?: number;
  withComment?: boolean;
  offset?: number;
}

export interface IParamPutEditPost {
  postId: string;
  data: IPostCreatePost;
}

export interface IPayloadGetPostDetail extends IParamGetPostDetail {
  callbackLoading?: (loading: boolean, success: boolean) => void;
  showToast?: boolean;
}

export type IReactionKind = 'comment' | 'seen' | ReactionType;

export interface IGetStreamUser {
  createdAt?: string;
  updatedAt?: string;
  id?: string | number;
  data?: {
    avatar?: string;
    fullname?: string;
    username?: string;
  };
  avatar?: string;
}

export interface IRequestPostComment {
  postId: string;
  data: ICommentData;
}

export interface IRequestReplyComment {
  parentCommentId: string;
  postId: string;
  data: ICommentData;
}

export interface IRequestGetPostComment {
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  idGte?: string;
  idLte?: string;
  idLt?: string;
  idGt?: string;
  postId: string;
  parentId?: string;
  childLimit?: number;
}

export interface IPayloadGetCommentsById{
  isMerge?: boolean;
  position?: string;
  commentId?: string;
  params?: IRequestGetPostComment,
  callbackLoading?: (loading: boolean, canLoadMore?: boolean) => void;
}

export interface IReaction {
  id?: string;
  postId?: string;
  reactionName?: string;
  createdBy?: number;
  createdAt?: string;

  loading?: boolean;
  status?: 'pending' | 'success' | 'failed';
  localId?: string | number[]; // from uuid-v4
  parentCommentId?: string ; // used when retry/cancel adding new comment
  child?: any;
  actor?: IAudienceUser;
  activity_id: string;
  userId:string;
  data:any
}

export interface IGetStreamAudienceUser {
  id?: string;
  collection?: string;
  foreign_id: string;
  data?: {
    avatar?: string;
    fullname?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IGetStreamAudienceGroup {
  id?: string;
  collection?: string;
  foreign_id: string;
  data?: {
    avatar?: string;
    icon?: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IGetStreamAudience {
  groups: IGetStreamAudienceGroup[];
  users: IGetStreamAudienceUser[];
}

export interface IParamSearchMentionAudiences {
  key?: string;
  groupIds?: string;
  userIds?: string;
  skip?: number;
  take?: number;
}

export interface IMentionUser {
  id: string;
  username: string;
  email?: string;
  fullname: string;
  avatar: string;
  beinStaffRole?: string;
  chatUserId?: string;
}

export interface IParamGetReactionDetail {
  reactionName: ReactionType;
  targetId: string;
  target: 'POST' | 'COMMENT';
  limit?: number;
  order?: 'ASC' | 'DESC';
  latestId?: string;
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
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
}

export interface IParamPutReaction {
  reactionName: string;
  target: 'POST' | 'COMMENT';
  targetId: string;
}

export interface IParamDeleteReaction {
  target: 'POST' | 'COMMENT';
  reactionId: string;
  targetId: string;
  reactionName: string;
}

export interface IParamPutReactionToComment {
  commentId: string;
  data: string[];
}

export interface IPayloadUpdateCommentsById {
  id: string;
  comments: ICommentData[];
  isMerge?: boolean;
  isReplace?: boolean;
  commentId?: string;
}

export interface ICreatePostParams {
  draftPostId?: string;
  postId?: string;
  replaceWithDetail?: boolean;
  initAudience?: any;
  createFromGroupId?: string;
  initAutoSaveDraft?: boolean;
}

export interface IPostSettingsParams extends ICreatePostParams {
  postId?: string;
}

export interface IPayloadReplying {
  comment: ICommentData;
  parentComment?: ICommentData;
}

export interface IPayloadSetDraftPosts {
  posts?: IPostActivity[];
  canLoadMore?: boolean;
  loading?: boolean;
  refreshing?: boolean;
}

export interface IParamGetDraftPosts {
  order?: 'ASC';
  offset?: number;
  limit?: number;
  idGte?: string;
  idLte?: string;
  idGt?: string;
  idLt?: string;
  isProcessing?: boolean;
}

export interface IPayloadGetDraftPosts {
  isRefresh?: boolean;
  offset?: number;
  isProcessing?: boolean;
}

export interface IPayloadPublishDraftPost {
  draftPostId: string;
  replaceWithDetail?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  refreshDraftPosts?: boolean;
  createFromGroupId?: string;
}

export interface IPayloadPutEditDraftPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  publishNow: boolean;
  callback?: any;
  createFromGroupId?: string;
}

export interface IPayloadPutEditAutoSave {
  id: string;
  data: IPostCreatePost;
}

export interface IParamGetPostAudiences {
  key?: string;
  groupIds: string;
}

export interface IPayloadUpdateReaction {
  userId: string;
  data: ISocketReaction;
}

export interface ISocketReaction {
  actor: any;
  id: string;
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
  commentId: string;
  parentCommentId?: string;
  postId: string;
}

export interface IPayloadPutMarkAsRead {
  postId: string;
  callback?: (isSuccess: boolean) => void;
}
export interface IPayloadPutMarkSeenPost {
  postId: string;
  callback?: (isSuccess: boolean) => void;
}
export interface IGetStreamCommentData {
  id: string;
  actor: IGetStreamUser;
  mentions?: any;
  content?: string;
  media?: any;
  reaction?: IReaction;
  reactionsCount?: IReactionCounts;
  child?: IGetStreamCommentData;
}
export interface IRequestGetUsersSeenPost {
  postId: string;
  limit?: number;
  offset?: number;
}
export interface ISeenPostListSheet {
  total?: number;
  data: any[];
  canLoadMore?: boolean;
}
export interface IGetSeenPostListSheet {
  postId: string;
  offset?: number;
  canLoadMore?: boolean;
}
