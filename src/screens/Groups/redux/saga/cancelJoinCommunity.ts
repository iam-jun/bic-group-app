import i18next from 'i18next';
import {put, call} from 'redux-saga/effects';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* cancelJoinCommunity({
  payload,
}: {
  type: string;
  payload: {communityId: number; communityName: string};
}) {
  try {
    const {communityId, communityName} = payload;

    yield call(groupsDataHelper.cancelJoinCommunity, communityId);

    // update button Join/Cancel/View status on Discover communities
    yield put(
      groupsActions.editDiscoverCommunityItem({
        id: communityId,
        data: {join_status: 1},
      }),
    );

    yield put(groupsActions.getCommunityDetail(communityId));

    const toastMessage: IToastMessage = {
      content: `${i18next.t(
        'groups:text_cancel_join_community',
      )} ${communityName}`,
      props: {
        type: 'success',
      },
    };

    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('cancelJoinCommunity catch', err);
    yield call(showError, err);
  }
}
