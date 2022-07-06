import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import {sortFixedRoles} from '../../helper';

export default function* getCommunityScheme({
  payload,
}: {
  type: string;
  payload: {communityId: number | string};
}): any {
  try {
    const {communityId} = payload || {};
    yield put(actions.setCommunityScheme({loading: true, data: undefined}));
    const response = yield call(
      groupsDataHelper.getCommunityScheme,
      communityId,
    );
    if (response?.data) {
      const dataWithOrderedFixRole = sortFixedRoles(response?.data);
      yield put(
        actions.setCommunityScheme({
          loading: false,
          data: dataWithOrderedFixRole,
        }),
      );
    } else {
      yield put(actions.setCommunityScheme({loading: false}));
    }
  } catch (err: any) {
    yield put(actions.setCommunityScheme({loading: false}));
    console.log('getCommunityScheme error:', err);
    if (err?.code !== API_ERROR_CODE.GROUP.SCHEME_NOT_FOUND) {
      yield call(showError, err);
    }
  }
}
