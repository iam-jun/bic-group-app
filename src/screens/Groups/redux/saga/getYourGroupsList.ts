import {put, call} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getYourGroupsList({
  payload: communityId,
}: {
  type: string;
  payload: number;
}): any {
  try {
    yield put(groupsActions.setYourGroupsList({loading: true}));
    const groups = yield call(
      groupsDataHelper.getCommunityGroups,
      communityId,
      {list_by: 'flat'},
    );
    yield put(
      groupsActions.setYourGroupsList({loading: false, list: groups || []}),
    );
  } catch (err) {
    yield put(groupsActions.setYourGroupsList({loading: false}));
    yield showError(err);
  }
}
