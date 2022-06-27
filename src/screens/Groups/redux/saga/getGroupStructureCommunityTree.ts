import {put, call} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getGroupStructureCommunityTree({
  payload: communityId,
}: {
  type: string;
  payload: number | string;
}): any {
  try {
    yield put(groupsActions.setGroupStructureCommunityTree({loading: true}));
    const response =
      (yield call(groupsDataHelper.getCommunityGroupTree, communityId)) || [];

    if (response?.data) {
      yield put(
        groupsActions.setGroupStructureCommunityTree({
          loading: false,
          data: response.data,
        }),
      );
    } else {
      yield put(groupsActions.setGroupStructureCommunityTree({loading: false}));
    }
  } catch (err) {
    yield put(groupsActions.setGroupStructureCommunityTree({loading: false}));
    yield showError(err);
  }
}
