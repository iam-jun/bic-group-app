import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftContents } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IDraftContentsState } from '..';

const getDraftContents = (set, get) => async (payload: IPayloadGetDraftContents) => {
  const { isRefresh = true } = payload;
  const data: IDraftContentsState = get();
  const {
    posts: draftPosts,
    hasNextPage,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftContentsState) => {
        if (isRefresh) {
          state.refreshing = true;
          state.total = 0;
        } else {
          state.loading = true;
        }
      }, 'getDraftContents');

      const offset = isRefresh ? 0 : draftPosts?.length;
      const response = await streamApi.getDraftContents({ offset });

      const newPosts = isRefresh
        ? response?.data || []
        : draftPosts.concat(response?.data || []);
      set((state: IDraftContentsState) => {
        state.posts = newPosts;
        state.hasNextPage = response?.canLoadMore;
        state.refreshing = false;
        state.loading = false;
        state.total = response?.total;
      }, 'getDraftContentsSuccess');
      usePostsStore.getState().actions.addToPosts({ data: newPosts });
    } else {
      console.warn('\x1b[36m🐣️ action getDraftContents cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: IDraftContentsState) => {
      state.refreshing = false;
      state.loading = false;
    }, 'getDraftContentsFailed');
    console.error('\x1b[31m🐣️ action getDraftContents error: ', e, '\x1b[0m');
  }
};

export default getDraftContents;
