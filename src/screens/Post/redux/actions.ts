import postTypes from './types';
import {
  IAudience,
  IPostCreatePost,
  IActivityData,
  IActivityImportant,
  IReaction,
  IAllPosts,
  IPayloadReactToPost,
  IPayloadPutEditPost,
  IPostAudienceSheet,
  IPayloadUpdateCommentsById,
  IPayloadGetCommentsById,
  IAllComments,
  IPayloadReactToComment,
  IPayloadPutEditComment,
  IPayloadCreateComment,
  IPayloadReplying,
  IPayloadGetPostDetail,
  ICreatePostImage,
  ICreatePostSettings,
  ICreatePostCurrentSettings,
  IPayloadGetDraftPosts,
  IPayloadSetDraftPosts,
  IPayloadPublishDraftPost,
  IPayloadPutEditDraftPost,
  IPayloadAddToAllPost,
  IPostAudience,
  IParamGetPostAudiences,
  IPayloadUpdateReaction,
  IPayloadDeletePost,
  IPayloadDeleteComment,
  ICommentData,
  IPayloadPutMarkAsRead,
} from '~/interfaces/IPost';
import {IGroup} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';
import {ReactionType} from '~/constants/reactions';
import {IFilePicked} from '~/interfaces/common';
import {IGetFile} from '~/services/imageUploader';

