import streamApi from '~/api/StreamApi';
import routerHelper from '~/router/helper';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { rootNavigationRef } from '~/router/refs';
import useHomeStore from '~/screens/Home/store';
import showToastError from '~/store/helper/showToastError';
import { ISeriesState } from '..';
import showToastSuccess from '~/store/helper/showToastSuccess';
import { TrackingEventContentPublishedProperties, TrackingEventType } from '~/interfaces/ITrackingEvent';
import { PostType } from '~/interfaces/IPost';
import { trackEvent } from '~/services/tracking';

const navigation = routerHelper?.withNavigation?.(rootNavigationRef);

const postCreateNewSeries = (set, get) => async () => {
  const { data, actions }: ISeriesState = get() || {};
  set((state: ISeriesState) => {
    state.loading = true;
  }, 'postCreateNewSeries');
  try {
    const params = { ...data };
    const response = await streamApi.postCreateNewSeries(params);

    const { id = '' } = response?.data || {};
    actions.getSeriesDetail(id);
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'postCreateNewSeriesSuccess');

    // tracking event
    const eventContentPublishedProperties: TrackingEventContentPublishedProperties = {
      content_type: PostType.SERIES,
      important: !!data?.setting?.isImportant,
    };
    trackEvent({ event: TrackingEventType.CONTENT_PUBLISHED, properties: eventContentPublishedProperties });

    navigation.replace(seriesStack.seriesDetail, { seriesId: id });
    useHomeStore.getState().actions.refreshHome();
    showToastSuccess(response);
  } catch (error) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'postCreateNewSeriesError');
    showToastError(error);
    // TODO: handle error settings
  }
};

export default postCreateNewSeries;
