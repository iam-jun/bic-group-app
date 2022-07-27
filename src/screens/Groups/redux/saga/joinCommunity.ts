import { put, call } from 'redux-saga/effects';
import i18next from 'i18next';

import { AxiosResponse } from 'axios';
import modalActions from '~/store/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import groupsActions from '~/screens/Groups/redux/actions';
import showError from '~/store/commonSaga/showError';
import groupJoinStatus from '~/constants/groupJoinStatus';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* joinCommunity({
  payload,
}: {
  type: string;
  payload: {communityId: string; communityName: string};
}) {
  try {
    const { communityId, communityName } = payload;

    const response: AxiosResponse = yield call(
      groupsDataHelper.joinCommunity, communityId,
    );
    const join_status = response?.data?.join_status;
    const hasRequested = join_status === groupJoinStatus.requested;

    // update button Join/Cancel/View status on Discover communities
    yield put(groupsActions.editDiscoverCommunityItem({
      id: communityId,
      data: { join_status },
    }));

    if (hasRequested) {
      yield put(groupsActions.getCommunityDetail({ communityId }));
      const toastMessage: IToastMessage = {
        content: `${i18next.t('groups:text_request_join_community')} ${communityName}`,
        props: {
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
      return;
    }

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_successfully_join_community')} ${communityName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getCommunityDetail({ communityId }));
  } catch (err) {
    console.error(
      'joinCommunity catch', err,
    );
    yield call(
      showError, err,
    );
  }
}
