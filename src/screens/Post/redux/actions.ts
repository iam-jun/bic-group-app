import postTypes from './types';
import {
  IAudience,
  IPostActivity,
  IPostCreatePost,
  IActivityData,
} from '~/interfaces/IPost';

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
  setPostDetail: (payload: IPostActivity) => ({
    type: postTypes.SET_POST_DETAIL,
    payload,
  }),
  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
    payload,
  }),
};

export default postActions;
