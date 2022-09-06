import { createStore, resetStore } from '~/store/utils';
import IDraftPostState from './Interface';
import getDraftPosts from './actions/getDraftPosts';

const initState: IDraftPostState = {
  posts: [],
  canLoadMore: true,
  loading: false,
  refreshing: false,
};

const draftPostStore = (set, get) => ({
  ...initState,

  dispatchGetDraftPosts: getDraftPosts(set, get),

  reset: () => resetStore(initState, set),
});

const useDraftPostStore = createStore<IDraftPostState>(
  'draft-post-store', draftPostStore,
);

export default useDraftPostStore;
