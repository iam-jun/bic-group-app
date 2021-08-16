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

  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
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
};

export default postActions;
