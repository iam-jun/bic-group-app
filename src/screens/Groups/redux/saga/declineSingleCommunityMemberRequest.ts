import {call, put, select} from 'redux-saga/effects';
import i18next from 'i18next';

import groupsActions from '~/screens/Groups/redux/actions';
import modalActions from '~/store/modal/actions';
import {IToastMessage} from '~/interfaces/common';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import approveDeclineCode from '~/constants/approveDeclineCode';
import {approvalError} from '.';

export default function* declineSingleCommunityMemberRequest({
  payload,
}: {
  type: string;
  payload: {
    communityId: number;
    requestId: number;
    fullName: string;
  };
}) {
  const {communityId, requestId, fullName} = payload;
  try {
    const {groups} = yield select();
    const {total, ids, items} = groups.communityMemberRequests;

    // Update data state
    const requestItems = {...items};
    delete requestItems[requestId];
    yield put(
      groupsActions.setCommunityMemberRequests({
        total: total - 1,
        ids: ids.filter((item: number) => item !== requestId),
        items: requestItems,
      }),
    );

    yield groupsDataHelper.declineSingleCommunityMemberRequest(
      communityId,
      requestId,
    );
    const toastMessage: IToastMessage = {
      content: `${i18next.t('groups:text_declined_user')} ${fullName}`,
      props: {
        textProps: {useI18n: true},
        type: 'success',
      },
      toastType: 'normal',
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
    yield put(groupsActions.getCommunityDetail(communityId)); // to update user_count
  } catch (err: any) {
    console.log('declineSingleCommunityMemberRequest: ', err);

    // TODO: TO UPDATE FOR BOTH COMMUNITY & GROUP
    // if (err?.code === approveDeclineCode.CANNOT_DECLINE) {
    //   yield approvalError(communityId, err.code, fullName);
    //   return;
    // }

    yield call(showError, err);
  }
}
