import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { rootNavigationRef } from '~/router/refs';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import i18n from '~/localization';

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
  try {
    const response = await streamApi.editSeries(id, data);
    actions.getSeriesDetail(id);
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'editSeriesSuccess');
    usePostsStore.getState().actions.addToPosts({ data: response.data } as IPayloadAddToAllPost);
    Store.store.dispatch(modalActions.showHideToastMessage({ content: 'series:text_edit_series_success' }));

    if (shouldReplaceWithDetail) {
      navigation.replace(seriesStack.seriesDetail, { seriesId: id });
    } else {
      navigation.goBack();
    }
  } catch (error) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'editSeriesError');
    if (error?.meta?.errors?.groupsDenied) {
      callbackError?.(error.meta.errors.groupsDenied);
    } else {
      Store.store.dispatch(modalActions.showHideToastMessage({
        content: 'series:text_edit_series_failed',
        props: {
          type: 'error',
          buttonText: i18n.t('common:text_retry'),
          onButtonPress: onRetry,
        },
      }));
    }
    console.error('editSeriesError', error);
  }
};

export default editSeries;
