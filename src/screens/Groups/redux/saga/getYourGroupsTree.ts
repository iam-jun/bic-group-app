import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getYourGroupsTree({
  payload: communityId,
}: {
  type: string;
  payload: string;
}): any {
  try {
    yield put(groupsActions.setYourGroupsTree({ loading: true }));
    const response = yield call(
      groupsDataHelper.getCommunityGroups,
      communityId,
      { listBy: 'tree' },
    );
    const groups = response.data;
    yield put(
      groupsActions.setYourGroupsTree({ loading: false, list: groups || [] }),
    );
  } catch (err) {
    yield put(groupsActions.setYourGroupsTree({ loading: false }));
    yield showError(err);
  }
}
