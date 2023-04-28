import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftContents, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import IDraftPostState from '../Interface';

const getDraftPosts = (set, get) => async (payload: IPayloadGetDraftContents) => {
  const { isRefresh = true } = payload;
  const data: IDraftPostState = get();
  const {
    posts: draftPosts,
    hasNextPage,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftPostState) => {
        if (isRefresh) {
          state.refreshing = true;
          state.total = 0;
        } else {
          state.loading = true;
        }
      }, 'getDraftPosts');

      const offset = isRefresh ? 0 : draftPosts?.length || 0;
      const response = await streamApi.getDraftContents({ offset, type: PostType.POST });

      const newPosts = isRefresh
        ? response?.data || []
        : draftPosts.concat(response?.data || []);
      set((state: IDraftPostState) => {
        state.posts = newPosts;
        state.hasNextPage = response?.canLoadMore;
        state.refreshing = false;
        state.loading = false;
        state.total = response?.total;
      }, 'getDraftPostsSuccess');
      usePostsStore.getState().actions.addToPosts({ data: newPosts });
    } else {
      console.warn('\x1b[36m🐣️ action getDraftPosts cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: IDraftPostState) => {
      state.refreshing = false;
      state.loading = false;
    }, 'getDraftPostsError');
    console.error('\x1b[31m🐣️ action getDraftPosts error: ', e, '\x1b[0m');
  }
};

export default getDraftPosts;
