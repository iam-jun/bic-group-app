import postTypes from './types';
import {
  IAudience,
  IPostActivity,
  IPostCreatePost,
  IActivityData,
  IActivityImportant,
  IReaction,
  IParamSearchMentionAudiences,
  IAllPosts,
  IPayloadReactToPost,
  IPayloadPutEditPost,
  IPostAudienceSheet,
  IPayloadUpdateCommentsById, IPayloadGetCommentsById,
} from '~/interfaces/IPost';
import {IGroup} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';

const postActions = {
  setAllPosts: (payload: IAllPosts) => ({
    type: postTypes.SET_ALL_POSTS,
    payload,
  }),
  setOpenPostToolBarModal: (payload: boolean) => ({
    type: postTypes.SET_OPEN_POST_TOOLBAR_MODAL,
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
  setCreatePostChosenAudiences: (payload: IAudience[]) => ({
    type: postTypes.SET_CREATE_POST_CHOSEN_AUDIENCES,
    payload,
  }),
  setCreatePostImportant: (payload?: IActivityImportant) => ({
    type: postTypes.SET_CREATE_POST_IMPORTANT,
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
  //post detail
  setPostDetail: (payload: IPostActivity) => ({
    type: postTypes.SET_POST_DETAIL,
    payload,
  }),
  setPostDetailReplyingComment: (payload?: IReaction) => ({
    type: postTypes.SET_POST_DETAIL_REPLYING_COMMENT,
    payload,
  }),
  //mention
  setMentionSearchKey: (payload: string) => ({
    type: postTypes.SET_MENTION_SEARCH_KEY,
    payload,
  }),
  setMentionSearchResult: (payload: any[]) => ({
    type: postTypes.SET_MENTION_SEARCH_RESULT,
    payload,
  }),
  setAllCommentsByParentIds: (payload: {[x: string]: IReaction}) => ({
    type: postTypes.SET_ALL_COMMENTS_BY_PARENT_IDS,
    payload,
  }),

  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
    payload,
  }),
  putEditPost: (payload: IPayloadPutEditPost) => ({
    type: postTypes.PUT_EDIT_POST,
    payload,
  }),
  deletePost: (payload: string) => ({
    type: postTypes.DELETE_POST,
    payload,
  }),
  addToAllPosts: (payload: IPostActivity[] | IPostActivity) => ({
    type: postTypes.ADD_TO_ALL_POSTS,
    payload,
  }),
  getSearchMentionAudiences: (payload: IParamSearchMentionAudiences) => ({
    type: postTypes.GET_SEARCH_MENTION_AUDIENCES,
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
  updateAllCommentsByParentIdsWithComments: (
    payload: IPayloadUpdateCommentsById,
  ) => ({
    type: postTypes.UPDATE_ALL_COMMENTS_BY_PARENT_IDS_WITH_COMMENTS,
    payload,
  }),
  getCommentsById: (payload: IPayloadGetCommentsById) => ({
    type: postTypes.GET_COMMENTS_BY_IDS,
    payload,
  }),
};

export default postActions;
