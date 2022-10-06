import postTypes from './types';
import {
  IAudience,
  IActivityData,
  IPayloadReactToPost,
  IPayloadPutEditPost,
  IPayloadGetCommentsById,
  IPayloadReactToComment,
  IPayloadPutEditComment,
  IPayloadCreateComment,
  IPayloadReplying,
  IPayloadGetPostDetail,
  ICreatePostImage,
  ICreatePostSettings,
  ICreatePostCurrentSettings,
  IPayloadPublishDraftPost,
  IPayloadPutEditDraftPost,
  IPostAudience,
  IParamGetPostAudiences,
  IPayloadUpdateReaction,
  IPayloadDeletePost,
  IPayloadDeleteComment,
  ICommentData,
  IPayloadPutMarkAsRead,
  IPayloadPutMarkSeenPost,
  IPayloadRemoveAudiencesOfPost,
  IPayloadUpdateLinkPreview,
} from '~/interfaces/IPost';
import { IGroup } from '~/interfaces/IGroup';
import { IUser } from '~/interfaces/IAuth';
import { IFilePicked } from '~/interfaces/common';
import { IGetFile } from '~/services/imageUploader';

const postActions = {
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
  setCreatePostCurrentSettings: (payload: ICreatePostCurrentSettings) => ({
    type: postTypes.SET_CREATE_POST_CURRENT_SETTINGS,
    payload,
  }),
  // post detail
  setPostDetailReplyingComment: (payload?: IPayloadReplying) => ({
    type: postTypes.SET_POST_DETAIL_REPLYING_COMMENT,
    payload,
  }),
  setPostSelectAudienceState: (payload?: {
    loading?: boolean;
    selectingAudiences?: (IGroup | IUser)[];
    selectingGroups?: {[x: string]: IGroup};
  }) => ({
    type: postTypes.SET_POST_SELECT_AUDIENCE_STATE,
    payload,
  }),

  // saga
  postCreateNewComment: (payload: IPayloadCreateComment) => ({
    type: postTypes.POST_CREATE_NEW_COMMENT,
    payload,
  }),
  setScrollToLatestItem: (payload: null | {parentCommentId?: string | number}) => ({
    type: postTypes.SET_SCROLL_TO_LATEST_ITEM,
    payload,
  }),
  postRetryAddComment: (payload: ICommentData) => ({
    type: postTypes.POST_RETRY_ADD_COMMENT,
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
  hidePostAudiencesBottomSheet: () => ({
    type: postTypes.HIDE_POST_AUDIENCES_BOTTOM_SHEET,
  }),
  getCommentsByPostId: (payload: IPayloadGetCommentsById) => ({
    type: postTypes.GET_COMMENTS_BY_POST_ID,
    payload,
  }),
  getPostDetail: (payload: IPayloadGetPostDetail) => ({
    type: postTypes.GET_POST_DETAIL,
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
  getCommentDetail: (payload: IPayloadGetCommentsById) => ({
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
  putMarkSeenPost: (payload: IPayloadPutMarkSeenPost) => ({
    type: postTypes.PUT_MARK_SEEN_POST,
    payload,
  }),
  deletePostLocal: (payload: string) => ({
    type: postTypes.DELETE_POST_LOCAL,
    payload,
  }),
  getAllPostContainingVideoInProgress: () => ({
    type: postTypes.GET_POSTS_CONTAINING_VIDEO_IN_PROGRESS,
  }),
  setAllPostContainingVideoInProgress: (payload: any) => ({
    type: postTypes.SET_POSTS_CONTAINING_VIDEO_IN_PROGRESS,
    payload,
  }),
  updateAllPostContainingVideoInProgress: (payload: any) => ({
    type: postTypes.UPDATE_POSTS_CONTAINING_VIDEO_IN_PROGRESS,
    payload,
  }),
  removePostAudiences: (payload:IPayloadRemoveAudiencesOfPost) => ({
    type: postTypes.REMOVE_POST_AUDIENCES,
    payload,
  }),
  updateLinkPreview: (payload: IPayloadUpdateLinkPreview) => ({
    type: postTypes.UPDATE_LINK_PREVIEW,
    payload,
  }),
};

export default postActions;
