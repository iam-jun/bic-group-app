import { call } from 'redux-saga/effects';

import groupsDataHelper from '~/api/GroupsDataHelper';
import showError from '~/storeRedux/commonSaga/showError';

export default function* declineAllCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: string; callback?: () => void};
}) {
  const { communityId } = payload;
  try {
    yield call(
      groupsDataHelper.declineAllCommunityMemberRequests, communityId,
    );
  } catch (err: any) {
    console.error('declineAllCommunityMemberRequests: ', err);

    yield call(
      showError, err,
    );
  }
}
