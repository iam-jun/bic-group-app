import {ToastMessageProps} from '~/beinComponents/ToastMessage/NormalToastMessage';
import i18next from 'i18next';
import {call, put} from 'redux-saga/effects';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* approveAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; callback?: () => void};
}) {
  const {groupId, callback} = payload;
  try {
    yield put(groupsActions.resetGroupMemberRequests());

    yield call(groupsDataHelper.approveAllGroupMemberRequests, groupId);

    // to update user_count
    yield put(groupsActions.getGroupDetail(groupId));

    let toastProps: ToastMessageProps;
    if (callback) {
      toastProps = {
        textProps: {useI18n: true},
        type: 'success',
        rightIcon: 'UserGroup',
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
      content: `${i18next.t('groups:text_approved_all')}`,
      props: toastProps,
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.log('approveAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
