import streamApi from '~/api/StreamApi';
import { ISearchState } from '..';
import { IParamGetRecentSearchKeywords } from '~/interfaces/ISearch';

const getRecentSearchKeywords = (set, _get) => async (payload: IParamGetRecentSearchKeywords) => {
  try {
    const { showLoading = true, ...params } = payload;

    set((state: ISearchState) => {
      state.recentSearchKeyword.loading = showLoading;
    }, 'getRecentSearchKeywords');

    const response = await streamApi.getRecentSearchKeywords(params);

    set((state: ISearchState) => {
      state.recentSearchKeyword.loading = false;
      state.recentSearchKeyword.data = response?.recentSearches || [];
    }, 'getRecentSearchKeywords success');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ getRecentSearchKeywords error: ', e, '\x1b[0m',
    );
    set((state: ISearchState) => {
      state.recentSearchKeyword.loading = false;
    }, 'getRecentSearchKeywords error');
  }
};

export default getRecentSearchKeywords;
