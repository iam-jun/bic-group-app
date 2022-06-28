import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {IToastMessage} from '~/interfaces/common';
import modalActions from '~/store/modal/actions';

const navigation = withNavigation(rootNavigationRef);

export default function* putGroupStructureReorder({
  payload,
}: {
  type: string;
  payload: {communityId: number; newOrder: number[]};
}): any {
  const {communityId, newOrder} = payload || {};
  try {
    if (!communityId || !newOrder) {
      console.log(`\x1b[31m🐣️ putGroupStructureReorder invalid params\x1b[0m`);
      return;
    }
    yield put(actions.setGroupStructureReorder({loading: true, newOrder}));
    const response = yield call(
      groupsDataHelper.putGroupStructureReorder,
      communityId,
      newOrder,
    );
    if (response?.data) {
      yield put(actions.setGroupStructureReorder({loading: false}));
      yield put(actions.getGroupStructureCommunityTree(communityId));
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_reorder_success',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    } else {
      yield put(actions.setGroupStructureReorder({loading: false, newOrder}));
    }
  } catch (err: any) {
    yield put(actions.setGroupStructureReorder({loading: false, newOrder}));
    console.log('putGroupStructureReorder error:', err);
    yield call(showError, err);
  }
}
