import { put, call, select } from 'redux-saga/effects';

import groupsActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import { sortFixedRoles } from '../../../screens/groups/helper';

const navigation = withNavigation(rootNavigationRef);

export default function* updateCommunityScheme({
  payload,
}: {
  type: string;
  payload: { communityId: string };
}): any {
  try {
    const { communityId } = payload || {};
    const schemeData = yield select((state) => state?.groups?.permissionScheme?.creatingScheme?.data) || {};

    yield put(groupsActions.setCreatingScheme({ creating: true }));

    const response = yield call(
      groupApi.updateCommunityScheme,
      communityId,
      schemeData,
    );

    yield put(groupsActions.setCreatingScheme({ creating: false }));

    const dataWithOrderedFixRole = sortFixedRoles(response.data);
    navigation.goBack();
    const toastMessage: IToastMessage = {
      content: 'communities:permission:text_update_scheme_success',
    };
    yield put(groupsActions.setCommunityScheme({ data: dataWithOrderedFixRole }));
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err: any) {
    console.error(
      'updateCommunityScheme error:', err,
    );
    yield put(groupsActions.setCreatingScheme({ creating: false }));
    yield call(
      showError, err,
    );
  }
}
