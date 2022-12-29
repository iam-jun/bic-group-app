import i18next from 'i18next';
import { put, call, select } from 'redux-saga/effects';

import approveDeclineCode from '~/constants/approveDeclineCode';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';

export default function* approveSingleGroupMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    groupId: string;
    requestId: string;
    fullName: string;
  };
}) {
  const { groupId, requestId, fullName } = payload;
  try {
    yield call(
      groupApi.approveSingleGroupMemberRequest,
      groupId,
      requestId,
    );

    // Update data state
    const { groups } = yield select();
    const { total, ids, items } = groups.groupMemberRequests;
    const requestItems = { ...items };
    delete requestItems[requestId];
    yield put(groupsActions.setGroupMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    }));

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
    };
    useModalStore.getState().actions.showToast(toastMessage);
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId }); // to update userCount
  } catch (error: any) {
    console.error('approveSingleGroupMemberRequest: ', error);

    if (error?.code === approveDeclineCode.CANCELED
    || error?.code === approveDeclineCode.APPROVED
    || error?.code === approveDeclineCode.DECLINED) {
      yield put(groupsActions.editGroupMemberRequest({
        id: requestId,
        data: { noticeMessage: error?.meta?.message },
      }));
      return;
    }

    showToastError(error);
  }
}
