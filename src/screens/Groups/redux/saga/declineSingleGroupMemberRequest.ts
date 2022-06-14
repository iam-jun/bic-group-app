import {call, put} from 'redux-saga/effects';

import approveDeclineCode from '~/constants/approveDeclineCode';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* declineSingleGroupMemberRequest({
  payload,
}: {
  type: string;
  payload: {groupId: number; requestId: number; fullName: string};
}) {
  const {groupId, requestId, fullName} = payload;
  try {
    yield call(
      groupsDataHelper.declineSingleGroupMemberRequest,
      groupId,
      requestId,
    );
    yield put(groupsActions.getGroupDetail(groupId));
  } catch (err: any) {
    console.log('declineSingleGroupMemberRequest: ', err);

    if (err?.code === approveDeclineCode.CANNOT_DECLINE) {
      // TODO: dispatch action to show hint message on request item
      return;
    }

    yield call(showError, err);
  }
}