const postActions = {
  setAllPosts: (payload: IAllPosts) => ({
    type: postTypes.SET_ALL_POSTS,
    payload,
  }),
  setAllComments: (payload: IAllComments) => ({
    type: postTypes.SET_ALL_COMMENTS,
    payload,
  }),
  setLoadingCreatePost: (payload: boolean) => ({
    type: postTypes.SET_LOADING_CREATE_POST,
    payload,
  }),
  clearCreatPostData: () => ({
    type: postTypes.CLEAR_CREATE_POST,
  }),
  setCreatePostData: (payload: IActivityData) => ({
    type: postTypes.SET_CREATE_POST_DATA,
    payload,
  }),
  setCreatePostDataImages: (payload: ICreatePostImage[]) => ({
    type: postTypes.SET_CREATE_POST_DATA_IMAGES,
    payload,
  }),
  setCreateComment: (payload: {
    loading?: boolean;
    content?: string;
    image?: any;
  }) => ({
    type: postTypes.SET_CREATE_COMMENT,
    payload,
  }),
  setCreatePostChosenAudiences: (payload: IAudience[]) => ({
    type: postTypes.SET_CREATE_POST_CHOSEN_AUDIENCES,
    payload,
  }),
  setCreatePostImportant: (payload?: IActivityImportant) => ({
    type: postTypes.SET_CREATE_POST_IMPORTANT,
    payload,
  }),
  setCreatePostImages: (payload: ICreatePostImage[]) => ({
    type: postTypes.SET_CREATE_POST_IMAGES,
    payload,
  }),
  setCreatePostSettings: (payload: ICreatePostSettings) => ({
    type: postTypes.SET_CREATE_POST_SETTINGS,
    payload,
  }),
  setCreatePostImagesDraft: (payload: ICreatePostImage[]) => ({
    type: postTypes.SET_CREATE_POST_IMAGES_DRAFT,
    payload,
  }),
  setCreatePostVideo: (payload?: any) => ({
    type: postTypes.SET_CREATE_POST_VIDEO,
    payload,
  }),
  setCreatePostFiles: (payload?: IFilePicked[]) => ({
    type: postTypes.SET_CREATE_POST_FILES,
    payload,
  }),
  setCreatePostFile: (payload?: IGetFile) => ({
    type: postTypes.SET_CREATE_POST_FILE,
    payload,
  }),
  addCreatePostFiles: (payload?: IFilePicked[]) => ({
    type: postTypes.ADD_CREATE_POST_FILES,
    payload,
  }),
  removeCreatePostFile: (payload?: IFilePicked | IGetFile) => ({
    type: postTypes.REMOVE_CREATE_POST_FILE,
    payload,
  }),
  setCreatePostInitAudiences: (payload?: IPostAudience) => ({
    type: postTypes.SET_CREATE_POST_INIT_AUDIENCES,
    payload,
  }),
  setSearchResultAudienceGroups: (payload: IGroup[]) => ({
    type: postTypes.SET_SEARCH_RESULT_AUDIENCE_GROUPS,
    payload,
  }),
  setSearchResultAudienceUsers: (payload: IUser[]) => ({
    type: postTypes.SET_SEARCH_RESULT_AUDIENCE_USERS,
    payload,
  }),
  setDraftPosts: (payload?: IPayloadSetDraftPosts) => ({
    type: postTypes.SET_DRAFT_POSTS,
    payload,
  }),
  setCreatePostCurrentSettings: (payload: ICreatePostCurrentSettings) => ({
    type: postTypes.SET_CREATE_POST_CURRENT_SETTINGS,
    payload,
  }),
  //post detail
  setPostDetailReplyingComment: (payload?: IPayloadReplying) => ({
    type: postTypes.SET_POST_DETAIL_REPLYING_COMMENT,
    payload,
  }),
  setAllCommentsByParentIds: (payload: {[x: string]: IReaction}) => ({
    type: postTypes.SET_ALL_COMMENTS_BY_PARENT_IDS,
    payload,
  }),
  setShowReactionBottomSheet: (payload?: {
    show?: boolean;
    title?: string;
    position?: {x: number; y: number};
    callback?: (reactionId: ReactionType) => void;
  }) => ({
    type: postTypes.SET_SHOW_REACTION_BOTTOM_SHEET,
    payload,
  }),
  setPostSelectAudienceState: (payload?: {
    loading?: boolean;
    selectingAudiences?: (IGroup | IUser)[];
    selectingGroups?: {[x: string]: IGroup};
    selectingUsers?: {[x: string]: IUser};
  }) => ({
    type: postTypes.SET_POST_SELECT_AUDIENCE_STATE,
    payload,
  }),

  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
    payload,
  }),
  postCreateNewComment: (payload: IPayloadCreateComment) => ({
    type: postTypes.POST_CREATE_NEW_COMMENT,
    payload,
  }),
  updateCommentAPI: (payload: {
    localId?: string | number[];
    status: 'pending' | 'success' | 'failed';
    postId: string;
    resultComment: IReaction;
    parentCommentId?: string;
  }) => ({
    type: postTypes.UPDATE_COMMENT_API,
    payload,
  }),
  setScrollToLatestItem: (
    payload: null | {parentCommentId?: string | number},
  ) => ({
    type: postTypes.SET_SCROLL_TO_LATEST_ITEM,
    payload,
  }),
  postRetryAddComment: (payload: ICommentData) => ({
    type: postTypes.POST_RETRY_ADD_COMMENT,
    payload,
  }),
  postCancelFailedComment: (payload: ICommentData) => ({
    type: postTypes.POST_CANCEL_FAILED_COMMENT,
    payload,
  }),

  putEditPost: (payload: IPayloadPutEditPost) => ({
    type: postTypes.PUT_EDIT_POST,
    payload,
  }),
  putEditComment: (payload: IPayloadPutEditComment) => ({
    type: postTypes.PUT_EDIT_COMMENT,
    payload,
  }),
  deletePost: (payload: IPayloadDeletePost) => ({
    type: postTypes.DELETE_POST,
    payload,
  }),
  addToAllPosts: (payload: IPayloadAddToAllPost) => ({
    type: postTypes.ADD_TO_ALL_POSTS,
    payload,
  }),
  addToAllComments: (payload: IReaction[] | IReaction) => ({
    type: postTypes.ADD_TO_ALL_COMMENTS,
    payload,
  }),
  postReactToPost: (payload: IPayloadReactToPost) => ({
    type: postTypes.POST_REACT_TO_POST,
    payload,
  }),
  deleteReactToPost: (payload: IPayloadReactToPost) => ({
    type: postTypes.DELETE_REACT_TO_POST,
    payload,
  }),
  postReactToComment: (payload: IPayloadReactToComment) => ({
    type: postTypes.POST_REACT_TO_COMMENT,
    payload,
  }),
  deleteReactToComment: (payload: IPayloadReactToComment) => ({
    type: postTypes.DELETE_REACT_TO_COMMENT,
    payload,
  }),
  setPostAudiencesBottomSheet: (payload: IPostAudienceSheet) => ({
    type: postTypes.SET_POST_AUDIENCES_BOTTOM_SHEET,
    payload,
  }),
  showPostAudiencesBottomSheet: (payload: {
    postId: string;
    fromStack: string;
  }) => ({
    type: postTypes.SHOW_POST_AUDIENCES_BOTTOM_SHEET,
    payload,
  }),
  hidePostAudiencesBottomSheet: () => ({
    type: postTypes.HIDE_POST_AUDIENCES_BOTTOM_SHEET,
  }),
  updateAllCommentsByParentIds: (payload: {[postId: string]: IReaction[]}) => ({
    type: postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS,
    payload,
  }),
  updateAllCommentsByParentIdsWithComments: (
    payload: IPayloadUpdateCommentsById,
  ) => ({
    type: postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS,
    payload,
  }),
  getCommentsByPostId: (payload: IPayloadGetCommentsById) => ({
    type: postTypes.GET_COMMENTS_BY_POST_ID,
    payload,
  }),
  getPostDetail: (payload: IPayloadGetPostDetail) => ({
    type: postTypes.GET_POST_DETAIL,
    payload,
  }),
  getDraftPosts: (payload?: IPayloadGetDraftPosts) => ({
    type: postTypes.GET_DRAFT_POSTS,
    payload,
  }),
  postPublishDraftPost: (payload: IPayloadPublishDraftPost) => ({
    type: postTypes.POST_PUBLISH_DRAFT_POST,
    payload,
  }),
  putEditDraftPost: (payload: IPayloadPutEditDraftPost) => ({
    type: postTypes.PUT_EDIT_DRAFT_POST,
    payload,
  }),
  getCreatePostInitAudience: (payload: IParamGetPostAudiences) => ({
    type: postTypes.GET_CREATE_POST_INIT_AUDIENCES,
    payload,
  }),
  updateReactionBySocket: (payload: IPayloadUpdateReaction) => ({
    type: postTypes.UPDATE_REACTION_BY_SOCKET,
    payload,
  }),
  updateUnReactionBySocket: (payload: IPayloadUpdateReaction) => ({
    type: postTypes.UPDATE_UN_REACTION_BY_SOCKET,
    payload,
  }),
  setSavingDraftPost: (payload: boolean) => ({
    type: postTypes.SET_SAVING_DRAFT_POST,
    payload,
  }),
  deleteComment: (payload: IPayloadDeleteComment) => ({
    type: postTypes.DELETE_COMMENT,
    payload,
  }),
  setScrollCommentsPosition: (payload: null | {position?: string}) => ({
    type: postTypes.SET_SCROLL_TO_COMMENTS_POSITION,
    payload,
  }),
  setLoadingGetPostDetail: (payload: boolean) => ({
    type: postTypes.LOADING_GET_POST_DETAIL,
    payload,
  }),
  setCommentErrorCode: (payload: boolean | string) => ({
    type: postTypes.SET_COMMENT_ERROR_CODE,
    payload,
  }),
  removeChildComment: (payload: any) => ({
    type: postTypes.REMOVE_CHILD_COMMENT,
    payload,
  }),
  getCommentDetail: (payload: any) => ({
    type: postTypes.GET_COMMENT_DETAIL,
    payload,
  }),
  putMarkAsRead: (payload: IPayloadPutMarkAsRead) => ({
    type: postTypes.PUT_MARK_AS_READ,
    payload,
  }),
  removeCommentLevel1Deleted: (payload: any) => ({
    type: postTypes.REMOVE_COMMENT_DELETED,
    payload,
  }),
};

export default postActions;
