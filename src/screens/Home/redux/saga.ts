import {put, takeLatest} from 'redux-saga/effects';
import homeTypes from '~/screens/Home/redux/types';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';
import {IGetStreamDispatch} from '~/interfaces/common';

export default function* homeSaga() {
  yield takeLatest(homeTypes.GET_HOME_POSTS, getHomePosts);
}

function* getHomePosts({payload}: {payload: IGetStreamDispatch}) {
  try {
    const {userId, streamClient} = payload;
    yield put(homeActions.setLoadingHomePosts(true));

    // const result = yield requestHomePosts(payload);
    const result = yield homeDataHelper.getHomePosts(userId, streamClient);
    yield put(homeActions.setHomePosts(result));

    yield put(homeActions.setLoadingHomePosts(false));
  } catch (error) {
    console.log('getHomePosts error --->', error);
  }
}
