import {
  IParamGetSearchPost,
  IPayloadGetSearchPosts,
} from '~/interfaces/IHome';
import streamApi from '~/api/StreamApi';
import { ITagDetailState } from '..';
import usePostsStore from '~/store/entities/posts';

const getArticlesByTag = (set, get) => async (
  payload: IPayloadGetSearchPosts, isLoadMore?: boolean,
) => {
  const {
    actors, startDate, endDate, groupId, tagName, type,
  } = payload || {};
  try {
    const data: ITagDetailState = get();
    const { articles, hasNextPage } = data;
    if (isLoadMore && !hasNextPage) return;

    set((state: ITagDetailState) => {
      state.loading = true;
    }, 'getArticlesByTag');

    const params: IParamGetSearchPost = {
      offset: isLoadMore ? articles.length : 0,
    };

    if (actors) {
      params.actors = actors;
    }
    if (startDate) {
      params.startTime = startDate;
    }
    if (endDate) {
      params.endTime = endDate;
    }
    if (groupId) {
      params.groupId = groupId;
    }
    if (tagName) {
      params.tagName = tagName;
    }
    if (type) {
      params.type = type;
    }
    const response = await streamApi.getSearchPost(params);
    const listResult = response?.list || [];
    const newArticles = isLoadMore ? [...articles, ...listResult] : listResult;
    const newHasNextPage = newArticles.length < (response?.data?.meta?.total || 0);
    set((state: ITagDetailState) => {
      state.loading = false;
      state.articles = newArticles;
      state.hasNextPage = newHasNextPage;
    }, 'getArticlesByTagSuccess');
    usePostsStore.getState().actions.addToPosts({ data: listResult });
  } catch (e) {
    set((state: ITagDetailState) => {
      state.loading = false;
    }, 'getArticlesByTagError');
    console.error(
      '\x1b[31m🐣️ saga getSearchPosts error: ', e, '\x1b[0m',
    );
  }
};

export default getArticlesByTag;
