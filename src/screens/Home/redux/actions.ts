import {IPostActivity} from '~/interfaces/IPost';
import homeTypes from './types';
import {IPayloadGetHomePost} from '~/interfaces/IHome';

const homeActions = {
  setHomePostsImportantCount: (payload: string) => {
    return {
      type: homeTypes.SET_HOME_POSTS_IMPORTANT_COUNT,
      payload,
    };
  },
  setLoadingHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_LOADING_HOME_POSTS,
      payload,
    };
  },
  setRefreshingHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_REFRESHING_HOME_POSTS,
      payload,
    };
  },
  setNoMoreHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_NO_MORE_HOME_POSTS,
      payload,
    };
  },

  setHomePosts: (payload: IPostActivity) => {
    return {
      type: homeTypes.SET_HOME_POSTS,
      payload,
    };
  },

  // FOR SAGA:
  getHomePosts: (payload: IPayloadGetHomePost) => {
    return {
      type: homeTypes.GET_HOME_POSTS,
      payload,
    };
  },
};

export default homeActions;
