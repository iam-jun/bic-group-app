import {
  IAllPosts, IPayloadAddToAllPost, IPayloadDeletePost, IPayloadPutEditPost, IPayloadPutMarkSeenPost, IPost,
} from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import addToPosts from './actions/addToPosts';
import deletePost from './actions/deletePost';
import deletePostLocal from './actions/deletePostLocal';
import putEditPost from './actions/putEditPost';
import putMarkSeenPost from './actions/putMarkSeenPost';

export interface IPostsState extends IBaseState {
  posts: { [id: string]: IPost };

  actions: {
    setPosts: (payload?: IAllPosts) => void;
    addToPosts: (payload: IPayloadAddToAllPost) => void;
    deletePost: (payload: IPayloadDeletePost) => void;
    deletePostLocal: (id: string) => void;
    putEditPost: (payload: IPayloadPutEditPost) => void;
    putMarkSeenPost: (payload: IPayloadPutMarkSeenPost) => void;
  };
}

const initState: InitStateType<IPostsState> = {
  posts: {},
};

const postsStore = (set, get) => ({
  ...initState,

  actions: {
    setPosts: (payload?: IAllPosts) => {
      set((state: IPostsState) => {
        state.posts = payload || {};
      }, 'setPosts');
    },

    addToPosts: addToPosts(set, get),
    deletePost: deletePost(set, get),
    deletePostLocal: deletePostLocal(set, get),
    putEditPost: putEditPost(set, get),
    putMarkSeenPost: putMarkSeenPost(),
  },

  reset: () => resetStore(initState, set),
});

const usePostsStore = createStore<IPostsState>(postsStore);

export default usePostsStore;
