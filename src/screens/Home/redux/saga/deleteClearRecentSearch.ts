import {IRecentSearchTarget} from '~/interfaces/IHome';
import {call, put} from 'redux-saga/effects';
import homeDataHelper from '~/screens/Home/helper/HomeDataHelper';
import homeActions from '~/screens/Home/redux/actions';

export default function* deleteClearRecentSearch({
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
        order: 'DESC',
        limit: 10,
        showLoading: false,
      }),
    );
  } catch (e) {
    console.log(`\x1b[31m🐣️ saga clear Recent Search error: `, e, `\x1b[0m`);
  }
}
