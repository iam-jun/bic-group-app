import i18next from 'i18next';
import { put, select, call } from 'redux-saga/effects';

import groupApi from '~/api/GroupApi';
import groupsActions from '~/storeRedux/groups/actions';
import * as modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import showError from '~/storeRedux/commonSaga/showError';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

const navigation = withNavigation(rootNavigationRef);

export default function* leaveGroup({
  payload,
}: {
  payload: string;
  type: string;
}) {
  try {
    const { groups } = yield select();
    const privacy = groups?.groupDetail?.group?.privacy;

    yield call(groupApi.leaveGroup, payload);

    // update button Join/Cancel/View status on Discover groups
    yield call(useDiscoverGroupsStore.getState().doSetGroupStatus, payload, GroupJoinStatus.VISITOR);

    if (privacy === GroupPrivacyType.SECRET) {
      yield call(navigationPopToTop);
    } else {
      yield call(navigateToGroup, payload);
    }

    yield put(groupsActions.getGroupDetail({ groupId: payload }));

    const toastMessage: IToastMessage = {
      content: i18next.t('groups:modal_confirm_leave_group:success_message'),
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('leaveGroup:', err);
    yield call(showError, err);
  }
}

export function* navigationPopToTop() {
  yield navigation.popToTop();
}

export function* navigateToGroup(groupId: string) {
  yield navigation.navigate(
    groupStack.groupDetail, {
      groupId,
      initial: true,
    },
  );
}
