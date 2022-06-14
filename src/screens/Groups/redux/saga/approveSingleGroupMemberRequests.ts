import i18next from 'i18next';
import {put, call} from 'redux-saga/effects';

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
    groupId: number;
    requestId: number;
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

    yield put(groupsActions.getGroupDetail(groupId));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
        rightIcon: 'UsersAlt',
        rightText: 'Members',
        onPressRight: callback,
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err: any) {
    console.log('approveSingleGroupMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANCELED) {
      // TODO: dispatch action to show hint message on request item
      return;
    }

    yield call(showError, err);
  }
}
