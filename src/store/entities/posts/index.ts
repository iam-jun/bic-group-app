import { IAllPosts } from '~/interfaces/IPost';
import { createStore, resetStore } from '~/store/utils';
import addToPosts from './actions/addToPosts';
import IPostsState from './Interface';

const initState: IPostsState = {
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
  },

  reset: () => resetStore(initState, set),
});

const usePostsStore = createStore<IPostsState>(postsStore);

export default usePostsStore;
