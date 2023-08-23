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
    endCursor,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftContentsState) => {
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      }, 'getDraftContents');

      const endCursorParams = isRefresh ? null : endCursor;
      const response = await streamApi.getDraftContents({ endCursor: endCursorParams });

      const newPosts = isRefresh
        ? response?.data?.list || []
        : draftPosts.concat(response?.data?.list || []);

      set((state: IDraftContentsState) => {
        state.posts = newPosts;
        state.hasNextPage = response?.data?.meta?.hasNextPage;
        state.endCursor = response?.data?.meta?.endCursor;
        state.refreshing = false;
        state.loading = false;
      }, 'getDraftContentsSuccess');
      usePostsStore.getState().actions.addToPosts({ data: newPosts });
    } else {
      console.warn('\x1b[36m🐣️ action getDraftContents cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: IDraftContentsState) => {
      state.refreshing = false;
      state.loading = false;
      state.endCursor = null;
    }, 'getDraftContentsFailed');
    console.error('\x1b[31m🐣️ action getDraftContents error: ', e, '\x1b[0m');
  }
};

export default getDraftContents;
