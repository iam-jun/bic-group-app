import React from 'react';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import {IGroupMembers} from '~/interfaces/IGroup';
import modalActions from '~/store/modal/actions';
import groupsActions from '../../redux/actions';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';

interface IUseRemoveMember {
  groupId: number;
  selectedMember: IGroupMembers;
}

const useRemoveMember = ({groupId, selectedMember}: IUseRemoveMember) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();

  const {id: userId, fullname} = selectedMember;

  const removeMember = (userId: number, userFullname: string) => {
    dispatch(groupsActions.removeMember({groupId, userId, userFullname}));
  };

  const alertPayload = {
    iconName: 'UserXmark',
    title: i18next.t('groups:modal_confirm_remove_member:title'),
    content: i18next
      .t(`groups:modal_confirm_remove_member:final_alert`)
      .replace('{name}', `"${fullname}"`),
    ContentComponent: Text.BodyS,
    cancelBtn: true,
    cancelBtnProps: {
      textColor: theme.colors.purple60,
    },
    // @ts-ignore
    onConfirm: () => removeMember(userId, fullname),
    confirmLabel: i18next.t('groups:modal_confirm_remove_member:button_remove'),
    ConfirmBtnComponent: Button.Danger,
    children: null as React.ReactNode,
  };

  const groupsRemovedFromToString = (groupList: string[]) => {
    if (groupList.length === 1) {
      return groupList[0];
    }

    return `${groupList.length} other inner groups: ${groupList.join(', ')}`;
  };

  const getInnerGroupsNames = (
    innerGroups: any,
    renderInnerGroupsAlert: (
      message: string,
      innerGroups: string[],
    ) => React.ReactNode,
  ) => {
    let result: number; // for testing purpose
    const groupsRemovedFrom = [...innerGroups];

    if (groupsRemovedFrom.length === 0) {
      alertPayload.content = alertPayload.content.replace('{other groups}', '');
      result = 0;
    } else {
      const otherGroups = groupsRemovedFromToString(groupsRemovedFrom);
      alertPayload.content = alertPayload.content.replace(
        '{other groups}',
        ` and ${otherGroups}`,
      );

      // renderInnerGroupsText
      const count = innerGroups.length;
      let message = i18next
        .t('groups:modal_confirm_remove_member:alert_inner_groups')
        .replace('{0}', `${count}`);

      if (count === 1)
        message = message.replace(
          '1 other inner groups',
          'another inner group',
        );

      alertPayload.children = renderInnerGroupsAlert(message, innerGroups);
      result = 1;
    }

    dispatch(modalActions.showAlert(alertPayload));
    return result;
  };

  return {
    getInnerGroupsNames,
  };
};

export default useRemoveMember;
