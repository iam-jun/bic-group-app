import { IFilePicked } from '~/interfaces/common';
import { ReactionType } from '~/constants/reactions';
import { ICategory } from '~/interfaces/IArticle';
import { IGiphy } from './IGiphy';
import { ITag } from './ITag';
import { IReportDetail } from './IReport';
import { IGroup } from './IGroup';

export enum PostType {
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  SERIES = 'SERIES',
}

export enum TargetType {
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  SERIES = 'SERIES',
  COMMENT = 'COMMENT',
  COMMENT_ARTICLE = 'COMMENT.ARTICLE',
  COMMENT_POST = 'COMMENT.POST',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  WAITING_SCHEDULE = 'WAITING_SCHEDULE',
  SCHEDULE_FAILED = 'SCHEDULE_FAILED',
}

export interface IPost {
  id?: string;
  audience?: IPostAudience;
  items?: IPostArticles[];
  communities?: IPostCommunities[];
  content?: string;
  highlight?: string;
  media?: IPostMedia;
  setting?: IPostSetting;
  status?: PostStatus;
  isProcessing?: boolean;
  actor?: IAudienceUser;
  mentions?: any;
  commentsCount?: number;
  comments?: IPostComments;
  reactionsCount?: IReactionCounts;
  ownerReactions?: IOwnReaction;
  markedReadPost?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  totalUsersSeen?: number;
  deleted?: boolean;
  markedReadSuccess?: boolean;
  linkPreview?: ILinkPreview;
  type?: PostType;
  title?: string;
  summary?: string;
  titleHighlight?: string;
  summaryHighlight?: string;
  hashtags?: string[];
  coverMedia?: IArticleCover;
  categories?: ICategory[];
  isSaved?: boolean;
  tags?: ITag[];
  series?: any[];
  reported?: boolean;
  reportDetails?: IReportDetail[];
  isReported?: boolean;
  isHidden?: boolean;
  publishedAt?: string;
}

export interface IPostAudience {
  users?: IAudienceUser[];
  groups?: IAudienceGroup[];
}

export interface IPostArticles {
  id?: string;
  title?: string;
}

export interface IPostCommunities {
  communityId?: string;
  icon?: string;
  id?: string;
  name?: string;
  privacy?: string;
}

export interface IAudienceUser {
  data?: any;
  id?: string;
  username?: string;
  fullname?: string;
  avatar?: string;
  isDeactivated?: boolean;
  isVerified?: boolean;
}

export interface IAudienceGroup {
  id?: string;
  name?: string;
  icon?: string;
  child?: number[];
  rootGroupId?: string;
  isPinned?: boolean;
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
  isDeactivated?: boolean;
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
  expiresTime?: string | null;
  chosenSuggestedTime?: string;
  neverExpires?: boolean;
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
  giphyId?: string;
  giphyUrl?: string;
  edited?: boolean;
  reported?: boolean;
  reportDetails?: IReportDetail[];
}

export interface ICreatePostImage {
  fileName?: string;
  file?: IFilePicked;
  url?: string;
  id?: string;
}

