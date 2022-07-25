import {put, call, select} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* deleteCommunityScheme({
  payload,
}: {
  type: string;
  payload: {communityId: string};
}): any {
  const {communityId} = payload || {};
  const {data} =
    (yield select(state => state.groups?.permissionScheme?.communityScheme)) ||
    {};
  try {
    yield put(
      actions.setCommunityScheme({
        loading: false,
        deleting: true,
        data,
      }),
    );
    const response = yield call(
      groupsDataHelper.deleteCommunityScheme,
      communityId,
    );
    if (response?.data) {
      yield put(
        actions.setCommunityScheme({
          loading: false,
          data: undefined,
          deleting: false,
        }),
      );
    } else {
      yield put(
        actions.setCommunityScheme({loading: false, data, deleting: false}),
      );
    }
  } catch (err: any) {
    yield put(
      actions.setCommunityScheme({loading: false, data, deleting: false}),
    );
    console.log('getCommunityScheme error:', err);
    yield call(showError, err);
  }
}
