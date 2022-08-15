import { put, call, select } from 'redux-saga/effects';

import groupsActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';

const navigation = withNavigation(rootNavigationRef);

export default function* updateGroupScheme({
  payload,
}: {
  type: string;
  payload: {communityId: string; schemeId: string};
}): any {
  try {
    const { communityId, schemeId } = payload || {};
    const schemeData = yield select((state) => state?.groups?.permissionScheme?.creatingScheme?.data) || {};

    yield put(groupsActions.setCreatingScheme({ creating: true }));

    const response = yield call(
      groupApi.updateGroupScheme,
      communityId,
      schemeId,
      schemeData,
    );

    yield put(groupsActions.setCreatingScheme({ creating: false }));

    if (response?.data) {
      // reload schemes when updating successfully
      yield put(groupsActions.getSchemes({ communityId, isRefreshing: true }));
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_update_scheme_success',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    }
  } catch (err: any) {
    console.error(
      'updateGroupScheme error:', err,
    );
    yield put(groupsActions.setCreatingScheme({ creating: false }));
    yield call(
      showError, err,
    );
  }
}
