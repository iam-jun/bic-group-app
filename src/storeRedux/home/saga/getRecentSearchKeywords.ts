import { call, put } from 'redux-saga/effects';
import { IParamGetRecentSearchKeywords } from '~/interfaces/IHome';
import homeActions from '~/storeRedux/home/actions';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';

export default function* getRecentSearchKeywords({
  payload,
}: {
  payload: IParamGetRecentSearchKeywords;
  type: string;
}): any {
  try {
    const { showLoading = true, ...param } = payload;
    if (showLoading) {
      yield put(homeActions.setNewsfeedSearchRecentKeywords({ loading: true }));
    }
    const response = yield call(
      homeDataHelper.getRecentSearchKeywords, param,
    );
    yield put(homeActions.setNewsfeedSearchRecentKeywords({
      data: response?.recentSearches || [],
      loading: false,
    }));
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga getRecentSearch error: ', e, '\x1b[0m',
    );
    yield put(homeActions.setNewsfeedSearchRecentKeywords({ loading: false }));
  }
}
