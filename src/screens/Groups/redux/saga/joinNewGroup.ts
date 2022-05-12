import i18next from 'i18next';
import {put, call, select} from 'redux-saga/effects';

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

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({id: groupId, data: {join_status}}),
    );

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

    const toastMessage: IToastMessage = {
      content: `${i18next.t(
        'groups:text_successfully_join_group',
      )} ${groupName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err) {
    console.error('joinNewGroup catch', err);
    yield showError(err);
  }
}
