import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import { IPayloadGetDraftPosts } from '~/interfaces/IPost';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import { ICreateArticleState } from '..';

const scheduleArticle = (set, get) => async () => {
  try {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = true;
    }, 'scheduleArticle');

    const { schedule, data }: ICreateArticleState = get();
    await streamApi.scheduleArticle(data.id, schedule.publishedAt);

    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.isSubmitingSuccess = true;
    }, 'scheduleArticle success');

    const payloadGetDraftArticles: IPayloadGetDraftPosts = {
      isRefresh: true,
    };
    useDraftArticleStore.getState().actions.getDraftArticles(payloadGetDraftArticles);
  } catch (e) {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.errorSubmiting = e?.meta?.message || i18n.t('common:text_error_message');
    }, 'scheduleArticle error');
  }
};

export default scheduleArticle;
