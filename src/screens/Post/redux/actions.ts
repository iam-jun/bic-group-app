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
  IPayloadReactToId,
  IPayloadPutEditPost,
  IPostAudienceSheet,
  IPayloadUpdateCommentsById,
  IPayloadGetCommentsById,
  IAllComments,
} from '~/interfaces/IPost';
import {IGroup} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';
import {ReactionType} from '~/constants/reactions';

const postActions = {
  setAllPosts: (payload: IAllPosts) => ({
    type: postTypes.SET_ALL_POSTS,
    payload,
  }),
  setAllComments: (payload: IAllComments) => ({
    type: postTypes.SET_ALL_COMMENTS,
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
  setShowReactionBottomSheet: (payload?: {
    show?: boolean;
    title?: string;
    callback?: (reactionId: ReactionType) => void;
  }) => ({
    type: postTypes.SET_SHOW_REACTION_BOTTOM_SHEET,
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
  addToAllComments: (payload: IReaction[] | IReaction) => ({
    type: postTypes.ADD_TO_ALL_COMMENTS,
    payload,
  }),
  getSearchMentionAudiences: (payload: IParamSearchMentionAudiences) => ({
    type: postTypes.GET_SEARCH_MENTION_AUDIENCES,
    payload,
  }),
  postReactToPost: (payload: IPayloadReactToId) => ({
    type: postTypes.POST_REACT_TO_POST,
    payload,
  }),
  deleteReactToPost: (payload: IPayloadReactToId) => ({
    type: postTypes.DELETE_REACT_TO_POST,
    payload,
  }),
  postReactToComment: (payload: IPayloadReactToId) => ({
    type: postTypes.POST_REACT_TO_COMMENT,
    payload,
  }),
  deleteReactToComment: (payload: IPayloadReactToId) => ({
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
