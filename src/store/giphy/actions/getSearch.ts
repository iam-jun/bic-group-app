import streamApi from '~/api/StreamApi';
import { IGiphyState } from '..';

const getSearch = (set, get) => async (key: string) => {
  set((state: IGiphyState) => {
    state.loading = true;
  }, 'getSearch');

  const { searchResults }:IGiphyState = get();

  try {
    const params = {
      q: key,
      offset: searchResults.length,
    };
    const response = await streamApi.getSearchGiphy(params);
    const result = response.data || [];

    const newData = searchResults.length === 0
      ? result
      : searchResults.concat(result);

    set((state: IGiphyState) => {
      state.loading = false;
      state.searchResults = newData;
    }, 'getSearchSuccess');
  } catch (error) {
    set((state: IGiphyState) => {
      state.loading = false;
    }, 'getSearchError');
  }
};

export default getSearch;
