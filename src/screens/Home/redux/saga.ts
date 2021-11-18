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

export default function* homeSaga() {
  yield takeEvery(homeTypes.GET_HOME_POSTS, getHomePosts);
  yield takeEvery(homeTypes.GET_SEARCH_POSTS, getSearchPosts);
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
  const {searchText, actors} = payload || {};
  try {
    yield put(homeActions.setNewsfeedSearch({loadingResult: true}));
    const params: IParamGetSearchPost = {content: searchText};
    if (actors) {
      params.actors = actors;
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
