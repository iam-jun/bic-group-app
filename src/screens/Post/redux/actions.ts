import postTypes from './types';
import {
  IAudience,
  IPostActivity,
  IPostCreatePost,
  IActivityData,
  IActivityImportant,
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
  setPostDetail: (payload: IPostActivity) => ({
    type: postTypes.SET_POST_DETAIL,
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
  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
    payload,
  }),
};

export default postActions;
