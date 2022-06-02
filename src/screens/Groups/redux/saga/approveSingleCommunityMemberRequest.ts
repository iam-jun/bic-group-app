import i18next from 'i18next';
import {call, put} from 'redux-saga/effects';
import approveDeclineCode from '~/constants/approveDeclineCode';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import {approvalError} from '.';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* approveSingleCommunityMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    communityId: number;
    requestId: number;
    fullName: string;
    callback: () => void;
  };
}) {
  const {communityId, requestId, fullName, callback} = payload;
  try {
    yield groupsDataHelper.approveSingleCommunityMemberRequest(
      communityId,
      requestId,
    );

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
    yield put(groupsActions.getCommunityDetail(communityId)); // to update user_count
  } catch (err: any) {
    console.log('approveSingleCommunityMemberRequest: ', err);

    // TODO: TO UPDATE FOR BOTH COMMUNITY & GROUP
    // if (err?.code === approveDeclineCode.CANNOT_APPROVE) {
    //   yield approvalError(communityId, err.code, fullName);
    //   return;
    // }

    yield call(showError, err);
  }
}
