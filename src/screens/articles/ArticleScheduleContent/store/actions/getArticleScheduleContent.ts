import streamApi from '~/api/StreamApi';
import { IParamsGetArticleScheduleContent, IPayloadGetArticleScheduleContent } from '~/interfaces/IArticle';
import { PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { IArticleScheduleContentState } from '..';

const getArticleScheduleContent = (set, get) => async (payload: IPayloadGetArticleScheduleContent) => {
  const { isRefresh = true, groupId } = payload;
  const state: IArticleScheduleContentState = get();
  const {
    articles, hasNextPage, refreshing, loading,
  } = state || {};

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IArticleScheduleContentState) => {
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
      }, 'getArticleScheduleContent');

      const offset = isRefresh ? 0 : articles?.length || 0;
      const params: IParamsGetArticleScheduleContent = {
        order: 'ASC',
        offset,
        groupIds: groupId,
        status: `${PostStatus.WAITING_SCHEDULE},${PostStatus.SCHEDULE_FAILED}`,
      };
      const response = await streamApi.getArticleScheduleContent(params);

      const listArticleScheduleContent = response?.data?.list;
      const newArticles = isRefresh
        ? listArticleScheduleContent || []
        : articles.concat(listArticleScheduleContent || []);

      set((state: IArticleScheduleContentState) => {
        state.articles = newArticles;
        state.hasNextPage = response?.data?.meta?.hasNextPage;
        state.refreshing = false;
        state.loading = false;
      }, 'getArticleScheduleContentSuccess');

      usePostsStore.getState().actions.addToPosts({ data: response?.data });
    } else {
      console.warn('\x1b[36m🐣️ action getArticleScheduleContent cannot load more\x1b[0m');
    }
  } catch (error) {
    console.error('\x1b[31m🐣️ action getArticleScheduleContent error: ', error, '\x1b[0m');
    set((state: IArticleScheduleContentState) => {
      state.refreshing = false;
      state.loading = false;
    }, 'getArticleScheduleContentFailed');
    showToastError(error);
  }
};

export default getArticleScheduleContent;
