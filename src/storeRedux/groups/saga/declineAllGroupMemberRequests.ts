import i18next from 'i18next';
import { call } from 'redux-saga/effects';

import { IToastMessage } from '~/interfaces/common';
import showToastError from '~/store/helper/showToastError';
import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';

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
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_declined_all')}`.replace('{0}', total.toString()),
    };
    useModalStore.getState().actions.showToast(toastMessage);
  } catch (err: any) {
    console.error('declineAllGroupMemberRequests: ', err);

    showToastError(err);
  }
}
