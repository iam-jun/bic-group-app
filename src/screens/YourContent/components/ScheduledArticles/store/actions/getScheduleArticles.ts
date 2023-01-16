import streamApi from '~/api/StreamApi';
import { IScheduleArticlesState } from '../index';
import { IPayloadGetScheduleArticles } from '~/interfaces/IArticle';
import { PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

const getScheduleArticles = (set, get) => async (payload: IPayloadGetScheduleArticles) => {
  const { isRefresh = true } = payload;
  const { scheduleArticles }: IScheduleArticlesState = get();
  const {
    data: listScheduleArticle,
    hasNextPage,
    refreshing,
    loading,
  } = scheduleArticles;

  try {
    if (!refreshing && !loading && (isRefresh || hasNextPage)) {
      set((state: IScheduleArticlesState) => {
        if (isRefresh) {
          state.scheduleArticles.refreshing = true;
          state.scheduleArticles.total = 0;
        } else {
          state.scheduleArticles.loading = true;
        }
      }, 'getScheduleArticles');

      const offset = isRefresh ? 0 : listScheduleArticle?.length || 0;
      const response = await streamApi.getArticleByParams({
        status: [PostStatus.WAITING_SCHEDULE, PostStatus.SCHEDULE_FAILED],
        offset,
      });
      const newScheduleArticles = isRefresh ? response?.data || [] : listScheduleArticle?.concat(response?.data || []);

      set((state: IScheduleArticlesState) => {
        state.scheduleArticles.data = newScheduleArticles;
        state.scheduleArticles.hasNextPage = response?.canLoadMore;
        state.scheduleArticles.refreshing = false;
        state.scheduleArticles.loading = false;
        state.scheduleArticles.total = response?.total;
      }, 'getScheduleArticlesSuccess');
      usePostsStore.getState().actions.addToPosts({ data: newScheduleArticles });
    } else {
      console.warn('\x1b[36m🐣️ action getScheduleArticles cant load more\x1b[0m');
    }
  } catch (e) {
    set((state: IScheduleArticlesState) => {
      state.scheduleArticles.refreshing = false;
      state.scheduleArticles.loading = false;
    }, 'getScheduleArticlesError');
    console.error('\x1b[31m🐣️ action getScheduleArticles error: ', e, '\x1b[0m');
  }
};

export default getScheduleArticles;
