import streamApi from '~/api/StreamApi';
import { withNavigation } from '~/router/helper';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { rootNavigationRef } from '~/router/refs';
import { ISeriesState } from '..';
import i18n from '~/localization';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import { IPostCreateSeries } from '~/interfaces/ISeries';
import showToastSuccess from '~/store/helper/showToastSuccess';

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
    const {
      title, summary, audience, setting, coverMedia,
    } = data || {};
    const coverMediaUpdate = coverMedia?.id && {
      id: coverMedia?.id,
    };
    const dataUpdate: IPostCreateSeries = {
      title,
      summary,
      audience,
      setting,
      coverMedia: coverMediaUpdate,
    };
    const response = await streamApi.editSeries(id, dataUpdate);

    actions.getSeriesDetail(id);

    set((state: ISeriesState) => {
      state.loading = false;
    }, 'editSeriesSuccess');

    showToastSuccess(response);

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
