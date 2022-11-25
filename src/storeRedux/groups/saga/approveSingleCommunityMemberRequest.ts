import i18next from 'i18next';
import { call, put, select } from 'redux-saga/effects';
import approveDeclineCode from '~/constants/approveDeclineCode';
import { IToastMessage } from '~/interfaces/common';
import useCommunitiesStore from '~/store/entities/communities';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';

export default function* approveSingleCommunityMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    requestId: string;
    fullName: string;
  };
}) {
  const {
    communityId, requestId, fullName,
  } = payload;
  try {
    const { actions } = useCommunitiesStore.getState();
    yield call(
      groupApi.approveSingleCommunityMemberRequest,
      communityId,
      requestId,
    );

    // Update data state
    const { groups } = yield select();
    const { total, ids, items } = groups.communityMemberRequests;
    const requestItems = { ...items };
    delete requestItems[requestId];
    yield put(groupsActions.setCommunityMemberRequests({
      total: total - 1,
      ids: ids.filter((item: string) => item !== requestId),
      items: requestItems,
    }));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    // to update userCount
    actions.getCommunity(communityId);
  } catch (error: any) {
    console.error('approveSingleCommunityMemberRequest: ', error);

    if (error?.code === approveDeclineCode.CANCELED
      || error?.code === approveDeclineCode.APPROVED
      || error?.code === approveDeclineCode.DECLINED) {
      yield put(groupsActions.editCommunityMemberRequest({
        id: requestId,
        data: { noticeMessage: error?.meta?.message },
      }));
      return;
    }

    yield call(showError, error);
  }
}
