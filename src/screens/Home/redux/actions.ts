import postTypes from './types';
import {IPostAudience, IPostCreatePost, IPostData} from '~/interfaces/IPost';

const postActions = {
  setLoadingCreatePost: (payload: boolean) => ({
    type: postTypes.SET_LOADING_CREATE_POST,
    payload,
  }),
  clearCreatPostData: () => ({
    type: postTypes.CLEAR_CREATE_POST_DATA,
  }),
  setCreatePostData: (payload: IPostData) => ({
    type: postTypes.SET_CREATE_POST_DATA,
    payload,
  }),
  setCreatePostAudience: (payload: IPostAudience) => ({
    type: postTypes.SET_CREATE_POST_AUDIENCE,
    payload,
  }),
  setCreatePostTags: (payload: string[]) => ({
    type: postTypes.SET_CREATE_POST_AUDIENCE,
    payload,
  }),
  //saga
  postCreateNewPost: (payload: IPostCreatePost) => ({
    type: postTypes.POST_CREATE_NEW_POST,
    payload,
  }),
};

export default postActions;
