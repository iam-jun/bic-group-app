import { put, call, select } from 'redux-saga/effects';

import showError from '~/storeRedux/commonSaga/showError';
import groupsDataHelper from '~/api/GroupsDataHelper';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import groupsActions from '~/storeRedux/groups/actions';

const navigation = withNavigation(rootNavigationRef);

export default function* postCreateSchemePermission({
  payload,
}: {
  type: string;
  payload: {communityId: string};
}): any {
  try {
    const { communityId } = payload || {};
    const schemeData = yield select((state) => state?.groups?.permissionScheme?.creatingScheme?.data) || {};

    yield put(groupsActions.setCreatingScheme({ creating: true }));

    const response = yield call(
      groupsDataHelper.postCreateSchemePermission,
      communityId,
      schemeData,
    );

    yield put(groupsActions.setCreatingScheme({ creating: false }));

    if (response && response.data) {
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_create_scheme_success',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      };
      yield put(groupsActions.setCommunityScheme({ data: response.data }));
      yield put(modalActions.showHideToastMessage(toastMessage));
    }
  } catch (err) {
    console.error(
      'postCreateSchemePermission error:', err,
    );
    yield put(groupsActions.setCreatingScheme({ creating: false }));
    yield call(
      showError, err,
    );
  }
}
