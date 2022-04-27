import i18next from 'i18next';
import {put, call} from 'redux-saga/effects';

import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IToastMessage} from '~/interfaces/common';
import groupJoinStatus from '~/constants/groupJoinStatus';
import showError from '~/store/commonSaga/showError';

export default function* joinNewGroup({
  payload,
}: {
  type: string;
  payload: {groupId: number; groupName: string};
}) {
  try {
    const {groupId, groupName} = payload;

    // @ts-ignore
    const response = yield call(groupsDataHelper.joinGroup, groupId);
    const join_status = response?.data?.join_status;
    const hasRequested = join_status === groupJoinStatus.requested;

    if (hasRequested) {
      yield put(groupsActions.getGroupDetail(groupId));
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_group')} ${groupName}`,
        props: {
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
      return;
    }

    yield put(groupsActions.getJoinedGroups());

    const toastMessage: IToastMessage = {
      content: `${i18next.t(
        'groups:text_successfully_join_group',
      )} ${groupName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail(groupId, true));
  } catch (err) {
    console.error('joinNewGroup catch', err);
    yield showError(err);
  }
}
