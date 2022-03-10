import i18next from 'i18next';

import modalActions from '~/store/modal/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {IGroup} from '~/interfaces/IGroup';
import {ITheme} from '~/theme/interfaces';

export const checkLastAdmin = async (
  groupId: string | number,
  dispatch: any,
  mainCallback: () => void,
  onPressRight: () => void,
  type: 'leave' | 'remove' = 'leave',
) => {
  let testingAdminCount: number; // for testing purpose
  try {
    const data = await groupsDataHelper.getGroupMembers(Number(groupId), {
      offset: 0,
      limit: 1,
    });
    const adminCount = data?.group_admin?.user_count;
    testingAdminCount = adminCount;

    if (adminCount > 1) {
      mainCallback();
    } else {
      dispatch(
        modalActions.showHideToastMessage({
          content: `groups:error:last_admin_${type}`,
          props: {
            type: 'error',
            textProps: {useI18n: true},
            rightIcon: 'UsersAlt',
            rightText: 'Members',
            onPressRight: onPressRight,
          },
          toastType: 'normal',
        }),
      );
    }
  } catch (err) {
    testingAdminCount = -1;
    console.error('[ERROR] error while fetching group members', err);
    dispatch(
      modalActions.showHideToastMessage({
        content: 'error:http:unknown',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }

  return testingAdminCount;
};

export const alertLeaveGroup = async (
  groupId: string | number,
  dispatch: any,
  username: string,
  theme: ITheme,
  onConfirm: () => void,
) => {
  const alertPayload = {
    iconName: 'SignOutAlt',
    title: i18next.t('groups:modal_confirm_leave_group:title'),
    content: i18next.t('groups:modal_confirm_leave_group:description'),
    ContentComponent: Text.BodyS,
    cancelBtn: true,
    cancelBtnProps: {
      textColor: theme.colors.primary7,
    },
    onConfirm: onConfirm,
    confirmLabel: i18next.t('groups:modal_confirm_leave_group:button_leave'),
    ConfirmBtnComponent: Button.Danger,
  };

  let testingInnerGroupCount: number; // for testing purpose

  // Handling leaving other inner groups
  try {
    const res = await groupsDataHelper.getUserInnerGroups(
      Number(groupId),
      username,
    );
    const innerGroups = res.data.inner_groups.map(
      (group: IGroup) => group.name,
    );
    testingInnerGroupCount = innerGroups.length;

    if (innerGroups.length > 0) {
      alertPayload.content =
        alertPayload.content +
        ` ${i18next.t('groups:modal_confirm_leave_group:leave_inner_groups')}`;

      const groupsLeaveToString = innerGroups.join(', ');
      alertPayload.content = alertPayload.content.replace(
        '{0}',
        groupsLeaveToString,
      );
    }

    dispatch(modalActions.showAlert(alertPayload));
  } catch (err) {
    testingInnerGroupCount = -1;
    console.log('[ERROR] error while fetching user inner groups', err);
    dispatch(
      modalActions.showHideToastMessage({
        content: 'error:http:unknown',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }

  return testingInnerGroupCount;
};
