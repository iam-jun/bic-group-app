import {put, call} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {IGetYourGroupsSearch} from '~/interfaces/IGroup';

export default function* getYourGroupsSearch({
  payload,
}: {
  type: string;
  payload: IGetYourGroupsSearch;
}): any {
  const {key, communityId} = payload || {};
  if (!key?.trim?.()) {
    yield put(
      groupsActions.setYourGroupsSearch({loading: false, list: [], key: ''}),
    );
  }
  try {
    yield put(groupsActions.setYourGroupsTree({loading: true, key}));
    const groups = yield call(
      groupsDataHelper.getCommunityGroups,
      communityId,
      {key, list_by: 'flat'},
    );
    yield put(
      groupsActions.setYourGroupsSearch({loading: false, list: groups || []}),
    );
  } catch (err) {
    yield put(groupsActions.setYourGroupsTree({loading: false}));
    yield showError(err);
  }
}
