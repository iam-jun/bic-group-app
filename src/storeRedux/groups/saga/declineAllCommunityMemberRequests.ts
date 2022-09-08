import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';

import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';

export default function* declineAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: string; total:number; callback?: () => void};
}) {
  const { communityId, total } = payload;
  try {
    yield call(groupApi.declineAllCommunityMemberRequests, communityId);

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('declineAllCommunityMemberRequests: ', err);

    yield call(showError, err);
  }
}
