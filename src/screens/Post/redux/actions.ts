import postTypes from './types';
import {
  IAudience,
  IPostActivity,
  IPostCreatePost,
  IActivityData,
  IActivityImportant,
  IReaction,
  IParamSearchMentionAudiences,
} from '~/interfaces/IPost';
import {IGroup} from '~/interfaces/IGroup';
import {IUser} from '~/interfaces/IAuth';

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
  getSearchMentionAudiences: (payload: IParamSearchMentionAudiences) => ({
    type: postTypes.GET_SEARCH_MENTION_AUDIENCES,
    payload,
  }),
};

export default postActions;
