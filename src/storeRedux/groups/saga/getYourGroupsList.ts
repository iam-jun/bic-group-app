import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';

export default function* getYourGroupsList({
  payload: communityId,
}: {
  type: string;
  payload: string;
}): any {
  try {
    yield put(groupsActions.setYourGroupsList({ loading: true }));
    const response = yield call(
      groupApi.getCommunityGroups,
      communityId,
      { listBy: 'flat' },
    );

    const groups = response.data;
    yield put(
      groupsActions.setYourGroupsList({ loading: false, list: groups || [] }),
    );
  } catch (err) {
    yield put(groupsActions.setYourGroupsList({ loading: false }));
    yield showError(err);
  }
}
