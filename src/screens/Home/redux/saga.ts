import {put, takeLatest} from 'redux-saga/effects';
import homeTypes from '~/screens/Home/redux/types';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';

export default function* homeSaga() {
  yield takeLatest(homeTypes.GET_HOME_POSTS, getHomePosts);
}

function* getHomePosts({payload}: {payload: number}) {
  try {
    yield put(homeActions.setLoadingHomePosts(true));

    const result = yield requestHomePosts(payload);
    yield put(homeActions.setHomePosts(result));

    yield put(homeActions.setLoadingHomePosts(false));
  } catch (error) {
    console.log('getHomePosts error --->', error);
  }
}

const requestHomePosts = async (userId: number) => {
  try {
    const response = await homeDataHelper.getHomePosts(userId);
    if (response.code === 200 && response.data?.length > 0) {
      return response.data;
    }
  } catch (err) {
    console.log(
      '\x1b[33m',
      'requestHomePosts catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
  }
};
