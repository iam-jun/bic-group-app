import i18next from 'i18next';
import { put, call } from 'redux-saga/effects';
import approveDeclineCode from '~/constants/approveDeclineCode';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { IToastMessage } from '~/interfaces/common';
import showError from '~/storeRedux/commonSaga/showError';
import modalActions from '~/storeRedux/modal/actions';
import groupApi from '../../../api/GroupApi';
import groupsActions from '../actions';

export default function* cancelJoinCommunity({
  payload,
}: {
  type: string;
  payload: { communityId: string; communityName: string };
}) {
  const { communityId, communityName } = payload;
  try {
    yield call(
      groupApi.cancelJoinCommunity, communityId,
    );

    // update button Join/Cancel/View status on Discover communities
    yield put(
      groupsActions.editDiscoverCommunityItem({
        id: communityId,
        data: { joinStatus: groupJoinStatus.visitor },
      }),
    );

    yield put(groupsActions.getCommunityDetail({ communityId }));

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_cancel_join_community')} ${communityName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error('cancelJoinCommunity catch', err);

    if (err?.code === approveDeclineCode.APPROVED) {
      yield put(
        groupsActions.editDiscoverCommunityItem({
          id: communityId,
          data: { joinStatus: groupJoinStatus.member },
        }),
      );
      yield put(
        groupsActions.getCommunityDetail({ communityId, loadingPage: true }),
      );
    }

    yield showError(err);
  }
}
