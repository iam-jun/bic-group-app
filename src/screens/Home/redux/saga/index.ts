import { takeEvery } from 'redux-saga/effects';
import homeTypes from '~/screens/Home/redux/types';
import getHomePosts from '~/screens/Home/redux/saga/getHomePosts';
import getSearchPosts from '~/screens/Home/redux/saga/getSearchPosts';
import getSearchPostUsers from '~/screens/Home/redux/saga/getSearchPostUsers';
import deleteClearRecentSearch from '~/screens/Home/redux/saga/deleteClearRecentSearch';
import getRecentSearchKeywords from '~/screens/Home/redux/saga/getRecentSearchKeywords';
import deleteRecentSearchById from '~/screens/Home/redux/saga/deleteRecentSearchById';

export default function* homeSaga() {
  yield takeEvery(
    homeTypes.GET_HOME_POSTS, getHomePosts,
  );
  yield takeEvery(
    homeTypes.GET_SEARCH_POSTS, getSearchPosts,
  );
  yield takeEvery(
    homeTypes.GET_SEARCH_POSTS_USERS, getSearchPostUsers,
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
