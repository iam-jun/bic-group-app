import { put, call } from 'redux-saga/effects';
import { IToastMessage } from '~/interfaces/common';
import { IGroupSetAdmin } from '~/interfaces/IGroup';
import { refreshGroupMembers } from './index';
import groupApi from '../../../api/GroupApi';
import * as modalActions from '~/storeRedux/modal/actions';
import showError from '~/storeRedux/commonSaga/showError';

export default function* setGroupAdmin({
  payload,
}: {
  type: string;
  payload: IGroupSetAdmin;
}) {
  try {
    const { groupId, userIds } = payload;

    yield call(
      groupApi.setGroupAdmin, groupId, userIds,
    );

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_set_admin:success_message',
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
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
