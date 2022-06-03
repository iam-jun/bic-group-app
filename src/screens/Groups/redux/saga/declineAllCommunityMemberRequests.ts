import {call, put, select} from 'redux-saga/effects';
import i18next from 'i18next';

import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import approveDeclineCode from '~/constants/approveDeclineCode';
import {approvalError} from '.';

export default function* declineAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: number; total: number; callback?: () => void};
}) {
  const {communityId, total, callback} = payload;
  try {
    yield groupsDataHelper.declineAllCommunityMemberRequests(
      communityId,
      total,
    );

    if (callback) callback();
  } catch (err: any) {
    console.log('declineAllCommunityMemberRequests: ', err);

    // TODO: TO UPDATE FOR BOTH COMMUNITY & GROUP
    // if (err?.code === approveDeclineCode.CANNOT_DECLINE_ALL) {
    //   yield approvalError(communityId, err.code);
    //   return;
    // }

    yield showError(err);
  }
}
