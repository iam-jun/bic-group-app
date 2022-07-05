import {put, call, select} from 'redux-saga/effects';

import groupsActions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {IToastMessage} from '~/interfaces/common';
import modalActions from '~/store/modal/actions';

const navigation = withNavigation(rootNavigationRef);

export default function* updateCommunityScheme({
  payload,
}: {
  type: string;
  payload: {communityId: number | string};
}): any {
  try {
    const {communityId} = payload || {};
    const schemeData = yield select(
      state => state?.groups?.permissionScheme?.creatingScheme?.data,
    ) || {};

    yield put(groupsActions.setCreatingScheme({creating: true}));

    const response = yield call(
      groupsDataHelper.updateCommunityScheme,
      communityId,
      schemeData,
    );

    yield put(groupsActions.setCreatingScheme({creating: false}));

    if (response?.data) {
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_update_scheme_success',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      };
      yield put(groupsActions.setCommunityScheme({data: response.data}));
      yield put(modalActions.showHideToastMessage(toastMessage));
    }
  } catch (err: any) {
    console.log('updateCommunityScheme error:', err);
    yield put(groupsActions.setCreatingScheme({creating: false}));
    yield call(showError, err);
  }
}
