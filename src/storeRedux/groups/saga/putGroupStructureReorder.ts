import { put, call } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import { timeOut } from '~/utils/common';

const navigation = withNavigation(rootNavigationRef);

export default function* putGroupStructureReorder({
  payload,
}: {
  type: string;
  payload: {communityId: string; newOrder: any[]};
}): any {
  const { communityId, newOrder } = payload || {};
  try {
    if (!communityId || !newOrder) {
      console.warn('\x1b[31m🐣️ putGroupStructureReorder invalid params\x1b[0m');
      return;
    }
    yield put(actions.setGroupStructureReorder({ loading: true, newOrder }));
    const response = yield call(
      groupsDataHelper.putGroupStructureReorder,
      communityId,
      newOrder,
    );
    if (response?.data) {
      yield put(actions.getGroupStructureCommunityTree({
        communityId,
        showLoading: false,
      }));
      yield timeOut(600); // wait for refresh group tree
      yield put(actions.setGroupStructureReorder({ loading: false }));
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_reorder_success',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    } else {
      yield put(actions.setGroupStructureReorder({ loading: false, newOrder }));
      yield call(
        showError, response,
      );
    }
  } catch (err: any) {
    yield put(actions.setGroupStructureReorder({ loading: false, newOrder }));
    console.error(
      'putGroupStructureReorder error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
