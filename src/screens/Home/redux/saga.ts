import {put, select, takeEvery, call} from 'redux-saga/effects';
import {get} from 'lodash';
import homeTypes from '~/screens/Home/redux/types';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';
import {
  IParamGetSearchPost,
  IPayloadGetHomePost,
  IPayloadGetSearchPosts,
} from '~/interfaces/IHome';
import homeKeySelector from '~/screens/Home/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import {IParamsGetUsers} from '~/interfaces/IAppHttpRequest';

export default function* homeSaga() {
  yield takeEvery(homeTypes.GET_HOME_POSTS, getHomePosts);
  yield takeEvery(homeTypes.GET_SEARCH_POSTS, getSearchPosts);
  yield takeEvery(homeTypes.GET_SEARCH_POSTS_USERS, getSearchPostUsers);
}

function* getHomePosts({
  payload,
}: {
  payload: IPayloadGetHomePost;
  type: string;
}): any {
  try {
    const {userId, streamClient, isRefresh} = payload;
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

    const result = yield homeDataHelper.getHomePosts(
      userId,
      streamClient,
      offset,
    );
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
  const {searchText, actors, startDate, endDate} = payload || {};
  try {
    yield put(homeActions.setNewsfeedSearch({loadingResult: true}));
    const params: IParamGetSearchPost = {content: searchText};
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
    const searchResults = response?.results || [];
    yield put(
      postActions.addToAllPosts({data: searchResults, handleComment: false}),
    );
    yield put(
      homeActions.setNewsfeedSearch({loadingResult: false, searchResults}),
    );
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
