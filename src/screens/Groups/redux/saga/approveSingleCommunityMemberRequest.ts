import i18next from 'i18next';
import {call, put, select} from 'redux-saga/effects';
import approveDeclineCode from '~/constants/approveDeclineCode';
import {IToastMessage} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import modalActions from '~/store/modal/actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
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
  const {communityId, requestId, fullName} = payload;
  try {
    yield call(
      groupsDataHelper.approveSingleCommunityMemberRequest,
      communityId,
      requestId,
    );

    // Update data state
    const {groups} = yield select();
    const {total, ids, items} = groups.communityMemberRequests;
    const requestItems = {...items};
    delete requestItems[requestId];
    yield put(
      groupsActions.setCommunityMemberRequests({
        total: total - 1,
        ids: ids.filter((item: string) => item !== requestId),
        items: requestItems,
      }),
    );

    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_approved_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getCommunityDetail({communityId})); // to update user_count
  } catch (err: any) {
    console.log('approveSingleCommunityMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANCELED) {
      yield put(
        groupsActions.editCommunityMemberRequest({
          id: requestId,
          data: {isCanceled: true},
        }),
      );
      return;
    }

    yield call(showError, err);
  }
}
