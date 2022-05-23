import {put, call} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import {IGroupRemoveAdmin} from '~/interfaces/IGroup';
import {refreshGroupMembers} from '.';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import showError from '~/store/commonSaga/showError';

export default function* removeGroupAdmin({
  payload,
}: {
  type: string;
  payload: IGroupRemoveAdmin;
}) {
  try {
    const {groupId, userId} = payload;

    yield call(groupsDataHelper.removeGroupAdmin, groupId, userId);

    const toastMessage: IToastMessage = {
      content: 'groups:modal_confirm_remove_admin:success_message',
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));

    // refresh group detail after adding new admins
    yield call(refreshGroupMembers, groupId);
  } catch (err) {
    console.log('setGroupAdmin: ', err);
    yield call(showError, err);
  }
}
