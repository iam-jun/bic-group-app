import i18next from 'i18next';
import { call, put } from 'redux-saga/effects';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';

export default function* approveAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    groupId: string;
    total: number;
  };
}) {
  const { communityId, groupId, total } = payload;
  try {
    const { actions } = useCommunitiesStore.getState();

    yield put(groupsActions.resetCommunityMemberRequests());

    // to show Empty screen component
    yield put(groupsActions.setCommunityMemberRequests({ loading: false }));

    yield call(groupApi.approveAllGroupMemberRequests, groupId);

    // to update userCount
    actions.getCommunity(communityId);

    const toastMessage: IToastMessage = {
      // TO BE REPLACED SOON, SHOULD USE MESSAGE FROM BE
      content: `${i18next.t('groups:text_approved_all')}`.replace('{0}', total.toString()),
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('approveAllCommunityMemberRequest: ', err);

    yield call(showError, err);
  }
}
