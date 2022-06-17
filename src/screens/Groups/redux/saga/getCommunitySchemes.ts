import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getCommunitySchemes({
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
      yield put(
        actions.setCommunityScheme({loading: false, data: response?.data}),
      );
    } else {
      yield put(actions.setCommunityScheme({loading: false}));
    }
  } catch (err) {
    yield put(actions.setCommunityScheme({loading: false}));
    console.log('getSchemes error:', err);
    yield call(showError, err);
  }
}
