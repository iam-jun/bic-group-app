import { createStore, resetStore } from '~/store/utils';
import IDraftPostState from './Interface';
import getDraftPosts from './actions/getDraftPosts';

const initState: IDraftPostState = {
  posts: [],
  hasNextPage: true,
  loading: false,
  refreshing: false,
  total: 0,
};

const draftPostStore = (set, get) => ({
  ...initState,

  actions: {
    getDraftPosts: getDraftPosts(set, get),
  },

  reset: () => resetStore(initState, set),
});

const useDraftPostStore = createStore<IDraftPostState>(draftPostStore);

export default useDraftPostStore;
