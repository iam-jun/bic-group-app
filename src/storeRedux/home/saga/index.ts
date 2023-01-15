import { takeEvery } from 'redux-saga/effects';
import homeTypes from '~/storeRedux/home/types';
import getSearchPosts from '~/storeRedux/home/saga/getSearchPosts';
import deleteClearRecentSearch from '~/storeRedux/home/saga/deleteClearRecentSearch';
import getRecentSearchKeywords from '~/storeRedux/home/saga/getRecentSearchKeywords';
import deleteRecentSearchById from '~/storeRedux/home/saga/deleteRecentSearchById';

export default function* homeSaga() {
  yield takeEvery(
    homeTypes.GET_SEARCH_POSTS, getSearchPosts,
  );
  yield takeEvery(
    homeTypes.GET_RECENT_SEARCH_KEYWORDS,
    getRecentSearchKeywords,
  );
  yield takeEvery(
    homeTypes.DELETE_CLEAR_RECENT_SEARCH_KEYWORDS,
    deleteClearRecentSearch,
  );
  yield takeEvery(
    homeTypes.DELETE_RECENT_SEARCH_KEYWORD_BY_ID,
    deleteRecentSearchById,
  );
}
