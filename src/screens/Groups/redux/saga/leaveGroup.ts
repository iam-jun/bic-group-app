import i18next from 'i18next';
import { put, select, call } from 'redux-saga/effects';

import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import * as modalActions from '~/store/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import { groupPrivacy } from '~/constants/privacyTypes';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import showError from '~/store/commonSaga/showError';
import groupJoinStatus from '~/constants/groupJoinStatus';

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

    yield call(
      groupsDataHelper.leaveGroup, payload,
    );

    // update button Join/Cancel/View status on Discover groups
    yield put(
      groupsActions.editDiscoverGroupItem({
        id: payload,
        data: { joinStatus: groupJoinStatus.visitor },
      }),
    );

    if (privacy === groupPrivacy.secret) {
      yield call(navigationReplace);
    } else {
      yield call(
        navigateToGroup, payload,
      );
    }

    yield put(groupsActions.getGroupDetail(payload));

    const toastMessage: IToastMessage = {
      content: i18next.t('groups:modal_confirm_leave_group:success_message'),
      props: {
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.error('leaveGroup:', err);
    yield call(showError, err);
  }
}

export function* navigationReplace() {
  yield navigation.replace(groupStack.groups);
}

export function* navigateToGroup(groupId: string) {
  yield navigation.navigate(
    groupStack.groupDetail, {
      groupId,
      initial: true,
    },
  );
}
