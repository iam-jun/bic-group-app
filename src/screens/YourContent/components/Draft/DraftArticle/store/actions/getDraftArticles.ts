import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftContents, PostType } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { IDraftArticleState } from '..';

const getDraftArticles = (set, get) => async (payload: IPayloadGetDraftContents) => {
  const { isRefresh = true } = payload;
  const data: IDraftArticleState = get();
  const {
    articles: draftArticles,
    hasNextPage,
    refreshing,
    loading,
  } = data || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IDraftArticleState) => {
        if (isRefresh) {
          state.refreshing = true;
          state.total = 0;
        } else {
          state.loading = true;
        }
      }, 'getDraftArticles');

      const offset = isRefresh ? 0 : draftArticles?.length || 0;
      const response = await streamApi.getDraftContents({ offset, type: PostType.ARTICLE });

      const newArticles = isRefresh
        ? response?.data || []
        : draftArticles.concat(response?.data || []);

      set((state: IDraftArticleState) => {
        state.articles = newArticles;
        state.hasNextPage = response?.canLoadMore;
        state.refreshing = false;
        state.loading = false;
        state.total = response?.total;
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
    }, 'getDraftArticlesError');
  }
};

export default getDraftArticles;
