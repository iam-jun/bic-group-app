import i18next from 'i18next';
import {put, call, select} from 'redux-saga/effects';

import approveDeclineCode from '~/constants/approveDeclineCode';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* approveSingleGroupMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    groupId: string;
    requestId: string;
    fullName: string;
    callback: () => void;
  };
}) {
  const {groupId, requestId, fullName, callback} = payload;
  try {
    yield call(
      groupsDataHelper.approveSingleGroupMemberRequest,
      groupId,
      requestId,
    );

    // Update data state
    const {groups} = yield select();
    const {total, ids, items} = groups.groupMemberRequests;
    const requestItems = {...items};
    delete requestItems[requestId];
    yield put(
      groupsActions.setGroupMemberRequests({
        total: total - 1,
        ids: ids.filter((item: string) => item !== requestId),
        items: requestItems,
      }),
    );

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
        rightIcon: 'UserGroup',
        rightText: 'Members',
        onPressRight: callback,
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail(groupId)); // to update userCount
  } catch (err: any) {
    console.log('approveSingleGroupMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANCELED) {
      yield put(
        groupsActions.editGroupMemberRequest({
          id: requestId,
          data: {isCanceled: true},
        }),
      );
      return;
    }

    yield call(showError, err);
  }
}
