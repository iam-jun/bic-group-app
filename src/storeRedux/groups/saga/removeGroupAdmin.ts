import { put, call } from 'redux-saga/effects';

import { IToastMessage } from '~/interfaces/common';
import { IGroupRemoveAdmin } from '~/interfaces/IGroup';
import { refreshGroupMembers } from './index';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '~/storeRedux/modal/actions';
import showError from '~/storeRedux/commonSaga/showError';

export default function* removeGroupAdmin({
  payload,
}: {
  type: string;
  payload: IGroupRemoveAdmin;
}) {
  try {
    const { groupId, userId } = payload;

    yield call(
      groupApi.removeGroupAdmin, groupId, userId,
    );

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_remove_admin:success_message',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    // refresh group detail after adding new admins
    yield call(
      refreshGroupMembers, groupId,
    );
  } catch (err) {
    console.error(
      'setGroupAdmin: ', err,
    );
    yield call(
      showError, err,
    );
  }
}
