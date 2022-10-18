import { put, call } from 'redux-saga/effects';

import { IToastMessage } from '~/interfaces/common';
import { IGroupRemoveAdmin } from '~/interfaces/IGroup';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '~/storeRedux/modal/actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '../actions';

export default function* removeGroupAdmin({
  payload,
}: {
  type: string;
  payload: IGroupRemoveAdmin;
}) {
  try {
    const { groupId, userId } = payload;

    const response = yield call(groupApi.removeGroupAdmin, groupId, userId);

    yield put(groupsActions.getGroupMembers({ groupId, isRefreshing: true }));

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || 'common:text_success_message',
      props: { type: 'success' },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (error) {
    console.error('removeGroupAdmin error:', error);
    yield call(showError, error);
  }
}
