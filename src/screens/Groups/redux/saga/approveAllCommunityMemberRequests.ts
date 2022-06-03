import {ToastMessageProps} from '~/beinComponents/ToastMessage/NormalToastMessage';
import i18next from 'i18next';
import {call, put, select} from 'redux-saga/effects';
import approveDeclineCode from '~/constants/approveDeclineCode';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import {approvalError} from '.';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* approveAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: number; total: number; callback?: () => void};
}) {
  const {communityId, total, callback} = payload;
  try {
    yield put(groupsActions.resetCommunityMemberRequests());

    yield groupsDataHelper.approveAllCommunityMemberRequests(
      communityId,
      total,
    );

    // to update user_count
    yield put(groupsActions.getCommunityDetail(communityId));

    let toastProps: ToastMessageProps;
    if (callback) {
      toastProps = {
        textProps: {useI18n: true},
        type: 'success',
        rightIcon: 'UsersAlt',
        rightText: 'Members',
        onPressRight: callback,
      };
    } else {
      toastProps = {
        textProps: {useI18n: true},
        type: 'success',
      };
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_all', {count: total})}`,
      props: toastProps,
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.log('approveAllCommunityMemberRequest: ', err);

    // TODO: TO UPDATE FOR BOTH COMMUNITY & GROUP
    // if (err?.code === approveDeclineCode.CANNOT_APPROVE_ALL) {
    //   yield approvalError(communityId, err.code, fullName);
    //   return;
    // }

    yield call(showError, err);
  }
}
