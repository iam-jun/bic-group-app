import {put, takeLatest, select} from 'redux-saga/effects';
import {get} from 'lodash';
import homeTypes from '~/screens/Home/redux/types';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';
import {IPayloadGetHomePost} from '~/interfaces/IHome';
import homeKeySelector from '~/screens/Home/redux/keySelector';

export default function* homeSaga() {
  yield takeLatest(homeTypes.GET_HOME_POSTS, getHomePosts);
}

function* getHomePosts({
  payload,
}: {
  payload: IPayloadGetHomePost;
  type: string;
}) {
  try {
    const {userId, streamClient, isRefresh} = payload;
    let homePosts, offset;
    const noMoreHomePosts = yield select(state =>
      get(state, homeKeySelector.noMoreHomePosts),
    );

    if (noMoreHomePosts && !isRefresh) {
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
      yield put(homeActions.setNoMoreHomePosts(newHomePosts));
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
