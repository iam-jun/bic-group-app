import i18next from 'i18next';
import { put, call } from 'redux-saga/effects';

import groupsDataHelper from '../../helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import { refreshGroupMembers } from '.';
import showError from '~/store/commonSaga/showError';

export default function* removeMember({
  payload,
}: {
  type: string;
  payload: {groupId: string; userId: string; userFullname: string};
}) {
  try {
    const { groupId, userId, userFullname } = payload;

    yield call(groupsDataHelper.removeUsers, groupId, [userId]);

    yield call(refreshGroupMembers, groupId);

    const toastMessage: IToastMessage = {
      content: i18next
        .t('common:message_remove_member_success')
        .replace('{n}', userFullname),
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error(
      '\x1b[33m',
      'addMembers catch: ',
      JSON.stringify(err, undefined, 2),
      '\x1b[0m',
    );
    yield showError(err);
  }
}
