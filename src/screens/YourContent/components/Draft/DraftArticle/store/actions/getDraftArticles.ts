import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftContents, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IDraftArticleState } from '..';
import { getNewPosts } from '~/helpers/post';

const getDraftArticles = (set, get) => async (payload: IPayloadGetDraftContents) => {
  const { isRefresh = true } = payload;
  const data: IDraftArticleState = get();
  const {
    articles: draftArticles,
    hasNextPage,
    endCursor,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftArticleState) => {
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      }, 'getDraftArticles');

      const endCursorParams = isRefresh ? null : endCursor;
      const response = await streamApi.getDraftContents({
        endCursor: endCursorParams,
        type: PostType.ARTICLE
      });

      const newArticles = getNewPosts({ isRefresh, response, list: draftArticles });

      set((state: IDraftArticleState) => {
        state.articles = newArticles;
        state.hasNextPage = response?.data?.meta?.hasNextPage;
        state.endCursor = response?.data?.meta?.endCursor;
        state.refreshing = false;
        state.loading = false;
      }, 'getDraftArticlesSuccess');

      usePostsStore.getState().actions.addToPosts({ data: response?.data });
    } else {
      console.warn('\x1b[36m🐣️ action getDraftArticles cannot load more\x1b[0m');
    }
  } catch (error) {
    console.error('\x1b[31m🐣️ action getDraftArticles error: ', error, '\x1b[0m');

    set((state: IDraftArticleState) => {
      state.refreshing = false;
      state.loading = false;
      state.endCursor = null;
    }, 'getDraftArticlesError');
  }
};

export default getDraftArticles;
