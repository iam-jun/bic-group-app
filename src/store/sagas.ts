import {all} from 'redux-saga/effects';
import appSaga from './app/saga';
import commonSaga from './common/saga';
import authSaga from './auth/saga';

/**
 * Root saga
 * @returns {IterableIterator<AllEffect | GenericAllEffect<any> | *>}
 */
export default function* rootSagas() {
  yield all([appSaga(), commonSaga(), authSaga()]);
}
