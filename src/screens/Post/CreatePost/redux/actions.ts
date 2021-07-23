import postTypes from './constants';
import IPost from '~/interfaces/IPost';

const postActions = {
  setPosts: (payload: IPost[]) => ({
    type: postTypes.SET_POSTS,
    payload,
  }),
  selectPost: (payload: IPost) => ({
    type: postTypes.SELECT_POST,
    payload,
  }),
};

export default postActions;
