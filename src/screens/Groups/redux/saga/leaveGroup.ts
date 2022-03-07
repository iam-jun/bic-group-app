import i18next from 'i18next';
import {Platform} from 'react-native';
import {put, select} from 'redux-saga/effects';

import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import groupsActions from '~/screens/Groups/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {IToastMessage} from '~/interfaces/common';
import {groupPrivacy} from '~/constants/privacyTypes';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {showError} from '.';

const navigation = withNavigation(rootNavigationRef);

export default function* leaveGroup({
  payload,
}: {
  payload: number;
  type: string;
}) {
  try {
    const {groups} = yield select();
    const privacy = groups?.groupDetail?.group?.privacy;

    yield groupsDataHelper.leaveGroup(payload);
    yield put(groupsActions.getJoinedGroups());

    if (privacy === groupPrivacy.secret) {
      if (Platform.OS !== 'web') navigation.replace(groupStack.groups);
      else {
        const topParentGroupId = groups?.joinedGroups[0]?.id;
        navigation.navigate(groupStack.groupDetail, {
          groupId: topParentGroupId,
          initial: true,
        });
      }
    } else {
      navigation.navigate(groupStack.groupDetail, {
        groupId: payload,
        initial: true,
      });
    }

    yield put(groupsActions.setLoadingPage(true));
    yield put(groupsActions.getGroupDetail(payload));

    const toastMessage: IToastMessage = {
      content: i18next.t('groups:modal_confirm_leave_group:success_message'),
      props: {
        type: 'success',
      },
    };
    yield put(modalActions.showHideToastMessage(toastMessage));
  } catch (err) {
    console.log('leaveGroup:', err);
    yield showError(err);
  }
}
