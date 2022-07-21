import { put, call, select } from 'redux-saga/effects';

import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/navigator/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import groupsActions from '~/screens/Groups/redux/actions';

const navigation = withNavigation(rootNavigationRef);

export default function* postCreateSchemePermission({
  payload,
}: {
  type: string;
  payload: {communityId: number};
}): any {
  try {
    const { communityId } = payload || {};
    const schemeData = yield select(
      (state) => state?.groups?.permissionScheme?.creatingScheme?.data,
    ) || {};

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
    console.error('postCreateSchemePermission error:', err);
    yield put(groupsActions.setCreatingScheme({ creating: false }));
    yield call(showError, err);
  }
}
