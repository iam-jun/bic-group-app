import { call, put } from 'redux-saga/effects';
import homeDataHelper from '~/api/HomeDataHelper';
import homeActions from '~/storeRedux/home/actions';

export default function* deleteRecentSearchById({
  payload,
}: {
  payload: string;
  type: string;
}): any {
  try {
    yield call(
      homeDataHelper.deleteRecentSearchById, payload,
    );
    yield put(homeActions.getRecentSearchKeywords({
      target: 'post',
      order: 'DESC',
      limit: 10,
      showLoading: false,
    }));
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga delete Recent Search error: ', e, '\x1b[0m',
    );
  }
}
