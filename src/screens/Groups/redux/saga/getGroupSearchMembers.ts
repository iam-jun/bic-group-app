import {put, call, select} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';
import {IGroupGetMembers} from '~/interfaces/IGroup';

export default function* getGroupSearchMembers({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    const {groups} = yield select();
    const {canLoadMore, data} = groups.groupSearchMembers;
    yield put(actions.setGroupSearchMembers({loading: data.length === 0}));

    const {groupId, params} = payload;

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getGroupMembers, groupId, {
      limit: appConfig.recordsPerPage,
      offset: data.length,
      ...params,
    });

    // update search results data
    const newData = {
      loading: false,
      canLoadMore:
        resp.group_admin.data.length + resp.group_member.data.length ===
        appConfig.recordsPerPage,
      data: [...data, ...resp.group_admin.data, ...resp.group_member.data],
    };

    yield put(actions.setGroupSearchMembers(newData));
  } catch (err) {
    console.log('getGroupSearchMembers error:', err);
    yield call(showError, err);
  }
}
