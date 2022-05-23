import {put, call} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {IGetCommunityGroup} from '~/interfaces/IGroup';

export default function* getCommunityGroups({
  payload,
}: {
  type: string;
  payload: {id: number; params?: IGetCommunityGroup};
}) {
  try {
    const {id, params} = payload;
    // @ts-ignore
    const groups = yield call(groupsDataHelper.getCommunityGroups, id, params);
    if (groups?.length > 0) {
      yield put(groupsActions.setCommunityGroups(groups));
    } else {
      yield put(groupsActions.setCommunityGroups([]));
    }
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield put(groupsActions.setCommunityGroups([]));
    yield showError(err);
  }
}
