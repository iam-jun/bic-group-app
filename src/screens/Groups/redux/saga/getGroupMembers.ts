import {put, select, call} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import {IGroupGetMembers} from '~/interfaces/IGroup';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import actions from '../actions';

export default function* getGroupMembers({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    const {groupId, params} = payload;
    const {groups} = yield select();
    const {canLoadMore, group_admin, group_member} = groups.groupMembers;

    yield put(
      actions.setGroupMembers({
        loading: group_admin.data.length + group_member.data.length === 0,
      }),
    );

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getGroupMembers, groupId, {
      limit: appConfig.recordsPerPage,
      offset: group_admin.data.length + group_member.data.length,
      ...params,
    });

    const newData = {
      loading: false,
      canLoadMore:
        resp.group_admin.data.length + resp.group_member.data.length ===
        appConfig.recordsPerPage,
      group_admin: {
        // append data when loading more
        data: [...group_admin.data, ...resp.group_admin.data],
        user_count: resp.group_admin.user_count,
      },
      group_member: {
        // append data when loading more
        data: [...group_member.data, ...resp.group_member.data],
        user_count: resp.group_member.user_count,
      },
    };

    yield put(actions.setGroupMembers(newData));
  } catch (e) {
    console.log(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${e} \x1b[0m`);
  }
}
