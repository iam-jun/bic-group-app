import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';
import { ToastMessageProps } from '~/beinComponents/ToastMessage/NormalToastMessage';
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

    let toastProps: ToastMessageProps;
    if (callback) {
      toastProps = {
        textProps: { useI18n: true },
        type: 'informative',
        rightIcon: 'UserGroup',
        rightText: 'Members',
        onPressRight: callback,
      };
    } else {
      toastProps = {
        textProps: { useI18n: true },
        type: 'informative',
      };
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
      props: toastProps,
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('approveAllCommunityMemberRequest: ', err);

    yield call(showError, err);
  }
}
