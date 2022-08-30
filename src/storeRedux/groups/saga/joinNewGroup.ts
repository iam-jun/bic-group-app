import i18next from 'i18next';
import { put, call } from 'redux-saga/effects';

import { AxiosResponse } from 'axios';
import groupApi from '~/api/GroupApi';
import groupsActions from '~/storeRedux/groups/actions';
import * as modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import groupJoinStatus from '~/constants/groupJoinStatus';
import showError from '~/storeRedux/commonSaga/showError';

export default function* joinNewGroup({
  payload,
}: {
  type: string;
  payload: {groupId: string; groupName: string};
}) {
  try {
    const { groupId, groupName } = payload;

    const response:AxiosResponse = yield call(groupApi.joinGroup, groupId);
    const joinStatus = response?.data?.joinStatus;
    const hasRequested = joinStatus === groupJoinStatus.requested;

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({ id: groupId, data: { joinStatus } }),
    );

    if (hasRequested) {
      yield put(groupsActions.getGroupDetail({ groupId }));
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_group')} ${groupName}`,
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
      return;
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_successfully_join_group')} ${groupName}`,
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail({ groupId }));
  } catch (err) {
    console.error('joinNewGroup catch', err);
    yield call(showError, err);
  }
}
