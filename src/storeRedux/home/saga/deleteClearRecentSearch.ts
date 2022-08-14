import { call, put } from 'redux-saga/effects';
import { IRecentSearchTarget } from '~/interfaces/IHome';
import homeActions from '~/storeRedux/home/actions';
import streamApi from '~/api/StreamApi';

export default function* deleteClearRecentSearch({
  payload,
}: {
  payload: IRecentSearchTarget;
  type: string;
}): any {
  try {
    yield call(
      streamApi.deleteCleanRecentSearch, payload,
    );
    yield put(homeActions.getRecentSearchKeywords({
      target: 'post',
      order: 'DESC',
      limit: 10,
      showLoading: false,
    }));
  } catch (e) {
    console.error(
      '\x1b[31m🐣️ saga clear Recent Search error: ', e, '\x1b[0m',
    );
  }
}
