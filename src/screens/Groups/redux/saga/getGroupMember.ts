import {put, select} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import {IResponseData} from '~/interfaces/common';
import {IGroupGetMembers} from '~/interfaces/IGroup';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* getGroupMember({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    yield put(groupsActions.setLoadingGroupMembers(true));
    const {groupId, params} = payload;

    const {groups} = yield select();
    const {groupMember} = groups;
    const newGroupMembers = Object.assign({}, groupMember || {});
    const {skip = 0, canLoadMore = true} = newGroupMembers;
    if (canLoadMore) {
      const response: IResponseData = yield groupsDataHelper.getGroupMembers(
        groupId,
        {
          offset: skip,
          limit: appConfig.recordsPerPage,
          ...params,
        },
      );

      let newSkip = skip;
      let newCanLoadMore = canLoadMore;
      if (response) {
        Object.keys(response)?.map?.((role: any) => {
          // @ts-ignore
          newSkip = newSkip + response?.[role]?.data?.length || 0;
          if (newGroupMembers?.[role]) {
            const roleData = {...newGroupMembers[role]};
            newGroupMembers[role].data = roleData.data?.concat(
              // @ts-ignore
              response?.[role]?.data || [],
            );
          } else {
            // @ts-ignore
            newGroupMembers[role] = response?.[role];
          }
          newGroupMembers.skip = newSkip;
        });
        if (newSkip === skip) {
          newCanLoadMore = false;
        }
        newGroupMembers.canLoadMore = newCanLoadMore;
        yield put(groupsActions.setGroupMembers(newGroupMembers));
      }
    }
    yield put(groupsActions.setLoadingGroupMembers(false));
  } catch (e) {
    console.log(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${e} \x1b[0m`);
  }
}
