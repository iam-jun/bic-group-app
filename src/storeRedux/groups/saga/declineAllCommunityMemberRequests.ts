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
  payload: {groupId: string; total:number;};
}) {
  const { groupId, total } = payload;
  try {
    yield call(groupApi.declineAllGroupMemberRequests, groupId);

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('declineAllCommunityMemberRequests: ', err);

    yield call(showError, err);
  }
}
