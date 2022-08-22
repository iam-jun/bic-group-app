import { put } from 'redux-saga/effects';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '../actions';

export default function* getManaged({ payload }: ReturnType<typeof groupsActions.getManaged>) {
  try {
    const { isRefresh } = payload;

    yield put(groupsActions.getOwnerCommunity());

    yield put(groupsActions.getManagedCommunityAndGroup({ isRefresh }));

    yield put(groupsActions.setManaged({ isRefresh: false }));
  } catch (err) {
    console.error('\x1b[33m', 'getManaged : error', err, '\x1b[0m');
    yield put(groupsActions.setManaged({ isRefresh: false }));
    yield showError(err);
  }
}
