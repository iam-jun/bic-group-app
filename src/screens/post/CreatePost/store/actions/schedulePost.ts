import i18n from 'i18next';
import streamApi from '~/api/StreamApi';
import { ICreatePostState } from '..';
import { IPostCreatePost, PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentPublishedProperties } from '~/services/tracking/Interface';
import { TrackingEvent } from '~/services/tracking/constants';

const schedulePost = (set, get) => async (postId: string, payload: IPostCreatePost) => {
  try {
    set((state: ICreatePostState) => {
      state.schedule.isSubmiting = true;
    }, 'schedulePost');

    const { createPost }: ICreatePostState = get();
    await streamApi.schedulePost(postId, payload);

    // tracking event
    const eventContentPublishedProperties: TrackingEventContentPublishedProperties = {
      content_type: PostType.POST,
      important: !!createPost?.important?.active,
    };
    trackEvent({ event: TrackingEvent.SCHEDULE, properties: eventContentPublishedProperties });

    set((state: ICreatePostState) => {
      state.schedule.isSubmiting = false;
      state.schedule.isSubmitingSuccess = true;
    }, 'schedulePost success');

    // ...getSchedulePosts to refresh list in YourContent
  } catch (e) {
    set((state: ICreatePostState) => {
      state.schedule.isSubmiting = false;
      state.schedule.errorSubmiting = e?.meta?.message || i18n.t('common:text_error_message');
    }, 'schedulePost error');
  }
};

export default schedulePost;
