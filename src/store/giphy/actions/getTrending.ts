import streamApi from '~/api/StreamApi';
import { IGiphyState } from '..';

const getTrending = (set, _get) => async () => {
  set((state: IGiphyState) => {
    state.loading = true;
  }, 'getTrending');

  try {
    const response = await streamApi.getGiphyTrending();
    const result = response.data || [];

    set((state: IGiphyState) => {
      state.loading = false;
      state.data = result;
    }, 'getTrendingSuccess');
  } catch (error) {
    set((state: IGiphyState) => {
      state.loading = false;
    }, 'getTrendingError');
  }
};

export default getTrending;
