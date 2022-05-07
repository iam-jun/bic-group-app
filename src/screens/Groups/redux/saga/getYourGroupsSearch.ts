import {put, call, select} from 'redux-saga/effects';

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
    return;
  }
  try {
    yield put(groupsActions.setYourGroupsSearch({loading: true, key}));
    const groups = yield call(
      groupsDataHelper.getCommunityGroups,
      communityId,
      {key, list_by: 'flat'},
    );
    const currentKey = yield select(
      state => state?.groups?.yourGroupsSearch?.key,
    );
    const list = !!currentKey?.trim?.() ? groups || [] : [];
    yield put(groupsActions.setYourGroupsSearch({loading: false, list}));
  } catch (err) {
    yield put(groupsActions.setYourGroupsSearch({loading: false}));
  }
}
