import { call } from 'redux-saga/effects';

import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* declineAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: number; callback?: () => void};
}) {
  const { communityId } = payload;
  try {
    yield call(groupsDataHelper.declineAllCommunityMemberRequests, communityId);
  } catch (err: any) {
    console.log('declineAllCommunityMemberRequests: ', err);

    yield call(showError, err);
  }
}
