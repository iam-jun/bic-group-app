import {IPostActivity} from '~/interfaces/IPost';
import homeTypes from './types';
import {
  IPayloadGetHomePost,
  IPayloadSetNewsfeedSearch,
} from '~/interfaces/IHome';

const homeActions = {
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

  setNewsfeedSearch: (payload: IPayloadSetNewsfeedSearch) => {
    return {
      type: homeTypes.SET_NEWSFEED_SEARCH,
      payload,
    };
  },

  clearNewsfeedSearch: () => {
    return {
      type: homeTypes.CLEAR_NEWSFEED_SEARCH,
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
