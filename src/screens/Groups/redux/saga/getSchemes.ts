import { put, call } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getSchemes({
  payload,
}: {
  type: string;
  payload: {communityId: string; isRefreshing?: boolean};
}): any {
  try {
    const { communityId, isRefreshing } = payload || {};

    // avoid appearing Loading when updating group scheme successfully and navigating back
    if (!isRefreshing) {
      yield put(actions.setSchemes({ loading: true, data: undefined }));
    }

    const response = yield call(
      groupsDataHelper.getSchemes, communityId,
    );
    if (response?.data) {
      const { communityScheme, groupSchemes } = response.data || {};
      const allSchemes: any = {};
      if (communityScheme?.id) {
        allSchemes[communityScheme.id] = communityScheme;
      }
      groupSchemes?.forEach?.((scheme: any) => { allSchemes[scheme?.id] = scheme; });
      yield put(actions.setSchemes({ loading: false, data: response?.data, allSchemes }));
    } else {
      yield put(actions.setSchemes({ loading: false }));
    }
  } catch (err) {
    yield put(actions.setSchemes({ loading: false }));
    console.error(
      'getSchemes error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
