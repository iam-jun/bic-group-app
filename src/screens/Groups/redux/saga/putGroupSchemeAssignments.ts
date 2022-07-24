import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IToastMessage} from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import {IPayloadGroupSchemeAssignments} from '~/interfaces/IGroup';

export default function* putGroupSchemeAssignments({
  payload,
}: {
  type: string;
  payload: IPayloadGroupSchemeAssignments;
}): any {
  const {communityId, data, currentAssignments} = payload || {};
  try {
    if (!communityId || !data) {
      console.log(
        `\x1b[31m🐣️ putGroupSchemeAssignments invalid params\x1b[0m`,
      );
      return;
    }
    yield put(
      actions.setGroupSchemeAssigning({
        loading: true,
        data,
        currentAssignments,
      }),
    );
    const response = yield call(
      groupsDataHelper.putGroupSchemeAssignments,
      payload,
    );
    if (response?.data) {
      yield put(
        actions.setGroupSchemeAssigning({loading: false, currentAssignments}),
      );
      yield put(actions.getSchemes({communityId, isRefreshing: true}));
      yield put(
        actions.getGroupSchemeAssignments({communityId, showLoading: false}),
      );

      const toastMessage: IToastMessage = {
        content: 'communities:permission:text_update_group_scheme_success',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    } else {
      yield put(
        actions.setGroupSchemeAssigning({
          loading: false,
          data,
          currentAssignments,
        }),
      );
      yield call(showError, response);
    }
  } catch (err: any) {
    yield put(
      actions.setGroupSchemeAssigning({
        loading: false,
        data,
        currentAssignments,
      }),
    );
    console.log('putGroupSchemeAssignments error:', err);
    yield call(showError, err);
  }
}
