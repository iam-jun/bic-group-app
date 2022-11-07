import streamApi from '~/api/StreamApi';
import { withNavigation } from '~/router/helper';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { rootNavigationRef } from '~/router/refs';
import useHomeStore from '~/screens/Home/store';
import showError from '~/store/helper/showError';
import { ISeriesState } from '..';

const navigation = withNavigation(rootNavigationRef);

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

    navigation.replace(seriesStack.seriesDetail, { seriesId: id });
    useHomeStore.getState().actions.refreshHome();
  } catch (error) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'postCreateNewSeriesError');
    showError(error);
  }
};

export default postCreateNewSeries;
