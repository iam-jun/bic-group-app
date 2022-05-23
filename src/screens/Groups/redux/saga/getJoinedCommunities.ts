import {put, call, select} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getJoinedCommunities({
  payload,
}: {
  type: string;
  payload: {callback?: () => void};
}) {
  try {
    const {callback} = payload;
    const list: any[] = yield select(
      state => state?.groups?.communities?.data,
    ) || [];
    yield put(groupsActions.setMyCommunities({data: list, loading: true}));
    // @ts-ignore
    const communities = yield call(groupsDataHelper.getJoinedCommunities, true);
    if (communities?.length > 0) {
      yield put(
        groupsActions.setMyCommunities({data: communities, loading: false}),
      );
    } else {
      yield put(groupsActions.setMyCommunities({data: [], loading: false}));
    }
    callback && callback();
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield put(groupsActions.setMyCommunities({data: [], loading: false}));
    yield showError(err);
  }
}
