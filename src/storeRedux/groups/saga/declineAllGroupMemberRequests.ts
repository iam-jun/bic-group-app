import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';

import { IToastMessage } from '~/interfaces/common';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '~/api/GroupApi';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; total: number; callback?: () => void};
}) {
  const { groupId, total } = payload;
  try {
    yield call(groupApi.declineAllGroupMemberRequests, groupId);

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('declineAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
