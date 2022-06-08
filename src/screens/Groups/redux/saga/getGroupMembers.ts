import {put, select, call} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import {IGroupGetMembers} from '~/interfaces/IGroup';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import actions from '../actions';
import showError from '~/store/commonSaga/showError';

export default function* getGroupMembers({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    const {groupId, params} = payload;
    const {groups} = yield select();
    const groupMembers = groups.groupMembers;
    const {canLoadMore, offset} = groupMembers;

    yield put(actions.setGroupMembers({loading: offset === 0}));

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getGroupMembers, groupId, {
      limit: appConfig.recordsPerPage,
      offset: offset,
      ...params,
    });

    let newDataCount = 0;
    let newDataObj = {};
    Object.keys(resp)?.map?.((role: string) => {
      newDataCount += resp[role].data.length;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: resp[role].name,
          user_count: resp[role].user_count,
          data: groupMembers?.[role]?.data
            ? [...groupMembers?.[role]?.data, ...resp[role].data]
            : [...resp[role].data],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      offset: offset + newDataCount,
      ...newDataObj,
    };

    yield put(actions.setGroupMembers(newData));
  } catch (err) {
    console.log(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${err} \x1b[0m`);
    yield call(showError, err);
  }
}
