import {put, select, takeEvery, call} from 'redux-saga/effects';
import {get} from 'lodash';
import homeTypes from '~/screens/Home/redux/types';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';
import {
  IParamGetRecentSearchKeywords,
  IParamGetSearchPost,
  IParamPostNewRecentSearchKeyword,
  IPayloadGetHomePost,
  IPayloadGetSearchPosts,
  IRecentSearchTarget,
} from '~/interfaces/IHome';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

export default function* homeSaga() {
  yield takeEvery(homeTypes.GET_HOME_POSTS, getHomePosts);
  yield takeEvery(homeTypes.GET_SEARCH_POSTS, getSearchPosts);
  yield takeEvery(homeTypes.GET_SEARCH_POSTS_USERS, getSearchPostUsers);
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

function* getHomePosts({
  payload,
}: {
  payload: IPayloadGetHomePost;
  type: string;
}): any {
  try {
    const {isRefresh} = payload;
    let homePosts, offset;
    const {noMoreHomePosts, loadingHomePosts, refreshingHomePosts} =
      yield select(state => get(state, 'home'));

    if ((noMoreHomePosts || loadingHomePosts) && !isRefresh) {
      return;
    }

    if (isRefresh) {
      yield put(homeActions.setRefreshingHomePosts(true));
      yield put(homeActions.setNoMoreHomePosts(false));
      homePosts = [];
      offset = 0;
    } else {
      yield put(homeActions.setLoadingHomePosts(true));
      homePosts = yield select(state =>
        get(state, homeKeySelector.homePosts),
      ) || [];
      offset = homePosts?.length || 0;
    }

    const result = yield homeDataHelper.getNewsfeed({offset});

    const newHomePosts = homePosts.concat?.(result) || result;
    yield put(homeActions.setHomePosts(newHomePosts));

    if (newHomePosts?.length === homePosts?.length) {
      yield put(homeActions.setNoMoreHomePosts(true));
    }

    if (isRefresh) {
      yield put(homeActions.setRefreshingHomePosts(false));
    } else {
      yield put(homeActions.setLoadingHomePosts(false));
    }
  } catch (error) {
    yield put(homeActions.setRefreshingHomePosts(false));
    yield put(homeActions.setLoadingHomePosts(false));
  }
}

function* getSearchPosts({
  payload,
}: {
  payload: IPayloadGetSearchPosts;
  type: string;
}): any {
  const {searchText, actors, startDate, endDate, isLoadMore} = payload || {};
  try {
    let data: any[] = [];
    const state = yield select(state => state?.home?.newsfeedSearch);
    const {searchResults, totalResult, loadingResult} = state || {};
    const params: IParamGetSearchPost = {content: searchText};

    if (loadingResult || !searchText?.trim?.()) {
      console.log(`\x1b[36m🐣️ saga getSearchPosts loading result\x1b[0m`);
      return;
    }

    if (isLoadMore) {
      if (
        totalResult > 0 &&
        searchResults?.length &&
        totalResult > searchResults.length
      ) {
        data = searchResults;
        params.offset = data.length;
      } else {
        console.log(`\x1b[36m🐣️ saga getSearchPosts cant load more\x1b[0m`);
        return;
      }
    }

    yield put(homeActions.setNewsfeedSearch({loadingResult: true}));

    if (actors) {
      params.actors = actors;
    }
    if (startDate) {
      params.start_time = startDate;
    }
    if (endDate) {
      params.end_time = endDate;
    }
    const response = yield call(homeDataHelper.getSearchPost, params);
    data = data.concat(response?.results);
    yield put(postActions.addToAllPosts({data, handleComment: false}));
    yield put(
      homeActions.setNewsfeedSearch({
        loadingResult: false,
        searchResults: data,
        totalResult: response?.total,
      }),
    );

    //save keyword to recent search
    if (!isLoadMore) {
      const recentParam: IParamPostNewRecentSearchKeyword = {
        keyword: searchText,
        target: 'post',
      };
      yield call(homeDataHelper.postNewRecentSearchKeyword, recentParam);
      yield put(
        homeActions.getRecentSearchKeywords({
          target: 'post',
          sort: 'desc',
          limit: 10,
          showLoading: false,
        }),
      );
    }
  } catch (e) {
    yield put(homeActions.setNewsfeedSearch({loadingResult: false}));
    console.log(`\x1b[31m🐣️ saga getSearchPosts error: `, e, `\x1b[0m`);
  }
}

function* getSearchPostUsers({payload}: {payload: string; type: string}): any {
  try {
    const state = yield select(state => state?.home?.newsfeedSearchUsers);
    let data = state?.data || [];

    //if doesnt have payload a.k.a search key => action load more page
    let params: IParamsGetUsers | undefined = undefined;
    if (payload || payload === '') {
      data = [];
      yield put(
        homeActions.setNewsfeedSearchUsers({
          key: payload,
          loading: true,
          canLoadMore: true,
          offset: 0,
          data: data,
        }),
      );
      params = {key: payload, offset: 0, limit: state.limit};
    } else {
      if (state && state.canLoadMore && state.data?.length) {
        params = {
          key: state.key,
          offset: state.data.length,
          limit: state.limit,
        };
      }
    }

    if (state && params) {
      const response = yield homeDataHelper.getUsers(params);
      const newData = data.concat(response || []) || [];
      const newCanLoadMore = newData?.length > state.data?.length;
      yield put(
        homeActions.setNewsfeedSearchUsers({
          key: params.key,
          limit: params.limit,
          offset: params.offset,
          data: newData,
          loading: false,
          canLoadMore: newCanLoadMore,
        }),
      );
    } else {
      console.log(`\x1b[36m🐣️ saga getSearchPostUsers: cant load more\x1b[0m`);
    }
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getSearchPostUsers error: `, e, `\x1b[0m`);
  }
}

function* getRecentSearchKeywords({
  payload,
}: {
  payload: IParamGetRecentSearchKeywords;
  type: string;
}): any {
  try {
    const {showLoading = true, ...param} = payload;
    if (showLoading) {
      yield put(homeActions.setNewsfeedSearchRecentKeywords({loading: true}));
    }
    const response = yield call(homeDataHelper.getRecentSearchKeywords, param);
    yield put(
      homeActions.setNewsfeedSearchRecentKeywords({
        data: response?.recentSearches || [],
        loading: false,
      }),
    );
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga getRecentSearch error: `, e, `\x1b[0m`);
    yield put(homeActions.setNewsfeedSearchRecentKeywords({loading: false}));
  }
}

function* deleteClearRecentSearch({
  payload,
}: {
  payload: IRecentSearchTarget;
  type: string;
}): any {
  try {
    yield call(homeDataHelper.deleteCleanRecentSearch, payload);
    yield put(
      homeActions.getRecentSearchKeywords({
        target: 'post',
        sort: 'desc',
        limit: 10,
        showLoading: false,
      }),
    );
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga clear Recent Search error: `, e, `\x1b[0m`);
  }
}

function* deleteRecentSearchById({
  payload,
}: {
  payload: string;
  type: string;
}): any {
  try {
    yield call(homeDataHelper.deleteRecentSearchById, payload);
    yield put(
      homeActions.getRecentSearchKeywords({
        target: 'post',
        sort: 'desc',
        limit: 10,
        showLoading: false,
      }),
    );
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga delete Recent Search error: `, e, `\x1b[0m`);
  }
}
