import {put, call} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getCommunities() {
  try {
    // @ts-ignore
    const communities = yield call(groupsDataHelper.getCommunities, true);
    if (communities?.length > 0) {
      yield put(groupsActions.setMyCommunities(communities));
    }
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield showError(err);
  }
}
