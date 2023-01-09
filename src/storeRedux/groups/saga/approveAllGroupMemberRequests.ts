import { call, put } from 'redux-saga/effects';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import groupsActions from '../actions';

export default function* approveAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; total: number;};
}) {
  const { groupId } = payload;
  try {
    yield put(groupsActions.resetGroupMemberRequests());

    // to show Empty screen component
    yield put(groupsActions.setGroupMemberRequests({ loading: false }));

    const response = yield call(groupApi.approveAllGroupMemberRequests, groupId);

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    showToastSuccess(response);
  } catch (err: any) {
    console.error('approveAllGroupMemberRequests: ', err);

    showToastError(err);
  }
}
