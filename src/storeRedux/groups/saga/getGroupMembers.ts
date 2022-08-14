import { put, select, call } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import { IGroupGetMembers } from '~/interfaces/IGroup';
import groupApi from '../../../api/GroupApi';
import actions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';

export default function* getGroupMembers({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    const { groups } = yield select();
    const { groupId, params, isRefreshing } = payload;
    const { groupMembers } = groups;
    const { canLoadMore, offset } = groupMembers;

    yield put(actions.setGroupMembers({ loading: isRefreshing ? true : offset === 0 }));

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resp = yield call(
      groupApi.getGroupMembers, groupId, {
        limit: appConfig.recordsPerPage,
        offset: isRefreshing ? 0 : offset,
        ...params,
      },
    );

    let newDataCount = 0;
    let newDataObj = {};
    const members = resp.data;
    Object.keys(members)?.forEach?.((role: string) => {
      newDataCount += members[role]?.data?.length || 0;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: members[role]?.name,
          userCount: members[role]?.userCount,
          data:
            isRefreshing || !groupMembers?.[role]?.data
              ? [...members[role]?.data || []]
              : [...groupMembers?.[role]?.data || [], ...members[role]?.data || []],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    yield put(actions.setGroupMembers(newData));
  } catch (err) {
    console.error(`\x1b[31m🐣️ getGroupMember | getGroupMember : ${err} \x1b[0m`);
    yield call(
      showError, err,
    );
  }
}
