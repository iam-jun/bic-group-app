import { call, put, select } from 'redux-saga/effects';

import { IGetYourGroupsSearch } from '~/interfaces/IGroup';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* getYourGroupsSearch({
  payload,
}: {
  type: string;
  payload: IGetYourGroupsSearch;
}): any {
  const { key, communityId } = payload || {};
  if (!key?.trim?.()) {
    yield put(
      groupsActions.setYourGroupsSearch({ loading: false, list: [], key: '' }),
    );
    return;
  }
  try {
    yield put(groupsActions.setYourGroupsSearch({ loading: true, key }));
    const response = yield call(
      groupsDataHelper.getCommunityGroups,
      communityId,
      { key, list_by: 'flat' },
    );
    const currentKey = yield select(
      (state) => state?.groups?.yourGroupsSearch?.key,
    );
    const groups = response.data;
    const list = currentKey?.trim?.() ? groups || [] : [];
    yield put(groupsActions.setYourGroupsSearch({ loading: false, list }));
  } catch (err) {
    yield put(groupsActions.setYourGroupsSearch({ loading: false }));
  }
}
