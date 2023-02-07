import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';
import { IToastMessage } from '~/interfaces/common';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import showToast from '~/store/helper/showToast';
import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import groupsActions from '../actions';

export default function* approveAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; total: number;};
}) {
  const { groupId, total } = payload;
  try {
    yield put(groupsActions.resetGroupMemberRequests());

    // to show Empty screen component
    yield put(groupsActions.setGroupMemberRequests({ loading: false }));

    yield call(groupApi.approveAllGroupMemberRequests, groupId);

    // to update userCount
    useGroupDetailStore.getState().actions.getGroupDetail({ groupId });

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
    };
    showToast(toastMessage);
  } catch (err: any) {
    console.error('approveAllGroupMemberRequests: ', err);

    showToastError(err);
  }
}
