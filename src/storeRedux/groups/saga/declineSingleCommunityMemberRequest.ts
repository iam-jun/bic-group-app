import { call, put, select } from 'redux-saga/effects';
import i18next from 'i18next';

import groupsActions from '~/storeRedux/groups/actions';
import modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import groupApi from '~/api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import approveDeclineCode from '~/constants/approveDeclineCode';

export default function* declineSingleCommunityMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    groupId: string;
    requestId: string;
    fullName: string;
  };
}) {
  const {
    groupId, requestId, fullName,
  } = payload;
  try {
    yield call(
      groupApi.declineSingleGroupMemberRequest,
      groupId,
      requestId,
    );

    // Update data state
    const { groups } = yield select();
    const { total, ids, items } = groups.communityMemberRequests;
    const requestItems = { ...items };
    delete requestItems[requestId];
    yield put(groupsActions.setCommunityMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    }));

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (error: any) {
    console.error('declineSingleCommunityMemberRequest: ', error);

    if (error?.code === approveDeclineCode.CANCELED
      || error?.code === approveDeclineCode.APPROVED
      || error?.code === approveDeclineCode.DECLINED) {
      yield put(groupsActions.editCommunityMemberRequest({
        id: requestId,
        data: { noticeMessage: error?.meta?.message },
      }));
      return;
    }

    yield call(showError, error);
  }
}
