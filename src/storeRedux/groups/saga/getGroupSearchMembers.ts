import { put, call, select } from 'redux-saga/effects';

import actions from '~/storeRedux/groups/actions';
import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import showError from '~/storeRedux/commonSaga/showError';
import { IGroupGetMembers } from '~/interfaces/IGroup';

export default function* getGroupSearchMembers({
  payload,
}: {
  type: string;
  payload: IGroupGetMembers;
}) {
  try {
    const { groups } = yield select();
    const { canLoadMore, data } = groups.groupSearchMembers;
    yield put(actions.setGroupSearchMembers({ loading: data.length === 0 }));

    const { groupId, params } = payload;

    if (!canLoadMore) return;

    const resp = yield call(
      groupApi.getGroupMembers, groupId, {
        limit: appConfig.recordsPerPage,
        offset: data.length,
        ...params,
      },
    );

    let newDataCount = 0;
    let newDataArr: any = [];
    const members = resp.data;
    Object.keys(members)?.forEach?.((role: string) => {
      newDataCount += members[role]?.data?.length || 0;
      newDataArr = [...newDataArr, ...members[role]?.data || []];
    });

    // update search results data
    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      data: [...data, ...newDataArr],
    };

    yield put(actions.setGroupSearchMembers(newData));
  } catch (err) {
    console.error(
      'getGroupSearchMembers error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
