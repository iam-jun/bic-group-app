import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getJoinedCommunities({
  payload,
}: {
  type: string;
  payload?: {callback?: () => void};
}) {
  try {
    const { callback } = payload || {};

    yield put(groupsActions.setMyCommunities({ loading: true }));
    const communities: any[] = yield call(
      groupsDataHelper.getJoinedCommunities, {
        preview_members: true,
      },
    );
    if (communities?.length > 0) {
      yield put(groupsActions.setMyCommunities({ data: communities, loading: false }));
    } else {
      yield put(groupsActions.setMyCommunities({ data: [], loading: false }));
    }
    callback && callback();
  } catch (err) {
    console.error(
      '\x1b[33m', 'getJoinedCommunities : error', err, '\x1b[0m',
    );
    yield put(groupsActions.setMyCommunities({ loading: false }));
    yield call(
      showError, err,
    );
  }
}
