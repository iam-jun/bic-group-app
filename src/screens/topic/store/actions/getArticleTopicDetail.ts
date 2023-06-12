import streamApi from '~/api/StreamApi';
import { ITopicState } from '../index';
import { IPayloadGetArticleTopicDetail } from '~/interfaces/ITopic';

const getArticleTopicDetail = (set, get) => async (payload: IPayloadGetArticleTopicDetail) => {
  const { isRefresh = true, id } = payload;
  const data: ITopicState = get();
  const { articles } = data || {};
  const {
    data: listArticle, hasNextPage, refreshing, loading,
  } = articles || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: ITopicState) => {
        if (isRefresh) {
          state.articles.refreshing = true;
          state.articles.total = 0;
        } else {
          state.articles.loading = true;
        }
      }, 'getArticleTopicDetail');

      const offset = isRefresh ? 0 : listArticle?.length || 0;
      const response = await streamApi.getArticleTopicDetail({ offset, id });
      const newArticles = handleNewArticles({ isRefresh, response, listArticle });

      set((state: ITopicState) => {
        state.articles.data = newArticles;
        state.articles.hasNextPage = response?.canLoadMore;
        state.articles.refreshing = false;
        state.articles.loading = false;
        state.articles.total = response?.total;
      }, 'getArticleTopicDetailSuccess');
    } else {
      console.warn('\x1b[36m🐣️ action getArticleTopicDetail cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: ITopicState) => {
      state.articles.refreshing = false;
      state.articles.loading = false;
    }, 'getArticleTopicDetailError');
    console.error('\x1b[31m🐣️ action getArticleTopicDetail error: ', e, '\x1b[0m');
  }
};

const handleNewArticles = (params: { isRefresh: boolean, response: any, listArticle: any }) => {
  const { isRefresh, response, listArticle } = params;
  if (isRefresh) {
    return response?.data || [];
  }
  return listArticle?.concat(response?.data || []);
};

export default getArticleTopicDetail;
