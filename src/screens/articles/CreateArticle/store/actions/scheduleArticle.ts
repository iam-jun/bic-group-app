import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import { ICreateArticleState } from '..';
import { PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentPublishedProperties } from '~/services/tracking/Interface';
import { TrackingEvent } from '~/services/tracking/constants';

const scheduleArticle = (set, get) => async () => {
  try {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = true;
    }, 'scheduleArticle');

    const { schedule, data }: ICreateArticleState = get();
    await streamApi.scheduleArticle(data.id, schedule.scheduledAt);

    // tracking event
    const eventContentPublishedProperties: TrackingEventContentPublishedProperties = {
      content_type: PostType.ARTICLE,
      important: !!data?.setting?.isImportant,
    };
    trackEvent({ event: TrackingEvent.SCHEDULE, properties: eventContentPublishedProperties });

    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.isSubmitingSuccess = true;
    }, 'scheduleArticle success');
  } catch (e) {
    set((state: ICreateArticleState) => {
      state.schedule.isSubmiting = false;
      state.schedule.errorSubmiting = e?.meta?.message || i18n.t('common:text_error_message');
    }, 'scheduleArticle error');
  }
};

export default scheduleArticle;
