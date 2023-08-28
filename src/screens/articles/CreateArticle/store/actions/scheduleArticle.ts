import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import { IPayloadGetScheduleArticles } from '~/interfaces/IArticle';
import useScheduleArticlesStore from '~/screens/YourContent/components/ScheduledArticles/store';
import { ICreateArticleState } from '..';

const scheduleArticle = (set, get) => async () => {
  try {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = true;
    }, 'scheduleArticle');

    const { schedule, data }: ICreateArticleState = get();
    await streamApi.scheduleArticle(data.id, schedule.scheduledAt);

    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.isSubmitingSuccess = true;
    }, 'scheduleArticle success');

    const payloadGetScheduleArticles: IPayloadGetScheduleArticles = {
      isRefresh: true,
    };
    useScheduleArticlesStore.getState().actions.getScheduleArticles(payloadGetScheduleArticles);
  } catch (e) {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.errorSubmiting = e?.meta?.message || i18n.t('common:text_error_message');
    }, 'scheduleArticle error');
  }
};

export default scheduleArticle;
