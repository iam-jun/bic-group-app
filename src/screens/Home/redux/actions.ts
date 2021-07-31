import {IPostActivity} from '~/interfaces/IPost';
import homeTypes from './types';

const homeActions = {
  setLoadingHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_LOADING_HOME_POSTS,
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
  getHomePosts: (payload?: number) => {
    return {
      type: homeTypes.GET_HOME_POSTS,
      payload,
    };
  },
};

export default homeActions;
