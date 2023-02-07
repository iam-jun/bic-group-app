import streamApi from '~/api/StreamApi';
import { IScheduleArticlesState } from '../index';
import { IPayloadGetScheduleArticles } from '~/interfaces/IArticle';
import { PostStatus } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import { timeOut } from '~/utils/common';

const getScheduleArticles = (set, get) => async (payload: IPayloadGetScheduleArticles) => {
  const { isRefresh = true } = payload;
  const { scheduleArticles }: IScheduleArticlesState = get();
  const {
    data: listScheduleArticle,
    loading,
  } = scheduleArticles;
  if (loading) return;

  try {
    set((state: IScheduleArticlesState) => {
      if (isRefresh) {
        state.scheduleArticles.refreshing = true;
      } else {
        state.scheduleArticles.loading = true;
      }
    }, 'getScheduleArticles');

    const offset = isRefresh ? 0 : listScheduleArticle?.length || 0;
    const params = {
      status: `${PostStatus.WAITING_SCHEDULE},${PostStatus.SCHEDULE_FAILED}`,
      offset,
      limit: 10,
    };
    const response = await streamApi.getArticleByParams(params);
    await timeOut(300);
    const newScheduleArticles
      = isRefresh ? response?.data?.list || [] : listScheduleArticle?.concat(response?.data?.list || []);

    set((state: IScheduleArticlesState) => {
      state.scheduleArticles.data = newScheduleArticles;
      state.scheduleArticles.hasNextPage = response?.data?.meta?.hasNextPage;
      state.scheduleArticles.refreshing = false;
      state.scheduleArticles.loading = false;
    }, 'getScheduleArticlesSuccess');
    usePostsStore.getState().actions.addToPosts({ data: newScheduleArticles });
  } catch (e) {
    set((state: IScheduleArticlesState) => {
      state.scheduleArticles.refreshing = false;
      state.scheduleArticles.loading = false;
      state.scheduleArticles.hasNextPage = false;
    }, 'getScheduleArticlesError');
    console.error('\x1b[31m🐣️ action getScheduleArticles error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default getScheduleArticles;
