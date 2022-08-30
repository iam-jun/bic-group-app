import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';
import { BaseToastProps } from '~/baseComponents/Toast/BaseToast';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';

export default function* approveAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: string; total: number; callback?: () => void};
}) {
  const { communityId, total, callback } = payload;
  try {
    yield put(groupsActions.resetCommunityMemberRequests());

    // to show Empty screen component
    yield put(groupsActions.setCommunityMemberRequests({ loading: false }));

    yield call(groupApi.approveAllCommunityMemberRequests, communityId);

    // to update userCount
    yield put(groupsActions.getCommunityDetail({ communityId }));

    let toastProps: BaseToastProps = {};
    if (callback) {
      toastProps = {
        buttonText: 'Member',
        onButtonPress: callback,
      };
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
      props: toastProps,
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('approveAllCommunityMemberRequest: ', err);

    yield call(showError, err);
  }
}
