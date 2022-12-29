import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { rootNavigationRef } from '~/router/refs';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import i18n from '~/localization';
import useModalStore from '~/store/modal';
import { ToastType } from '~/baseComponents/Toast/BaseToast';

const navigation = withNavigation(rootNavigationRef);

const editSeries = (set, get) => async (
  id: string,
  shouldReplaceWithDetail: boolean,
  onRetry: any,
  callbackError:any,
) => {
  if (!id) return;
  const { data, actions }: ISeriesState = get() || {};
  set((state: ISeriesState) => {
    state.loading = true;
  }, 'editSeries');
  const { showToast } = useModalStore.getState().actions;
  try {
    const response = await streamApi.editSeries(id, data);
    actions.getSeriesDetail(id);
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'editSeriesSuccess');
    usePostsStore.getState().actions.addToPosts({ data: response.data } as IPayloadAddToAllPost);
    showToast({ content: 'series:text_edit_series_success' });

    if (shouldReplaceWithDetail) {
      navigation.replace(seriesStack.seriesDetail, { seriesId: id });
    } else {
      navigation.goBack();
    }
  } catch (error) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'editSeriesError');
    if (error?.meta?.errors?.groups_denied) {
      callbackError?.(error.meta.errors.groups_denied);
    } else {
      showToast({
        content: 'series:text_edit_series_failed',
        type: ToastType.ERROR,
        buttonText: i18n.t('common:text_retry'),
        onButtonPress: onRetry,
      });
    }
    console.error('editSeriesError', error);
  }
};

export default editSeries;