export interface ICreatePostSettings {
  important?: IActivityImportant;
  canComment?: boolean;
  canReact?: boolean;
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

export interface IArticleCover {
  id?: string;
  url?: string;
  type?: string;
  createdBy?: string;
  name?: string;
  originName?: string;
  width?: number;
  height?: number;
  extension?: string;
  status?: string;
  size?: number;
  mimeType?: string;
  thumbnails?: any,
  createdAt?: string;
}

export type IOwnReaction = Array<IReaction>;

export type IReactionCounts = {
  [x: string]: { [reactionKind: string]: number };
};

export interface IAllPosts {
  [id: string]: IPost;
}

export interface IAllComments {
  [id: string]: ICommentData;
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
  status?: PostStatus;
  linkPreview?: ILinkPreview;
  createFromGroupId?: string;
  tags?: string[];
  series?: string[];
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
  data?: IPostCreatePost;
  replaceWithDetail?: boolean;
  onRetry?: () => void;
  msgSuccess?: string;
  msgError?: string;
  disableNavigate?: boolean;
  onError?: () => void;
  isPublish?: boolean;
  createFromGroupId?: string;
  isHandleSeriesTagsError?: boolean;
  isRefresh?: boolean;
}

export interface IPayloadPutEditComment {
  id: string;
  comment: ICommentData;
  data: ICommentData;
  postId: string;
}

export interface IPayloadDeletePost {
  id: string;
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
export interface IParamUpdatePost {
  postId: string;
  data: IPostCreatePost;
}

export interface IPayloadGetPostDetail extends IParamGetPostDetail {
  callbackLoading?: (loading: boolean, success: boolean) => void;
  showToast?: boolean;
  isReported?: boolean;
}

export type IReactionKind = 'comment' | 'seen' | ReactionType;

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
  targetChildLimit?: number;
}

export interface IPayloadGetCommentsById {
  position?: string;
  commentId?: string;
  params?: IRequestGetPostComment;
  isReported?: boolean;
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
  parentCommentId?: string; // used when retry/cancel adding new comment
  child?: any;
  actor?: IAudienceUser;
  activity_id?: string;
  userId?: string;
  data?: any;
}

export interface IParamSearchMentionAudiences {
  key?: string;
  groupIds?: string;
  offset?: number;
  limit?: number;
  sort?: string;
}

export interface IMentionUser {
  id: string;
  username: string;
  email?: string;
  fullname: string;
  avatar: string;
  beinStaffRole?: string;
  chatUserId?: string;
  isDeactivated?: boolean;
}

export interface IParamGetReactionDetail {
  reactionName: ReactionType;
  targetId: string;
  target: TargetType;
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
  data: IPost[] | IPost;
  handleComment?: boolean;
}

export interface IPayloadReactToPost {
  id: string;
  reactionId: ReactionType;
  ownReaction: IOwnReaction;
  reactionsCount: IReactionCounts;
}

export interface IPayloadReactToComment {
  id: string;
  comment: ICommentData;
  postId?: string;
  parentCommentId?: string;
  reactionId: ReactionType;
  ownerReactions: IOwnReaction;
  reactionsCount: IReactionCounts;
}

export interface IParamPutReaction {
  reactionName: string;
  target: TargetType;
  targetId: string;
}

export interface IParamDeleteReaction {
  target: TargetType;
  reactionId: string;
  targetId: string;
  reactionName: string;
}

export interface IPayloadUpdateCommentsById {
  id: string;
  commentIds: string[];
  isMerge?: boolean;
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

export interface IParamGetDraftContents {
  order?: 'ASC';
  offset?: number;
  limit?: number;
  idGte?: string;
  idLte?: string;
  idGt?: string;
  idLt?: string;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGte?: string;
  createdAtLte?: string;
  isFailed?: boolean;
  isProcessing?: boolean;
  type?: PostType;
}

export interface IPayloadGetDraftContents {
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
  isHandleSeriesTagsError?: boolean;
}

export interface IPayloadPutEditDraftPost {
  id: string;
  data: IPostCreatePost;
  replaceWithDetail?: boolean;
  publishNow: boolean;
  callback?: any;
  createFromGroupId?: string;
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
}
export interface IRequestGetUsersInterestedPost {
  postId: string;
  limit?: number;
  offset?: number;
}
export interface ISeenPostListSheet {
  total?: number;
  data: any[];
  canLoadMore?: boolean;
}

export interface IPayloadUpdateLinkPreview {
  lstLinkPreview?: ILinkPreviewCreatePost[];
  lstRemovedLinkPreview?: string[];
}

export interface ILinkPreview {
  url: string;
  domain: string;
  title: string;
  image: string;
  description: string;
}

export interface ILinkPreviewCreatePost extends Partial<ILinkPreview> {
  isLoading?: boolean;
}

export interface IAddChildCommentToComment {
  commentId: string | number;
  childComments: ICommentData[];
  shouldAddChildrenCount?: boolean;
  meta?: any;
  isAddFirst?: boolean;
}

export interface IParamsGetPostByParams {
  status: string;
  offset?: number;
  limit?: number;
}

export interface IRemoveChildComment {
  localId: string;
  parentCommentId: string;
  postId: string;
}

export interface IRemoveComment {
  commentId?: string;
  localId?: string;
  postId: string;
}
export interface ICreatePostTags {
  id?: string;
  name?: string;
  slug?: string;
  total?: number;
}
export interface ICreatePostSeries {
  id?: string;
  title?: string;
}

export interface IErrorContent {
  isError?: boolean;
  code?: string;
  message?: string;
  requireGroups?: IGroup[];
}

export interface IPayloadGetPublishContents {
  isRefresh?: boolean;
  offset?: number;
  isProcessing?: boolean;
}
