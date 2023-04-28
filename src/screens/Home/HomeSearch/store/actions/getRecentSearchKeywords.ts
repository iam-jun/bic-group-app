import streamApi from '~/api/StreamApi';
import { IParamGetRecentSearchKeywords } from '~/interfaces/IHome';
import { IFeedSearchState } from '..';

const getRecentSearchKeywords = (set, _get) => async (payload: IParamGetRecentSearchKeywords) => {
  try {
    const { showLoading = true, ...params } = payload;

    set((state: IFeedSearchState) => {
      state.newsfeedSearchRecentKeyword.loading = showLoading;
    }, 'setNewsfeedSearchRecentKeywords');

    const response = await streamApi.getRecentSearchKeywords(params);

    set((state: IFeedSearchState) => {
      state.newsfeedSearchRecentKeyword.loading = false;
      state.newsfeedSearchRecentKeyword.data = response?.recentSearches || [];
    }, 'setNewsfeedSearchRecentKeywords success');
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ getRecentSearchKeywords error: ', e, '\x1b[0m',
    );
    set((state: IFeedSearchState) => {
      state.newsfeedSearchRecentKeyword.loading = false;
    }, 'setNewsfeedSearchRecentKeywords error');
  }
};

export default getRecentSearchKeywords;
