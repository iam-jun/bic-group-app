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
  payload: {groupId: string; groupName: string};
}) {
  try {
    const {groupId, groupName} = payload;

    // @ts-ignore
    const response = yield call(groupsDataHelper.joinGroup, groupId);
    const joinStatus = response?.data?.joinStatus;
    const hasRequested = joinStatus === groupJoinStatus.requested;

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({id: groupId, data: {joinStatus}}),
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
