import { put, call } from 'redux-saga/effects';
import { cloneDeep } from 'lodash';

import actions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';
import API_ERROR_CODE from '~/constants/apiErrorCode';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { sortFixedRoles } from '../../../screens/groups/helper';
import { getMemberRoleIndex } from '../../../screens/PermissionScheme/CreatePermissionScheme/helper';

const navigation = withNavigation(rootNavigationRef);

export default function* getGroupScheme({
  payload,
}: {
  type: string;
  payload: {communityId: string; schemeId: string};
}): any {
  const { communityId, schemeId } = payload || {};
  try {
    const response = yield call(
      groupApi.getGroupScheme,
      communityId,
      schemeId,
    );

    const dataWithOrderedFixRole = sortFixedRoles(response.data);

    // storing this data for comparing original group scheme and editing scheme
    yield put(actions.setGroupScheme({ data: cloneDeep(dataWithOrderedFixRole) }));

    // provide full groupScheme detail for updating group scheme
    const memberRoleIndex = getMemberRoleIndex(dataWithOrderedFixRole);
    yield put(actions.setCreatingScheme({
      data: cloneDeep(dataWithOrderedFixRole),
      memberRoleIndex,
    }));
  } catch (err: any) {
    console.error(
      'getGroupScheme error:', err,
    );

    if (err?.code === API_ERROR_CODE.GROUP.SCHEME_NOT_FOUND) {
      yield put(actions.getSchemes({ communityId, isRefreshing: true }));
      navigation.goBack();
    }

    yield call(
      showError, err,
    );
  }
}
